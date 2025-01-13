import base from "../../../assets/templates/items/item.json" with { type: 'json' };
import axe from "../../../assets/templates/items/axe.json" with { type: 'json' };
import pickaxe from "../../../assets/templates/items/pickaxe.json" with { type: 'json' };
import shovel from "../../../assets/templates/items/shovel.json" with { type: 'json' };
import sword from "../../../assets/templates/items/sword.json" with { type: 'json' };
import item_texture from "../../../assets/jsons/item_texture.json" with { type: 'json' };

import { CATEGORYS, ITEM_GROUP_NAMES, ONLY_BEHAVIOR, ONLY_RESOURCE, PATH_ITEM_TEXTURES } from '../../../utils/constants.js';
import { getJsonFile, getJsonFileOrBool, makeSubFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { toSnackCase } from "../../../utils/stringManager.js";
import { selectFromArray } from '../../../utils/forms.js';
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";


const item = new Command('item')
    .description('Genera un objeto de item')

item.option('-n, --name <string>', 'Especifica el identificador del item', 'namespace:item');
item.option('-t, --type <item|axe|pickaxe|shovel|sword>', 'Especifica el tipo de item a crear - Solo behavior', 'item');
item.option('-m, --menu <boolean>', 'Indica si el item tendra una sección personalizada en el menu de Minecraft - Solo behavior', false);

item.action(async (options) => {
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

    if (options.name === 'namespace:item') {
        if (Array.isArray(options.config['addon.namespace'])) {
            console.log(chalk.yellow(`Se encontraron multiples namespace`));
            const namespace = await selectFromArray(options.config['addon.namespace']);
            options.name = namespace
                ? `${namespace}:item`
                : 'namespace:item';
        } else {
            options.name = options.config['addon.namespace']
                ? `${options.config['addon.namespace']}:item`
                : 'namespace:item';
        }
    }

    const fileName = `${options.name.split(':')[1]}.json`;
    const namespace = options.name.split(':')[0];

    let item;

    switch (options.type) {
        case "item":
            item = await itemDefault(options);
            break;
        case "axe":
            item = await itemAxe(options);
            break;
        case "pickaxe":
            item = await itemPickaxe(options);
            break;
        case "shovel":
            item = await itemShovel(options);
            break;
        case "sword":
            item = await itemSword(options);
            break;
        default:
            item = itemDefault(options);
            break;
    }

    const questions = [
        {
            type: 'confirm',
            name: 'add_components',
            message: '¿Desea añadir componentes perzonalizados?:',
        }
    ];

    const answers = await inquirer.prompt(questions);

    if (answers.add_components) {
        const jsonFile = await getJsonFileOrBool("item_components.json");
        const newComponents = []
        if (!jsonFile) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`No es posible añadir componentes personalizados`)));
            delete item["minecraft:item"]["components"]["minecraft:custom_components"];
        }
        if (jsonFile.components == undefined || jsonFile.components.length == 0) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`No hay componentes personalizados en el archivo`, chalk.yellow("item_components.json"))));
            delete item["minecraft:item"]["components"]["minecraft:custom_components"];
        }
        if (item["minecraft:item"]["components"]["minecraft:custom_components"] != undefined) {
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
            item["minecraft:item"]["components"]["minecraft:custom_components"] = [...new Set(newComponents)];
        }
    } else {
        delete item["minecraft:item"]["components"]["minecraft:custom_components"];
    }

    const spinner = ora('Creando item...').start();
    try {
        if (validateFile(`items/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(`El archivo ${fileName} ya existe`)));
        await makeSubFile(fileName, `items/${namespace}/`, JSON.stringify(item, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(`El item ${options.name} ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red(`Error al crear el item ${options.name}.`));
    }
}


const itemDefault = async (options) => {
    const item = base;
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(`Elegir categoría`));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(`Elegir grupo`));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                item["minecraft:item"]["description"]["menu_category"]["group"] = group;
            }
        }
    }

    item["minecraft:item"].description.identifier = options.name;
    item["minecraft:item"].components['minecraft:icon'].textures.default = options.name.split(":")[1];

    return item;
}

const itemAxe = async (options) => {
    const item = axe;
    item["minecraft:item"].description.identifier = options.name;
    item["minecraft:item"].components['minecraft:icon'].textures.default = options.name.split(":")[1];
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(`Elegir categoría`));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(`Elegir grupo`));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                item["minecraft:item"]["description"]["menu_category"]["group"] = group;
            }
        }
    } else {
        item["minecraft:item"]["description"]["menu_category"]["category"] = "none";
        delete item["minecraft:item"]["description"]["menu_category"]["group"];
    }

    const questions = [
        {
            type: 'input',
            name: 'value_damage',
            message: 'Ingrese el valor de daño (dejar vacío colcara 7):',
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: 'Ingrese el valor de encantamiento (dejar vacío colcara 15):',
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: 'Ingrese el valor mínimo de daño (dejar vacío colcara 10):',
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: 'Ingrese el valor máximo de daño (dejar vacío colcara 50):',
        },
        {
            type: 'input',
            name: 'max_durability',
            message: 'Ingrese la durabilidad máxima (dejar vacío colcara 1048):',
        },
        {
            type: 'input',
            name: 'speed',
            message: 'Ingrese la velocidad de destrucción (dejar vacío colcara 1.0):',
        },
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.value_damage) {
        item["minecraft:item"]["components"]["minecraft:damage"]["value"] = parseInt(answers.value_damage);
    }
    if (answers.enchantable_value) {
        item["minecraft:item"]["components"]["minecraft:enchantable"]["value"] = parseInt(answers.enchantable_value);
    }
    if (answers.min_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["min"] = parseInt(answers.min_damage_chance);
    }
    if (answers.max_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["max"] = parseInt(answers.max_damage_chance);
    }
    if (answers.max_durability) {
        item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = parseInt(answers.max_durability);
    }
    if (answers.speed) {
        item["minecraft:item"]["components"]["minecraft:digger"]["destroy_speeds"][0]["speed"] = parseFloat(answers.speed);
    }

    return item;
}

const itemPickaxe = async (options) => {
    const item = pickaxe;
    item["minecraft:item"].description.identifier = options.name;
    item["minecraft:item"].components['minecraft:icon'].textures.default = options.name.split(":")[1];
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(`Elegir categoría`));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(`Elegir grupo`));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                item["minecraft:item"]["description"]["menu_category"]["group"] = group;
            }
        }
    } else {
        item["minecraft:item"]["description"]["menu_category"]["category"] = "none";
        delete item["minecraft:item"]["description"]["menu_category"]["group"];
    }

    const questions = [
        {
            type: 'input',
            name: 'value_damage',
            message: 'Ingrese el valor de daño (dejar vacío colcara 5):',
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: 'Ingrese el valor de encantamiento (dejar vacío colcara 5):',
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: 'Ingrese el valor mínimo de daño (dejar vacío colcara 10):',
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: 'Ingrese el valor máximo de daño (dejar vacío colcara 50):',
        },
        {
            type: 'input',
            name: 'max_durability',
            message: 'Ingrese la durabilidad máxima (dejar vacío colcara 1048):',
        },
        {
            type: 'input',
            name: 'speed',
            message: 'Ingrese la velocidad de destrucción (dejar vacío colcara 1.2):',
        },
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.value_damage) {
        item["minecraft:item"]["components"]["minecraft:damage"]["value"] = parseInt(answers.value_damage);
    }
    if (answers.enchantable_value) {
        item["minecraft:item"]["components"]["minecraft:enchantable"]["value"] = parseInt(answers.enchantable_value);
    }
    if (answers.min_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["min"] = parseInt(answers.min_damage_chance);
    }
    if (answers.max_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["max"] = parseInt(answers.max_damage_chance);
    }
    if (answers.max_durability) {
        item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = parseInt(answers.max_durability);
    }
    if (answers.speed) {
        item["minecraft:item"]["components"]["minecraft:digger"]["destroy_speeds"][0]["speed"] = parseFloat(answers.speed);
    }

    return item;
}

const itemShovel = async (options) => {
    const item = shovel;
    item["minecraft:item"].description.identifier = options.name;
    item["minecraft:item"].components['minecraft:icon'].textures.default = options.name.split(":")[1];
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(`Elegir categoría`));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(`Elegir grupo`));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                item["minecraft:item"]["description"]["menu_category"]["group"] = group;
            }
        }
    } else {
        item["minecraft:item"]["description"]["menu_category"]["category"] = "none";
        delete item["minecraft:item"]["description"]["menu_category"]["group"];
    }

    const questions = [
        {
            type: 'input',
            name: 'value_damage',
            message: 'Ingrese el valor de daño (dejar vacío colcara 4):',
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: 'Ingrese el valor de encantamiento (dejar vacío colcara 15):',
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: 'Ingrese el valor mínimo de daño (dejar vacío colcara 10):',
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: 'Ingrese el valor máximo de daño (dejar vacío colcara 50):',
        },
        {
            type: 'input',
            name: 'max_durability',
            message: 'Ingrese la durabilidad máxima (dejar vacío colcara 1048):',
        },
        {
            type: 'input',
            name: 'speed',
            message: 'Ingrese la velocidad de destrucción (dejar vacío colcara 1.5):',
        },
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.value_damage) {
        item["minecraft:item"]["components"]["minecraft:damage"]["value"] = parseInt(answers.value_damage);
    }
    if (answers.enchantable_value) {
        item["minecraft:item"]["components"]["minecraft:enchantable"]["value"] = parseInt(answers.enchantable_value);
    }
    if (answers.min_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["min"] = parseInt(answers.min_damage_chance);
    }
    if (answers.max_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["max"] = parseInt(answers.max_damage_chance);
    }
    if (answers.max_durability) {
        item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = parseInt(answers.max_durability);
    }
    if (answers.speed) {
        item["minecraft:item"]["components"]["minecraft:digger"]["destroy_speeds"][0]["speed"] = parseFloat(answers.speed);
    }

    return item;
}

const itemSword = async (options) => {
    const item = sword;
    item["minecraft:item"].description.identifier = options.name;
    item["minecraft:item"].components['minecraft:icon'].textures.default = options.name.split(":")[1];
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(`Elegir categoría`));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(`Elegir grupo`));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                item["minecraft:item"]["description"]["menu_category"]["group"] = group;
            }
        }
    } else {
        item["minecraft:item"]["description"]["menu_category"]["category"] = "none";
        delete item["minecraft:item"]["description"]["menu_category"]["group"];
    }

    const questions = [
        {
            type: 'input',
            name: 'value_damage',
            message: 'Ingrese el valor de daño (dejar vacío colcara 8):',
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: 'Ingrese el valor de encantamiento (dejar vacío colcara 15):',
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: 'Ingrese el valor mínimo de daño (dejar vacío colcara 10):',
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: 'Ingrese el valor máximo de daño (dejar vacío colcara 50):',
        },
        {
            type: 'input',
            name: 'max_durability',
            message: 'Ingrese la durabilidad máxima (dejar vacío colcara 1048):',
        },
        {
            type: 'input',
            name: 'speedWeb',
            message: 'Ingrese la velocidad de destrucción para telaraña (dejar vacío colcara 15):',
        },
        {
            type: 'input',
            name: 'speedBamboo',
            message: 'Ingrese la velocidad de destrucción para bamboo (dejar vacío colcara 10):',
        },
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.value_damage) {
        item["minecraft:item"]["components"]["minecraft:damage"]["value"] = parseInt(answers.value_damage);
    }
    if (answers.enchantable_value) {
        item["minecraft:item"]["components"]["minecraft:enchantable"]["value"] = parseInt(answers.enchantable_value);
    }
    if (answers.min_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["min"] = parseInt(answers.min_damage_chance);
    }
    if (answers.max_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["max"] = parseInt(answers.max_damage_chance);
    }
    if (answers.max_durability) {
        item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = parseInt(answers.max_durability);
    }
    if (answers.speedWeb) {
        item["minecraft:item"]["components"]["minecraft:digger"]["destroy_speeds"][0]["speed"] = parseFloat(answers.speedWeb);
    }
    if (answers.speedBamboo) {
        item["minecraft:item"]["components"]["minecraft:digger"]["destroy_speeds"][1]["speed"] = parseFloat(answers.speedBamboo);
    }

    return item;
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

    if (options.name === 'namespace:item') {
        if (Array.isArray(options.config['addon.namespace'])) {
            const namespace = options.config['addon.namespace'][0]
            options.name = namespace
                ? `${namespace}:item`
                : 'namespace:item';
        } else {
            options.name = options.config['addon.namespace']
                ? `${options.config['addon.namespace']}:item`
                : 'namespace:item';
        }
    }

    const textureName = options.name.split(':')[1]

    const spinner = ora('Agregando textura del item...').start();
    try {
        const fileName = `textures/item_texture.json`
        let fileData = {...item_texture};
        if (validateFile(fileName)) {
            fileData = await getJsonFile(fileName);
            fileData.texture_data[textureName] = {"textures": `${PATH_ITEM_TEXTURES}/${textureName}`}
            await makeSubFile('item_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        } else {
            fileData.texture_data[textureName] = {"textures": `${PATH_ITEM_TEXTURES}/${textureName}`}
            await makeSubFile('item_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(`La textura ${textureName} ha sido agregada exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red(`Error al agregar la textura ${textureName}.`));
        console.error(error);
    }
}

export default item;