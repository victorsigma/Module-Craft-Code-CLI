import item_components from "../../../assets/jsons/item_components.json" with { type: 'json' };

import { toCamelCase, toSnackCase, uppercaseFirstLetter } from '../../../utils/stringManager.js';
import { clearEvents, makeComponentFile, makeEventFile, makeFile, updateIndexFile, validateFile } from '../../../utils/fileOperations.js';
import { ONLY_BEHAVIOR, PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from '../../../utils/constants.js';
import { propertiesAsync } from '../../../utils/readProperties.js';
import { selectFromArray } from '../../../utils/forms.js';
import { language } from "../../../utils/i18n.js";
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const itemsComponent = new Command('item').alias('i')
    .description(language.__("component.item.description"));
itemsComponent.option('-n, --name <string>', language.__("component.item.option.n"), 'namespace:item_component');
itemsComponent.option('-d, --description <string>', language.__("component.item.option.n"), 'description');


itemsComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("component.item.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright(language.__("component.item.exits.2"))
    );

    // Asegurar que el nombre tenga un namespace
    options.name = toSnackCase(options.name);
    while (!options.name.includes(':')) {
        if (!config['addon.namespace']) {
            console.error(
                chalk.red(language.__("addon.namespace.error.1")),
                chalk.green(language.__("addon.namespace.error.2")),
                chalk.white(options.name)
            );

            const input = [
                { type: 'input', name: 'name', message: language.__("addon.namespace.question") }
            ];

            const response = await inquirer.prompt(input);
            options.name = response.name;
        } else {
            if(Array.isArray(config['addon.namespace'])){
                console.log(chalk.yellow(language.__("addon.namespace.multiple")));
                const namespace = await selectFromArray(config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:item_component') {
        if(Array.isArray(config['addon.namespace'])){
            console.log(chalk.yellow(language.__("addon.namespace.multiple")));
            const namespace = await selectFromArray(config['addon.namespace']);
            options.name = namespace
            ? `${namespace}:item_component`
            : 'namespace:item_component';
        } else {
            options.name = config['addon.namespace']
            ? `${config['addon.namespace']}:item_component`
            : 'namespace:item_component';
        }
        
    }

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

    const content = `${imports}

/**
 * Componente: ${options.name}
 * Descripción: ${options.description}${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
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

        updateIndexFile('item', options.name, `./components/items/${toCamelCase(options.name.split(':')[1])}`);

        const fileName = `item_components.json`
        let fileData = {...item_components};
        if (validateFile(fileName)) {
            fileData = await getJsonFile(fileName);
            fileData.components.push(options.name)
            await makeFile('item_components.json', JSON.stringify(fileData, null, 2))
        } else {
            fileData.components.push(options.name)
            await makeFile('item_components.json', JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("component.item.spinner.succeed").replace('${options.name}', options.name))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("component.item.spinner.error")));
        console.error(error);
    }
    process.exit(0);
});



export default itemsComponent;