import base from "../../../assets/templates/blocks/block.json" with { type: 'json' };
import terrain_texture from "../../../assets/jsons/terrain_texture.json" with { type: 'json' };

import { BLOCK_MATERIALS, CATEGORYS, ITEM_GROUP_NAMES, ONLY_BEHAVIOR, ONLY_RESOURCE, PATH_BLOCK_TEXTURES } from "../../../utils/constants.js";
import { getJsonFile, getJsonFileOrBool, makeSubFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { toSnackCase } from "../../../utils/stringManager.js";
import { selectFromArray } from "../../../utils/forms.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const block = new Command('block')
    .description('Genera un objeto de bloque')

block.option('-n, --name <string>', 'Especifica el identificador del bloque', 'namespace:block');
block.option('-m, --menu <boolean>', 'Indica si el item tendra una sección personalizada en el menu de Minecraft - Solo behavior', false);
block.option('-l, --liquid <boolean>', 'Define cómo se comporta un bloque al detectar un líquido - Solo behavior', false);
block.option('-r, --render <opaque|double_sided|blend|alpha_test>', "Define el material de la textura del bloque", "opaque");

block.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright('No puedes generar un objeto de item en un proyecto sin el archivo'),
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
            if (Array.isArray(options.config['addon.namespace'])) {
                console.log(chalk.yellow(`Se encontraron multiples namespace`));
                const namespace = await selectFromArray(options.config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:block') {
        if (Array.isArray(options.config['addon.namespace'])) {
            console.log(chalk.yellow(`Se encontraron multiples namespace`));
            const namespace = await selectFromArray(options.config['addon.namespace']);
            options.name = namespace
                ? `${namespace}:block`
                : 'namespace:block';
        } else {
            options.name = options.config['addon.namespace']
                ? `${options.config['addon.namespace']}:block`
                : 'namespace:block';
        }
    }

    const name = options.name.split(':')[1];
    const fileName = `${name}.json`;
    const namespace = options.name.split(':')[0];

    const block = base;
    block["minecraft:block"]["description"]["identifier"] = options.name;
    block["minecraft:block"]["components"]['minecraft:material_instances']["*"]["texture"] = name;
    block["minecraft:block"]["components"]["minecraft:loot"] = `loot_tables/blocks/${fileName}`;
    if(!JSON.parse(options.liquid)) {
        delete block["minecraft:block"]["components"]["minecraft:liquid_detection"];
    }
    if (BLOCK_MATERIALS.includes(options.render)) {
        block["minecraft:block"]["components"]['minecraft:material_instances']["*"]["render_method"] = options.render;
    } else {
        block["minecraft:block"]["components"]['minecraft:material_instances']["*"]["render_method"] = BLOCK_MATERIALS[0];
    }
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(`Elegir categoría`));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            block["minecraft:block"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(`Elegir grupo`));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                block["minecraft:block"]["description"]["menu_category"]["group"] = `minecraft:${group}`;
            }
        }
    } else {
        block["minecraft:block"]["description"]["menu_category"]["category"] = "none";
        delete block["minecraft:block"]["description"]["menu_category"]["group"];
    }

    const questions = [
        {
            type: 'input',
            name: 'seconds_to_destroy',
            message: 'Ingrese el tiempo de extracción (dejar vacío colcara 4):',
        },
        {
            type: 'confirm',
            name: 'add_components',
            message: '¿Desea añadir componentes perzonalizados?:',
        }
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.seconds_to_destroy) {
        block["minecraft:block"]["components"]["minecraft:destructible_by_mining"]["seconds_to_destroy"] = parseFloat(answers.seconds_to_destroy);
    }
    if (answers.add_components) {
        const jsonFile = await getJsonFileOrBool("block_components.json");
        const newComponents = []
        if (!jsonFile) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`No es posible añadir componentes personalizados`)));
            delete block["minecraft:block"]["components"]["minecraft:custom_components"];
        }
        if (jsonFile.components == undefined || jsonFile.components.length == 0) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`No hay componentes personalizados en el archivo`, chalk.yellow("block_components.json"))));
            delete block["minecraft:block"]["components"]["minecraft:custom_components"];
        }
        if (block["minecraft:block"]["components"]["minecraft:custom_components"] != undefined) {
            let addComponents;
            do {
                console.log(chalk.yellow(`Elegir componente`));
                const component = await selectFromArray(jsonFile.components);
                newComponents.push(component)
                const answers = await inquirer.prompt(
                    {
                        type: 'confirm',
                        name: 'add_components',
                        message: '¿Desea añadir otro componente perzonalizado?:',
                    }
                );
                addComponents = answers.add_components;
            } while (addComponents);
            block["minecraft:block"]["components"]["minecraft:custom_components"] = [...new Set(newComponents)];
        }
    } else {
        delete block["minecraft:block"]["components"]["minecraft:custom_components"];
    }

    const spinner = ora('Creando bloque...').start();
    try {
        if (validateFile(`blocks/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(`El archivo ${fileName} ya existe`)));
        await makeSubFile(fileName, `blocks/${namespace}/`, JSON.stringify(block, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(`El bloque ${options.name} ha sido creado exitosamente!`)));
    } catch (error) {
        console.log(error);
        spinner.fail(chalk.red(`Error al crear el bloque ${options.name}.`));
    }
}


const resourcePack = async (options) => {
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
            if (Array.isArray(options.config['addon.namespace'])) {
                const namespace = options.config['addon.namespace'][0];
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:block') {
        if (Array.isArray(options.config['addon.namespace'])) {
            const namespace = options.config['addon.namespace'][0]
            options.name = namespace
                ? `${namespace}:block`
                : 'namespace:block';
        } else {
            options.name = options.config['addon.namespace']
                ? `${options.config['addon.namespace']}:block`
                : 'namespace:block';
        }
    }

    const textureName = options.name.split(':')[1]

    const spinner = ora('Agregando textura del bloque...').start();
    try {
        const fileName = `textures/terrain_texture.json`
        let fileData = {...terrain_texture};
        if (validateFile(fileName)) {
            fileData = await getJsonFile(fileName);
            fileData.texture_data[textureName] = {"textures": `${PATH_BLOCK_TEXTURES}/${textureName}`}
            await makeSubFile('terrain_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        } else {
            fileData.texture_data[textureName] = {"textures": `${PATH_BLOCK_TEXTURES}/${textureName}`}
            await makeSubFile('terrain_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(`La textura ${textureName} ha sido agregada exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red(`Error al agregar la textura ${textureName}.`));
        console.error(error);
    }
}



export default block;