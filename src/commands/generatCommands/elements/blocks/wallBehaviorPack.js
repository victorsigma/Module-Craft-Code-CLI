
import wall from "../../../../assets/templates/blocks/wall.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js";

import { BLOCK_MATERIALS, CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { getJsonFileOrBool } from "../../../../utils/fileOperations.js";
import { resolveElementName } from "../../../../core/nameResolver.js";
import { generateFile } from "../../../../core/generateFile.js";
import { resolvePath } from "../../../../core/resolvePath.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import inquirer from "inquirer";
import chalk from "chalk";

/**
 * @param {Options} options 
 * @returns 
 */
export const wallBehaviorPack = async (options) => {
    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "block");

    const name = options.name.split(':')[1];
    const fileName = `${name}.json`;
    const namespace = options.name.split(':')[0];

    const block = wall;
    block["minecraft:block"]["description"]["identifier"] = options.name;
    block["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = name;
    block["minecraft:block"]["components"]["minecraft:loot"] = `loot_tables/blocks/${fileName}`;

    block["minecraft:block"]["components"]["minecraft:geometry"]["identifier"] = `geometry.${namespace}_wall`;
    block["minecraft:block"]["components"]["minecraft:item_visual"]["geometry"] = `geometry.${namespace}_wall_icon`;
    
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
        block["minecraft:block"]["description"]["menu_category"]["group"] = "minecraft:itemGroup.name.walls";
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
        block["minecraft:block"]["components"]["minecraft:destructible_by_mining"]["seconds_to_destroy"] = Number.parseFloat(answers.seconds_to_destroy);
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
    
    await generateFile({
        fileName,
        path: resolvePath("blocks", namespace, options.config),
        content: block,
        lang: {
            start: "element.block.behavior.spinner.start",
            success: "element.block.behavior.spinner.succeed",
            error: "element.block.behavior.spinner.error",
            exists: "element.block.exits.2"
        },
        interpolate: {
            "options.name": options.name
        }
    })
}