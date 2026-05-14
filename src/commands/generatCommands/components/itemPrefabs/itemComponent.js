import item_components from "../../../../assets/jsons/item_components.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js";

import { clearEvents, getJsonFile, makeComponentFile, makeEventFile, makeFile, updateIndexFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from "../../../../utils/constants.js";
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
export const itemComponent = async (options) => {

    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "item_component");

    const questions = [
        {
            type: 'checkbox',
            name: 'selections',
            message: language.__("component.item.selections"),
            choices: [
                { name: 'onBeforeDurabilityDamage', value: 'onBeforeDurabilityDamage' },
                { name: 'onCompleteUse', value: 'onCompleteUse' },
                { name: 'onConsume', value: 'onConsume' },
                { name: 'onHitEntity', value: 'onHitEntity' },
                { name: 'onMineBlock', value: 'onMineBlock' },
                { name: 'onUse', value: 'onUse' },
                { name: 'onUseOn', value: 'onUseOn' },
            ],
        },
    ];

    const response = await inquirer.prompt(questions);

    // Validar si el usuario no selecciona ningún evento
    if (!response.selections.length) return console.log(chalk.red(language.__("component.item.invalid")));

    response.selections.forEach(evento => {
        console.log(chalk.yellow(`- ${evento}`));
    });
    
    const projectName = resolveAddonName(options.config);

    const content = componentBuilder({
        name: options.name,
        events: response.selections,
        projectName,
        description: options.description,
        type: "items"
    })

    const spinner = ora(language.__("component.item.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_ITEM_COMPONENTS, content);
        await clearEvents(`${PATH_ITEM_EVENTS}/${toCamelCase(options.name.split(':')[1])}`);

        for (const selection of response.selections) {
            await makeEventFile(options.name, selection, PATH_ITEM_EVENTS);
        }
        
        const fileName = `item_components.json`
        let fileData = {...item_components};
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