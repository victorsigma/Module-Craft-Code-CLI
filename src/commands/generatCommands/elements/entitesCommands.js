import { BEHAVIOR_ENTITY, ONLY_BEHAVIOR, ONLY_RESOURCE, RESOURCE_ENTITY } from "../../../utils/constants.js";
import { makeSubFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { toSnackCase } from "../../../utils/stringManager.js";
import { selectFromArray } from "../../../utils/forms.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const entity = new Command('entity')
    .description('Genera un objeto de entidad')

entity.option('-n, --name <string>', 'Especifica el nombre de la entidad', 'namespace:entity');
entity.option('-r, --runtime <string>', 'Establece el identificador de Vanilla Minecraft que esta entidad utilizará para construirse a sí misma');
entity.option('-e, --experimental <boolean>', 'Indica si la entidad estará bajo características experimentales de Minecraft', false);
entity.option('-sp, --spawnable <boolean>', 'Especifica si el generador de la entidad aparecerá en el inventario de creativo', false);
entity.option('-su, --summonable <boolean>', 'Indica si la entidad puede ser invocada mediante comandos en el juego', false);

entity.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright('No puedes generar un objeto de entidad en un proyecto sin el archivo'),
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
                chalk.red('El nombre de la entidad debe incluir ":" para separar namespace'),
                chalk.green('\nNombre actual:'),
                chalk.white(options.name)
            );

            const input = [
                { type: 'input', name: 'name', message: 'Escribe otro nombre:' }
            ];

            const response = await inquirer.prompt(input);
            options.name = response.name;
        } else {
            if(Array.isArray(options.config['addon.namespace'])){
                console.log(chalk.yellow(`Se encontraron multiples namespace`));
                const namespace = await selectFromArray(options.config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:entity') {
        if(Array.isArray(options.config['addon.namespace'])){
            console.log(chalk.yellow(`Se encontraron multiples namespace`));
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

    
    const spinner = ora('Creando entidad...').start();
    try {
        if(validateFile(`entities/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(`El archivo ${fileName} ya existe`)));
        await makeSubFile(fileName, `entities/${namespace}/`, JSON.stringify(entity, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(`La entidad ${options.name} ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear la entidad ${options.name}.'));
        console.error(error);
    }
}

const resourcePack = async (options) => {
    const entity = {...RESOURCE_ENTITY};

    // Asegurar que el nombre tenga un namespace
    options.name = toSnackCase(options.name);
    while (!options.name.includes(':')) {
        if (!options.config['addon.namespace']) {
            console.error(
                chalk.red('El nombre de la entidad debe incluir ":" para separar namespace'),
                chalk.green('\nNombre actual:'),
                chalk.white(options.name)
            );

            const input = [
                { type: 'input', name: 'name', message: 'Escribe otro nombre:' }
            ];

            const response = await inquirer.prompt(input);
            options.name = response.name;
        } else {
            if(Array.isArray(options.config['addon.namespace'])){
                console.log(chalk.yellow(`Se encontraron multiples namespace`));
                const namespace = await selectFromArray(options.config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:entity') {
        if(Array.isArray(options.config['addon.namespace'])){
            console.log(chalk.yellow(`Se encontraron multiples namespace`));
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

    const spinner = ora('Creando entidad...').start();
    try {
        if(validateFile(`entity/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(`El archivo ${fileName} ya existe`)));
        await makeSubFile(fileName, `entity/${namespace}/`, JSON.stringify(entity, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(`La entidad ${options.name} ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red(`Error al crear la entidad ${options.name}.`));
    }
}

export default entity;