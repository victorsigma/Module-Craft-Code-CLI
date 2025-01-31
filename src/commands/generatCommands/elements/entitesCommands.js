import { BEHAVIOR_ENTITY, ONLY_BEHAVIOR, ONLY_RESOURCE, RESOURCE_ENTITY } from "../../../utils/constants.js";
import { makeSubFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { toSnackCase } from "../../../utils/stringManager.js";
import { selectFromArray } from "../../../utils/forms.js";
import { language } from "../../../utils/i18n.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const entity = new Command('entity').alias('e')
    .description(language.__("element.entity.description"))

entity.option('-n, --name <string>', language.__("element.entity.option.n"), 'namespace:entity');
entity.option('-r, --runtime <string>', language.__("element.entity.option.r"));
entity.option('-e, --experimental <boolean>', language.__("element.entity.option.e"), false);
entity.option('-sp, --spawnable <boolean>', language.__("element.entity.option.sp"), false);
entity.option('-su, --summonable <boolean>', language.__("element.entity.option.su"), false);

entity.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("element.entity.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    options.config = config;

    const behavior = await ONLY_BEHAVIOR()
    if (behavior) {
        await behaviorPack(options);
    }

    const resource = await ONLY_RESOURCE()
    if (resource) {
        await resourcePack(options);
    }
})

const behaviorPack = async (options) => {
    const entity = {...BEHAVIOR_ENTITY};

    // Asegurar que el nombre tenga un namespace
    options.name = toSnackCase(options.name);
    while (!options.name.includes(':')) {
        if (!options.config['addon.namespace']) {
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
            if(Array.isArray(options.config['addon.namespace'])){
                console.log(chalk.yellow(language.__("addon.namespace.multiple")));
                const namespace = await selectFromArray(options.config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:entity') {
        if(Array.isArray(options.config['addon.namespace'])){
            console.log(chalk.yellow(language.__("addon.namespace.multiple")));
            const namespace = await selectFromArray(options.config['addon.namespace']);
            options.name = namespace
            ? `${namespace}:entity`
            : 'namespace:entity';
        } else {
            options.name = options.config['addon.namespace']
            ? `${options.config['addon.namespace']}:entity`
            : 'namespace:entity';
        }
        
    }

    const fileName = `${options.name.split(':')[1]}.json`;
    const namespace = options.name.split(':')[0];

    
    entity.format_version = "1.20.80";
    entity["minecraft:entity"].description.identifier = options.name;

    if(options.runtime) {
        entity["minecraft:entity"].description.runtime_identifier = options.runtime;
    }

    entity["minecraft:entity"].description.is_experimental = JSON.parse(options.experimental) ? true : false;
    entity["minecraft:entity"].description.is_spawnable = JSON.parse(options.spawnable) ? true : false;
    entity["minecraft:entity"].description.is_summonable = JSON.parse(options.summonable) ? true : false;

    
    const spinner = ora(language.__("element.entity.spinner.start")).start();
    try {
        if(validateFile(`entities/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("element.entity.exits.2").replace("fileName", fileName))));
        await makeSubFile(fileName, `entities/${namespace}/`, JSON.stringify(entity, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.entity.spinner.succeed").replace("${options.name}", options.name))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("element.entity.spinner.error").replace("${options.name}", options.name)));
    }
}

const resourcePack = async (options) => {
    const entity = {...RESOURCE_ENTITY};

    // Asegurar que el nombre tenga un namespace
    options.name = toSnackCase(options.name);
    while (!options.name.includes(':')) {
        if (!options.config['addon.namespace']) {
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
            if(Array.isArray(options.config['addon.namespace'])){
                console.log(chalk.yellow(language.__("addon.namespace.multiple")));
                const namespace = await selectFromArray(options.config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:entity') {
        if(Array.isArray(options.config['addon.namespace'])){
            console.log(chalk.yellow(language.__("addon.namespace.multiple")));
            const namespace = await selectFromArray(options.config['addon.namespace']);
            options.name = namespace
            ? `${namespace}:entity`
            : 'namespace:entity';
        } else {
            options.name = options.config['addon.namespace']
            ? `${options.config['addon.namespace']}:entity`
            : 'namespace:entity';
        }
        
    }

    const fileName = `${options.name.split(':')[1]}.entity.json`
    const namespace = options.name.split(':')[0]

    entity.format_version = "1.10.0";
    entity["minecraft:client_entity"].description.identifier = options.name;

    const spinner = ora(language.__("element.entity.spinner.start")).start();
    try {
        if(validateFile(`entity/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("element.entity.exits.2").replace("fileName", fileName))));
        await makeSubFile(fileName, `entity/${namespace}/`, JSON.stringify(entity, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.entity.spinner.succeed").replace("${options.name}", options.name))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("element.entity.spinner.error").replace("${options.name}", options.name)));
    }
}

export default entity;