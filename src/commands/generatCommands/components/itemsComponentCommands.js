import item_components from "../../../assets/jsons/item_components.json" with { type: 'json' };
import { Options } from "../../../typedefs.js"

import { toCamelCase, uppercaseFirstLetter } from '../../../utils/stringManager.js';
import { clearEvents, getJsonFile, makeComponentFile, makeEventFile, makeFile, updateIndexFile, validateFileAsync } from '../../../utils/fileOperations.js';
import { ONLY_BEHAVIOR, PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from '../../../utils/constants.js';
import { propertiesAsync } from '../../../utils/readProperties.js';
import { resolveAddonName, resolveElementName } from "../../../core/nameResolver.js";
import { slabComponent } from "./itemPrefabs/slabComponent.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const itemsComponent = new Command('item').alias('i')
    .description(language.__("component.item.description"));
itemsComponent.option('-n, --name <string>', language.__("component.item.option.n"), 'namespace:item_component');
itemsComponent.option('-d, --description <string>', language.__("component.item.option.n"), 'description');
itemsComponent.addOption(new Option('-p, --prefab <string>', language.__("component.item.option.p")).default("none").choices(["none", "slab"]));



itemsComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("component.item.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    options.config = config;

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright(language.__("component.item.exits.2"))
    );

    if (options.prefab === "slab") {
        await slabComponent(options)
    } else {
        await defaultComponent(options)
    }
    process.exit(0);
});

/**
 * @param {Options} options 
 * @returns 
 */
const defaultComponent = async (options) => {

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

    const imports = response.selections.map(event => {
        return `import { ${toCamelCase(options.name.split(':')[1])}${uppercaseFirstLetter(event)}Event } from "../../events/items/${toCamelCase(options.name.split(':')[1])}/${event}Event";`;
    }).join('\n');

    const events = response.selections.map(event => {
        return `${event}: ${toCamelCase(options.name.split(':')[1])}${uppercaseFirstLetter(event)}Event`;
    }).join(',\n\t');

    const projectName = resolveAddonName(options.config);

    const content = `${imports}

/**
 * Componente: ${options.name}
 * Descripción: ${options.description}${projectName}
 */

export const ${toCamelCase(options.name.split(':')[1])}Component = {
    ${events}
}`;

    const spinner = ora(language.__("component.item.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_ITEM_COMPONENTS, content);
        await clearEvents(`${PATH_ITEM_EVENTS}/${toCamelCase(options.name.split(':')[1])}`);
        for (let i = 0; i < response.selections.length; i++) {
            await makeEventFile(options.name, response.selections[i], PATH_ITEM_EVENTS);
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


export default itemsComponent;