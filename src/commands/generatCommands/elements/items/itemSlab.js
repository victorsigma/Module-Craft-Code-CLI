import slab from "../../../../assets/templates/items/slab.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js";

import { CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import chalk from "chalk";

/**
 * @param {Options} options 
 * @returns 
 */
export const itemSlab = async (options) => {
    const item = slab;
    item["minecraft:item"].description.identifier = options.name;
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

    item["minecraft:item"]["components"]["minecraft:block_placer"]["block"] = options.name

    item["minecraft:item"]["components"][`${options.namespace}:slab_item`] = { ...item["minecraft:item"]["components"]["namespace:slab_item"] }
    
    delete item["minecraft:item"]["components"]["namespace:slab_item"];

    item["minecraft:item"]["components"]["minecraft:tags"]["tags"][0] = `${options.namespace}:slabs`

    return item;
}