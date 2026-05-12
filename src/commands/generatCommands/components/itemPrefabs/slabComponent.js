import item_components from "../../../../assets/jsons/item_components.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js"

import { clearEvents, getJsonFile, makeComponentFile, makeEventFileWithPrefab, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from "../../../../utils/constants.js";
import { resolveAddonName, resolveNamespace } from "../../../../core/nameResolver.js";
import { componentBuilder } from "../../../../core/componentBuilder.js";
import { eventTemplates } from "../../../../core/templateProcessor.js";
import { toCamelCase } from "../../../../utils/stringManager.js";
import { language } from "../../../../utils/i18n.js";
import chalk from "chalk";
import ora from "ora";

/**
 * @param {Options} options 
 * @returns 
 */
export const slabComponent = async (options) => {
    options.namespace = await resolveNamespace(options.config);

    const events = ["onUseOn"]

    options.name = `${options.namespace}:slab_item`

    const projectName = resolveAddonName(options.config);

    options.description = `Generic component with custom slabs item`

    const content = componentBuilder({
        name: options.name,
        events,
        projectName,
        description: options.description,
        type: "items"
    })

    const spinner = ora(language.__("component.item.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_ITEM_COMPONENTS, content);
        await clearEvents(`${PATH_ITEM_EVENTS}/slabItem`);

        const eventsData = await eventTemplates({
            events,
            addonName: options.config["addon.name"],
            namespace: options.namespace,
            templatePath: "slabItem/"
        })

        await Promise.all(
            eventsData.map(eventData =>
                makeEventFileWithPrefab(
                    options.name,
                    eventData.content,
                    eventData.event,
                    PATH_ITEM_EVENTS
                )
            )
        );

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