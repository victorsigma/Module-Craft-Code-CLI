import block_components from "../../../assets/jsons/block_components.json" with { type: 'json' };
import { Options } from "../../../typedefs.js"

import { toCamelCase, uppercaseFirstLetter } from '../../../utils/stringManager.js';
import { clearEvents, getJsonFile, makeComponentFile, makeEventFile, makeFile, updateIndexFile, validateFileAsync } from '../../../utils/fileOperations.js';
import { ONLY_BEHAVIOR, PATH_BLOCK_COMPONENTS, PATH_BLOCK_EVENTS } from '../../../utils/constants.js';
import { propertiesAsync } from '../../../utils/readProperties.js';
import { resolveAddonName, resolveElementName } from "../../../core/nameResolver.js";
import { slabComponent } from "./blockPrefabs/slabComponent.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const blocksComponent = new Command('block').alias('b')
    .description(language.__("component.block.description"));
blocksComponent.option('-n, --name <string>', language.__("component.block.option.n"), 'namespace:block_component');
blocksComponent.option('-d, --description <string>', language.__("component.block.option.d"), 'description');
blocksComponent.addOption(new Option('-p, --prefab <string>', language.__("component.item.option.p")).default("none").choices(["none", "slab"]));


blocksComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("component.block.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    options.config = config;

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright(language.__("component.block.exits.2"))
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

    const imports = response.selections.map(event => {
        return `import { ${toCamelCase(options.name.split(':')[1])}${uppercaseFirstLetter(event)}Event } from "../../events/blocks/${toCamelCase(options.name.split(':')[1])}/${event}Event";`;
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

    const spinner = ora(language.__("component.block.spinner.start")).start();

    try {
        await makeComponentFile(options.name, PATH_BLOCK_COMPONENTS, content);
        await clearEvents(`${PATH_BLOCK_EVENTS}/${toCamelCase(options.name.split(':')[1])}`);
        for (let i = 0; i < response.selections.length; i++) {
            await makeEventFile(options.name, response.selections[i], PATH_BLOCK_EVENTS);
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


export default blocksComponent;