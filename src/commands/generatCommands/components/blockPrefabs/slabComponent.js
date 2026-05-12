import block_components from "../../../../assets/jsons/block_components.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js"

import { clearEvents, getJsonFile, makeComponentFile, makeEventFileWithPrefab, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_BLOCK_COMPONENTS, PATH_BLOCK_EVENTS } from "../../../../utils/constants.js";
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

    const events = ["onPlayerInteract"]

    options.name = `${options.namespace}:slab`

    const projectName = resolveAddonName(options.config);

    options.description = `Generic component with custom slabs`

    const content = componentBuilder({
        name: options.name,
        events,
        projectName,
        description: options.description,
        type: "blocks"
    })

    const spinner = ora(language.__("component.item.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_BLOCK_COMPONENTS, content);
        await clearEvents(`${PATH_BLOCK_EVENTS}/slab`);

        const eventsData = await eventTemplates({
            events,
            addonName: options.config["addon.name"],
            namespace: options.namespace,
            templatePath: "blocks/slab"
        })

        await Promise.all(
            eventsData.map(eventData =>
                makeEventFileWithPrefab(
                options.name,
                eventData.content,
                eventData.event,
                PATH_BLOCK_EVENTS
                )
            )
        );

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