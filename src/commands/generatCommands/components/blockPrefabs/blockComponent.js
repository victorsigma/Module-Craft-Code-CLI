import block_components from "../../../../assets/jsons/block_components.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js";

import { clearEvents, getJsonFile, makeComponentFile, makeEventFile, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_BLOCK_COMPONENTS, PATH_BLOCK_EVENTS } from "../../../../utils/constants.js";
import { resolveAddonName, resolveElementName } from "../../../../core/nameResolver.js";
import { componentBuilder } from "../../../../core/componentBuilder.js";
import { toCamelCase } from "../../../../utils/stringManager.js";
import { language } from "../../../../utils/i18n.js";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

/**
 * @param {Options} options 
 * @returns 
 */
export const blockComponent = async (options) => {

    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "item_component");

    const questions = [
        {
            type: 'checkbox',
            name: 'selections',
            message: language.__("component.block.selections"),
            choices: [
                { name: 'beforeOnPlayerPlace', value: 'beforeOnPlayerPlace' },
                { name: 'onEntityFallOn', value: 'onEntityFallOn' },
                { name: 'onPlace', value: 'onPlace' },
                { name: 'onPlayerDestroy', value: 'onPlayerDestroy' },
                { name: 'onPlayerInteract', value: 'onPlayerInteract' },
                { name: 'onRandomTick', value: 'onRandomTick' },
                { name: 'onStepOff', value: 'onStepOff' },
                { name: 'onStepOn', value: 'onStepOn' },
                { name: 'onTick', value: 'onTick' },
            ],
        },
    ];

    const response = await inquirer.prompt(questions);

    // Validar si el usuario no selecciona ningún evento
    if (!response.selections.length) return console.log(chalk.red(language.__("component.block.invalid")));

    response.selections.forEach(evento => {
        console.log(chalk.yellow(`- ${evento}`));
    });

    const projectName = resolveAddonName(options.config);

    const content = componentBuilder({
        name: options.name,
        events: response.selections,
        projectName,
        description: options.description,
        type: "blocks"
    })

    const spinner = ora(language.__("component.block.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_BLOCK_COMPONENTS, content);
        await clearEvents(`${PATH_BLOCK_EVENTS}/${toCamelCase(options.name.split(':')[1])}`);

        for (const selection of response.selections) {
            await makeEventFile(options.name, selection, PATH_BLOCK_EVENTS);
        }

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