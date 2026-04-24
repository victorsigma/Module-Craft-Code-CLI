import item_components from "../../../../assets/jsons/item_components.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js"

import { clearEvents, getJsonFile, getTextFileEvent, makeComponentFile, makeEventFileWithPrefab, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from "../../../../utils/constants.js";
import { propertiesAsync } from "../../../../utils/readProperties.js";
import { resolveAddonName, resolveNamespace } from "../../../../core/nameResolver.js";
import { toCamelCase } from "../../../../utils/stringManager.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import chalk from "chalk";
import ora from "ora";

/**
 * @param {Options} options 
 * @returns 
 */
export const slabComponent = async (options) => {
    options.namespace = await resolveNamespace(options.config);

    options.name = `${options.namespace}:slab_item`

    const projectName = resolveAddonName(options.config);

    const content = `import { slabItemOnUseOnEvent } from "../../events/items/slabItem/onUseOnEvent";

/**
 * Componente: ${options.name}
 * Descripción: Generic component with custom slabs item${projectName}
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

        slabEvent = slabEvent.replaceAll("addon_name", options.config["addon.name"]);
        slabEvent = slabEvent.replaceAll("namespace", options.namespace);

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