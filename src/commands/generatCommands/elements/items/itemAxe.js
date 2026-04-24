import axe from "../../../../assets/templates/items/axe.json" with { type: 'json' };
import { Options } from "../../../../typedefs.js";

import { CATEGORYS, ITEM_GROUP_NAMES } from "../../../../utils/constants.js";
import { selectFromArray } from "../../../../utils/forms.js";
import { language } from "../../../../utils/i18n.js";
import inquirer from "inquirer";
import chalk from "chalk";

/**
 * @param {Options} options 
 * @returns 
 */
export const itemAxe = async (options) => {
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
        item["minecraft:item"]["description"]["menu_category"]["category"] = "items";
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
        item["minecraft:item"]["components"]["minecraft:damage"]["value"] = Number.parseInt(answers.value_damage);
    }
    if (answers.enchantable_value) {
        item["minecraft:item"]["components"]["minecraft:enchantable"]["value"] = Number.parseInt(answers.enchantable_value);
    }
    if (answers.min_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["min"] = Number.parseInt(answers.min_damage_chance);
    }
    if (answers.max_damage_chance) {
        item["minecraft:item"]["components"]["minecraft:durability"]["damage_chance"]["max"] = Number.parseInt(answers.max_damage_chance);
    }
    if (answers.max_durability) {
        item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = Number.parseInt(answers.max_durability);
    }
    if (answers.speed) {
        item["minecraft:item"]["components"]["minecraft:digger"]["destroy_speeds"][0]["speed"] = Number.parseFloat(answers.speed);
    }

    return item;
}