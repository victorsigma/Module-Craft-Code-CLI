import block_components from "../../../../assets/jsons/block_components.json" with { type: 'json' };

import { clearEvents, getJsonFile, getTextFileEvent, makeComponentFile, makeEventFileWithPrefab, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_BLOCK_COMPONENTS, PATH_BLOCK_EVENTS } from "../../../../utils/constants.js";
import { propertiesAsync } from "../../../../utils/readProperties.js";
import { toCamelCase } from "../../../../utils/stringManager.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import chalk from "chalk";
import ora from "ora";

export const slabComponent = async (options) => {
    const config = await propertiesAsync();

    if (Array.isArray(config['addon.namespace'])) {
        console.log(chalk.yellow(language.__("addon.namespace.multiple")));
        const namespace = await selectFromArray(config['addon.namespace']);
        options.namespace = namespace
    } else {
        options.namespace = config['addon.namespace']
    }

    options.name = `${options.namespace}:slab`

    const content = `import { slabOnPlayerInteractEvent } from "../../events/blocks/slab/onPlayerInteractEvent";

/**
 * Componente: ${options.name}
 * Descripción: Generic component with custom slabs${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 */

export const slabComponent = {
    onPlayerInteract: slabOnPlayerInteractEvent
}`;

    const spinner = ora(language.__("component.item.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_BLOCK_COMPONENTS, content);
        await clearEvents(`${PATH_BLOCK_EVENTS}/slab`);


        let slabEvent = await getTextFileEvent('blocks/slab/onPlayerInteractEvent.js');

        if (!slabEvent) return console.log(language.__("operations.error.8"));

        slabEvent = slabEvent.replace(/addon_name/g, config["addon.name"]);
        slabEvent = slabEvent.replace(/namespace/g, options.namespace);

        await makeEventFileWithPrefab(options.name, slabEvent, "onPlayerInteract", PATH_BLOCK_EVENTS);

        const fileName = `block_components.json`
        let fileData = { ...block_components };
        if (await validateFileAsync(fileName)) {
            fileData = await getJsonFile(fileName);
            if (!fileData.components.includes(options.name)) {
                fileData.components.push(options.name)
            }
            await makeFile('block_components.json', JSON.stringify(fileData, null, 2))
        } else {
            fileData.components.push(options.name)
            await makeFile('block_components.json', JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("component.block.spinner.succeed").replace('${options.name}', options.name))));
        await updateIndexFile('block', options.name, `./components/blocks/${toCamelCase(options.name.split(':')[1])}`);
    } catch (error) {
        spinner.fail(chalk.red(language.__("component.block.spinner.error")));
        console.error(error);
    }
}