import slab from "../../../../assets/templates/items/slab.json" with { type: 'json' };
import { CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import chalk from "chalk";

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

    return item;
}