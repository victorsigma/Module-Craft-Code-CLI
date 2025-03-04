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
import { language } from '../../../utils/i18n.js';
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";


const item = new Command('item').alias('i')
    .description(language.__("element.item.description"))

item.option('-n, --name <string>', language.__("element.item.option.n"), 'namespace:item');
item.addOption(new Option('-t, --type <string>', language.__("element.item.option.t")).default('item').choices(['item', 'axe', 'pickaxe', 'shovel','sword']));
item.option('-m, --menu <boolean>', language.__("element.item.option.m"), false);

item.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) {
        console.log(
            chalk.yellowBright(language.__("element.item.exits.1")),
            chalk.bold(chalk.green('addon.properties.'))
        );
    }
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
            if (Array.isArray(options.config['addon.namespace'])) {
                console.log(chalk.yellow(language.__("addon.namespace.multiple")));
                const namespace = await selectFromArray(options.config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${options.config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:item') {
        if (Array.isArray(options.config['addon.namespace'])) {
            console.log(chalk.yellow(language.__("addon.namespace.multiple")));
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
            message: language.__("element.item.add_components.questions.1"),
        }
    ];

    const answers = await inquirer.prompt(questions);

    if (answers.add_components) {
        const jsonFile = await getJsonFileOrBool("item_components.json");
        const newComponents = []
        if (!jsonFile) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("element.item.add_components.error.1"))));
            delete item["minecraft:item"]["components"]["minecraft:custom_components"];
        }
        if (jsonFile.components == undefined || jsonFile.components.length == 0) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("element.item.add_components.error.2"), chalk.yellow("item_components.json"))));
            delete item["minecraft:item"]["components"]["minecraft:custom_components"];
        }
        if (item["minecraft:item"]["components"]["minecraft:custom_components"] != undefined) {
            let addComponents;
            do {
                console.log(chalk.yellow(language.__("element.item.add_components.message")));
                const component = await selectFromArray(jsonFile.components);
                newComponents.push(component)
                const answers = await inquirer.prompt(
                    {
                        type: 'confirm',
                        name: 'add_components',
                        message: language.__("element.item.add_components.questions.2"),
                    }
                );
                addComponents = answers.add_components;
            } while (addComponents);
            item["minecraft:item"]["components"]["minecraft:custom_components"] = [...new Set(newComponents)];
        }
    } else {
        delete item["minecraft:item"]["components"]["minecraft:custom_components"];
    }

    const spinner = ora(language.__("element.item.behavior.spinner.start")).start();
    try {
        if (validateFile(`items/${namespace}/${fileName}`)) 
            return spinner.fail(chalk.bold(chalk.yellowBright(language.__("element.item.exits.2").replace("fileName", fileName))));
        await makeSubFile(fileName, `items/${namespace}/`, JSON.stringify(item, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.item.behavior.spinner.succeed").replace("${options.name}", options.name))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("element.item.behavior.spinner.error").replace("${options.name}", options.name)));
    }
}


const itemDefault = async (options) => {
    const item = base;
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(language.__("element.item.menu.category")));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(language.__("element.item.menu.group")));
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
        console.log(chalk.yellow(language.__("element.item.menu.category")));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(language.__("element.item.menu.group")));
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
            message: language.__("element.item.axe.questions.1"),
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: language.__("element.item.axe.questions.2"),
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: language.__("element.item.axe.questions.3"),
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: language.__("element.item.axe.questions.4"),
        },
        {
            type: 'input',
            name: 'max_durability',
            message: language.__("element.item.axe.questions.5"),
        },
        {
            type: 'input',
            name: 'speed',
            message: language.__("element.item.axe.questions.6"),
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
        console.log(chalk.yellow(language.__("element.item.menu.category")));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(language.__("element.item.menu.group")));
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
            message: language.__("element.item.pickaxe.questions.1"),
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: language.__("element.item.pickaxe.questions.2"),
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: language.__("element.item.pickaxe.questions.3"),
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: language.__("element.item.pickaxe.questions.4"),
        },
        {
            type: 'input',
            name: 'max_durability',
            message: language.__("element.item.pickaxe.questions.5"),
        },
        {
            type: 'input',
            name: 'speed',
            message: language.__("element.item.pickaxe.questions.6"),
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
        console.log(language.__("element.item.menu.category"));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(language.__("element.item.menu.group")));
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
            message: language.__("element.item.shovel.questions.1"),
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: language.__("element.item.shovel.questions.2"),
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: language.__("element.item.shovel.questions.3"),
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: language.__("element.item.shovel.questions.4"),
        },
        {
            type: 'input',
            name: 'max_durability',
            message: language.__("element.item.shovel.questions.5"),
        },
        {
            type: 'input',
            name: 'speed',
            message: language.__("element.item.shovel.questions.6"),
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
        console.log(chalk.yellow(language.__("element.item.menu.category")));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            item["minecraft:item"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(language.__("element.item.menu.group")));
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
            message: language.__("element.item.sword.questions.1"),
        },
        {
            type: 'input',
            name: 'enchantable_value',
            message: language.__("element.item.sword.questions.2"),
        },
        {
            type: 'input',
            name: 'min_damage_chance',
            message: language.__("element.item.sword.questions.3"),
        },
        {
            type: 'input',
            name: 'max_damage_chance',
            message: language.__("element.item.sword.questions.4"),
        },
        {
            type: 'input',
            name: 'max_durability',
            message: language.__("element.item.sword.questions.5"),
        },
        {
            type: 'input',
            name: 'speedWeb',
            message: language.__("element.item.sword.questions.6"),
        },
        {
            type: 'input',
            name: 'speedBamboo',
            message: language.__("element.item.sword.questions.7"),
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

    const spinner = ora(language.__("element.item.resource.spinner.start")).start();
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

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.item.resource.spinner.succeed").replace("${textureName}", textureName))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("element.item.resource.spinner.error").replace("${textureName}", textureName)));
        console.error(error);
    }
}

export default item;