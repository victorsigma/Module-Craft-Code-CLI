import base from "../../../assets/templates/items/item.json" with { type: 'json' };
import item_texture from "../../../assets/jsons/item_texture.json" with { type: 'json' };

import { ONLY_BEHAVIOR, ONLY_RESOURCE, PATH_ITEM_TEXTURES } from '../../../utils/constants.js';
import { getJsonFile, getJsonFileOrBool, makeSubFile, validateFileAsync } from "../../../utils/fileOperations.js";
import { resolveElementName } from "../../../core/nameResolver.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { generateFile } from "../../../core/generateFile.js";
import { resolvePath } from "../../../core/resolvePath.js";
import { selectFromArray } from '../../../utils/forms.js';
import { itemDefault } from "./items/itemDefault.js";
import { itemPickaxe } from "./items/itemPickaxe.js";
import { itemShovel } from "./items/itemShovel.js";
import { language } from '../../../utils/i18n.js';
import { itemSword } from "./items/itemSword.js";
import { itemSlab } from "./items/itemSlab.js";
import { itemAxe } from "./items/itemAxe.js";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const item = new Command('item').alias('i')
    .description(language.__("element.item.description"))

item.option('-n, --name <string>', language.__("element.item.option.n"), 'namespace:item');
item.addOption(new Option('-t, --type <string>', language.__("element.item.option.t")).default('item').choices(['item', 'axe', 'pickaxe', 'shovel', "slab", 'sword']));
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

/**
 * @param {{name: string, config: {[key: string]: string | Array<string> }}} options 
 * @returns 
 */
const behaviorPack = async (options) => {
    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "item");

    const fileName = `${options.name.split(':')[1]}.json`;
    const namespace = options.name.split(':')[0];
    options.namespace = namespace;

    let item = base;

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
        case "slab":
            item = await itemSlab(options);
            break;
        case "sword":
            item = await itemSword(options);
            break;
        default:
            item = itemDefault(options);
            break;
    }

    if (options.type != "slab") {
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
    }

    await generateFile({
        fileName,
        path: resolvePath("items", namespace, options.config),
        content: item,
        lang: {
            start: "element.item.behavior.spinner.start",
            success: "element.item.behavior.spinner.succeed",
            error: "element.item.behavior.spinner.error",
            exists: "element.item.exits.2"
        },
        interpolate: {
            "options.name": options.name
        }
    })
}


const resourcePack = async (options) => {
    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "item");

    const textureName = options.name.split(':')[1]

    const spinner = ora(language.__("element.item.resource.spinner.start")).start();
    try {
        const fileName = `textures/item_texture.json`
        let fileData = { ...item_texture };
        if (await validateFileAsync(fileName)) {
            fileData = await getJsonFile(fileName);
            fileData.texture_data[textureName] = { "textures": `${PATH_ITEM_TEXTURES}/${textureName}` }
            await makeSubFile('item_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        } else {
            fileData.texture_data[textureName] = { "textures": `${PATH_ITEM_TEXTURES}/${textureName}` }
            await makeSubFile('item_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.item.resource.spinner.succeed").replace("${textureName}", textureName))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("element.item.resource.spinner.error").replace("${textureName}", textureName)));
        console.error(error);
    }
}

export default item;