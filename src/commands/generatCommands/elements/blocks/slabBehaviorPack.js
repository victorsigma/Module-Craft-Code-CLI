
import slab from "../../../../assets/templates/blocks/slab.json" with { type: 'json' };

import { BLOCK_MATERIALS, CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { makeSubFile, validateFileAsync } from "../../../../utils/fileOperations.js";
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
export const slabBehaviorPack = async (options) => {
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
    const slabDouble = `${name}_double.json`;
    const namespace = options.name.split(':')[0];

    const block = slab;
    block["minecraft:block"]["description"]["identifier"] = options.name;
    block["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = name;
    block["minecraft:block"]["components"]["minecraft:loot"] = `loot_tables/blocks/${slabDouble}`;
    block["minecraft:block"]["components"]["minecraft:geometry"]["identifier"] = `geometry.${namespace}_slab`;
    block["minecraft:block"]["components"]["minecraft:geometry"]["bone_visibility"]["slab_top"] = `query.block_state('minecraft:vertical_half') == 'top' || query.block_state('${namespace}:slab_double')`
    block["minecraft:block"]["components"]["minecraft:geometry"]["bone_visibility"]["slab_bottom"] = `query.block_state('minecraft:vertical_half') == 'bottom' || query.block_state('${namespace}:slab_double')`
    block["minecraft:block"]["permutations"][0]["condition"] = `query.block_state('minecraft:vertical_half') == 'top' && !query.block_state('${namespace}:slab_double')`
    block["minecraft:block"]["permutations"][1]["condition"] = `query.block_state('minecraft:vertical_half') == 'bottom' && !query.block_state('${namespace}:slab_double')`
    block["minecraft:block"]["permutations"][2]["condition"] = `!query.block_state('${namespace}:slab_double')`
    block["minecraft:block"]["permutations"][2]["components"]["minecraft:loot"] = `loot_tables/blocks/${fileName}`;
    block["minecraft:block"]["permutations"][2]["components"][`${namespace}:slab`] = { "sound": "use.stone" };
    block["minecraft:block"]["description"]["states"][`${namespace}:slab_double`] = [false, true];

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
        block["minecraft:block"]["description"]["menu_category"]["category"] = "none";
        delete block["minecraft:block"]["description"]["menu_category"]["group"];
    }

    const spinner = ora(language.__("element.block.behavior.spinner.start")).start();
    try {
        if (await validateFileAsync(`blocks/${namespace}/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("element.block.exits.2").replace("fileName", fileName))));
        await makeSubFile(fileName, `blocks/${namespace}/`, JSON.stringify(block, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.block.behavior.spinner.succeed").replace("${options.name}", options.name))));
    } catch (error) {
        console.log(error);
        spinner.fail(chalk.red(language.__("element.block.behavior.spinner.error").replace("${options.name}", options.name)));
    }
}