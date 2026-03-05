
import fence from "../../../../assets/templates/blocks/fence.json" with { type: 'json' };

import { BLOCK_MATERIALS, CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { getJsonFileOrBool, makeSubFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { toSnackCase } from "../../../../utils/stringManager.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

/**
 * @param {{name: string, config: {[key: string]: string | Array<string> }}} options 
 * @returns 
 */
export const fenceBehaviorPack = async (options) => {
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

    if (options.name === 'namespace:block') {
        if (Array.isArray(options.config['addon.namespace'])) {
            console.log(chalk.yellow(language.__("addon.namespace.multiple")));
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

    const block = fence;
    block["minecraft:block"]["description"]["identifier"] = options.name;
    block["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = name;
    block["minecraft:block"]["components"]["minecraft:loot"] = `loot_tables/blocks/${fileName}`;

    block["minecraft:block"]["components"]["minecraft:geometry"]["identifier"] = `geometry.${namespace}_fence`;
    block["minecraft:block"]["components"]["minecraft:item_visual"]["geometry"] = `geometry.${namespace}_fence_icon`;
    
    block["minecraft:block"]["components"]["minecraft:item_visual"]["material_instances"]["*"]["texture"] = name;

    if (BLOCK_MATERIALS.includes(options.render)) {
        block["minecraft:block"]["components"]['minecraft:material_instances']["*"]["render_method"] = options.render;
    } else {
        block["minecraft:block"]["components"]['minecraft:material_instances']["*"]["render_method"] = BLOCK_MATERIALS[0];
    }
    if (JSON.parse(options.menu)) {
        console.log(chalk.yellow(language.__("element.block.menu.category")));
        const category = await selectFromArray(CATEGORYS);
        if (category) {
            block["minecraft:block"]["description"]["menu_category"]["category"] = category;
            console.log(chalk.yellow(language.__("element.block.menu.group")));
            const group = await selectFromArray(ITEM_GROUP_NAMES[category]);
            if (group) {
                block["minecraft:block"]["description"]["menu_category"]["group"] = `minecraft:${group}`;
            }
        }
    } else {
        block["minecraft:block"]["description"]["menu_category"]["category"] = "construction";
        delete block["minecraft:block"]["description"]["menu_category"]["group"];
    }

    const questions = [
        {
            type: 'input',
            name: 'seconds_to_destroy',
            message: language.__("element.block.questions.1"),
        },
        {
            type: 'confirm',
            name: 'add_components',
            message: language.__("element.block.add_components.questions.1"),
        }
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.seconds_to_destroy) {
        block["minecraft:block"]["components"]["minecraft:destructible_by_mining"]["seconds_to_destroy"] = parseFloat(answers.seconds_to_destroy);
    }
    if (answers.add_components) {
        const jsonFile = await getJsonFileOrBool("block_components.json");
        if (!jsonFile) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("element.block.add_components.error.1"))));
            delete block["minecraft:block"]["components"]["minecraft:custom_components"];
        }
        if (jsonFile.components == undefined || jsonFile.components.length == 0) {
            console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("element.block.add_components.error.2"), chalk.yellow("block_components.json"))));
            delete block["minecraft:block"]["components"]["minecraft:custom_components"];
        }
        if (block["minecraft:block"]["components"]["minecraft:custom_components"] != undefined) {
            let addComponents;
            do {
                console.log(chalk.yellow(language.__("element.block.add_components.message")));
                const component = await selectFromArray(jsonFile.components);
                
                if (component) {
                    block["minecraft:block"]["components"][component] = {};
                }
                const answers = await inquirer.prompt(
                    {
                        type: 'confirm',
                        name: 'add_components',
                        message: language.__("element.block.add_components.questions.2"),
                    }
                );
                addComponents = answers.add_components;
            } while (addComponents);
            delete block["minecraft:block"]["components"]["minecraft:custom_components"];
        }
    } else {
        delete block["minecraft:block"]["components"]["minecraft:custom_components"];
    }

    const spinner = ora(language.__("element.block.behavior.spinner.start")).start();
    try {
        if (await validateFileAsync(`blocks/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("element.block.exits.2").replace("fileName", fileName))));
        await makeSubFile(fileName, `blocks/${namespace}/`, JSON.stringify(block, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.block.behavior.spinner.succeed").replace("${options.name}", options.name))));
    } catch (error) {
        //console.log(error);
        spinner.fail(chalk.red(language.__("element.block.behavior.spinner.error").replace("${options.name}", options.name)));
    }
}