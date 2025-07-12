import { cloneFile, validateFileAsync } from "../../../utils/fileOperations.js";
import { ONLY_BEHAVIOR, ONLY_RESOURCE } from "../../../utils/constants.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { language } from "../../../utils/i18n.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";

const icon = new Command('icon').alias('ico')
    .description(language.__("common.icon.description"));

icon.option('-r, --random <boolean>', language.__("common.icon.option.r"), false)


icon.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("common.manifest.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    const behavior = await ONLY_BEHAVIOR()
    const resource = await ONLY_RESOURCE()
    if (!behavior && !resource) return console.log(
        chalk.yellowBright(language.__("common.icon.exits.2")),
    );

    const iconsList = [
        'pack_icon_1',
        'pack_icon_2',
        'pack_icon_3',
        'pack_icon_4',
        'pack_icon_5',
        'pack_icon_6',
    ];

    const iconsNames = {
        'pack_icon_1': language.__("common.icon.icons.sword"),
        'pack_icon_2': language.__("common.icon.icons.pickaxe"),
        'pack_icon_3': language.__("common.icon.icons.axe"),
        'pack_icon_4': language.__("common.icon.icons.shovel"),
        'pack_icon_5': language.__("common.icon.icons.hoe"),
        'pack_icon_6': language.__("common.icon.icons.pearl"),
    };

    if(await validateFileAsync('pack_icon.png')) return console.log(chalk.bold(chalk.yellowBright(language.__("common.icon.exits.3"))));

    if (options.random) {
        // Selecciona un ícono aleatorio
        options.icon = iconsList[Math.floor(Math.random() * iconsList.length)];
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.icon.random"))));
    } else {
        const questions = [
            {
                type: 'list',
                name: 'selection',
                message: 'Selecciona un ícono para tu proyecto:',
                choices: [
                    { value: iconsList[0], name: iconsNames[iconsList[0]] },
                    { value: iconsList[1], name: iconsNames[iconsList[1]] },
                    { value: iconsList[2], name: iconsNames[iconsList[2]] },
                    { value: iconsList[3], name: iconsNames[iconsList[3]] },
                    { value: iconsList[4], name: iconsNames[iconsList[4]] },
                    { value: iconsList[5], name: iconsNames[iconsList[5]] },
                ],
            },
        ];

        const response = await inquirer.prompt(questions);
        options.icon = response.selection;

        console.log(chalk.green('✔', chalk.bold(chalk.whiteBright(language.__("common.icon.selection")))));
    }

    console.log(chalk.yellow(`- ${iconsNames[options.icon]}`));


    const create = cloneFile(`img/${options.icon}.png`, 'pack_icon.png');

    if(create) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.icon.create.succeed").replace('${iconsNames[options.icon]}', iconsNames[options.icon]))));
    } else {
        console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.icon.create.error").replace('${iconsNames[options.icon]}', iconsNames[options.icon]))));
    }
})

export default icon;