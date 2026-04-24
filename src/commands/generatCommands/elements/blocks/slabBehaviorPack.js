
import slab from "../../../../assets/templates/blocks/slab.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js";

import { BLOCK_MATERIALS, CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { resolveElementName } from "../../../../core/nameResolver.js";
import { generateFile } from "../../../../core/generateFile.js";
import { resolvePath } from "../../../../core/resolvePath.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import chalk from "chalk";

/**
 * @param {Options} options 
 * @returns 
 */
export const slabBehaviorPack = async (options) => {
    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "block");

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
        block["minecraft:block"]["description"]["menu_category"]["category"] = "construction";
        delete block["minecraft:block"]["description"]["menu_category"]["group"];
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