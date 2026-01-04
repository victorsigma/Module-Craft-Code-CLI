import item_components from "../../../../assets/jsons/item_components.json" with { type: 'json' };

import { clearEvents, getJsonFile, getTextFileEvent, makeComponentFile, makeEventFileWithPrefab, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from "../../../../utils/constants.js";
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

    options.name = `${options.namespace}:slab_item`

    const content = `import { slabItemOnUseOnEvent } from "../../events/items/slabItem/onUseOnEvent";

/**
 * Componente: ${options.name}
 * Descripción: ${options.description}${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 */

export const ${toCamelCase(options.name.split(':')[1])}Component = {
    onUseOn: slabItemOnUseOnEvent
}`;

    const spinner = ora(language.__("component.item.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_ITEM_COMPONENTS, content);
        await clearEvents(`${PATH_ITEM_EVENTS}/slabItem`);


        let slabEvent = await getTextFileEvent('slabItem/onUseOnEvent.js');

        if (!slabEvent) return console.log(language.__("operations.error.8"));

        slabEvent = slabEvent.replace(/addon_name/g, config["addon.name"]);
        slabEvent = slabEvent.replace(/namespace/g, options.namespace);

        await makeEventFileWithPrefab(options.name, slabEvent, "onUseOn", PATH_ITEM_EVENTS);

        const fileName = `item_components.json`
        let fileData = { ...item_components };
        if (await validateFileAsync(fileName)) {
            fileData = await getJsonFile(fileName);
            if (!fileData.components.includes(options.name)) {
                fileData.components.push(options.name)
            }
            await makeFile('item_components.json', JSON.stringify(fileData, null, 2))
        } else {
            fileData.components.push(options.name)
            await makeFile('item_components.json', JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("component.item.spinner.succeed").replace('${options.name}', options.name))));
        await updateIndexFile('item', options.name, `./components/items/${toCamelCase(options.name.split(':')[1])}`);
    } catch (error) {
        spinner.fail(chalk.red(language.__("component.item.spinner.error")));
        console.error(error);
    }
}