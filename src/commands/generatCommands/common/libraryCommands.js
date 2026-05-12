import { bedrockSystemLibrary } from "./libs/bedrockSystemLibrary.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { LIBS, ONLY_BEHAVIOR } from "../../../utils/constants.js";
import { baseLibrary } from "./libs/baseLibrary.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";

const library = new Command('library').alias('lib')
    .description(language.__("common.library.description"));

library.addOption(new Option('-m, --module <string>', language.__("common.library.option.m")).choices(LIBS));

library.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("common.manifest.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright(language.__("common.library.exits.2")),
    );
    if (!LIBS.includes(options.module)) {
        console.log(
            chalk.yellowBright(language.__("common.library.errors.1")),
        );
        const questions = [
            {
                type: 'select',
                name: 'selection',
                message: language.__("common.library.selections"),
                choices: [
                    { value: "bedrockSystem", name: "Bedrock System" },
                    { value: "blockManager", name: "Block Manager" },
                    { value: "itemManager", name: "Item Manager" },
                    { value: "vectorManager", name: "Vector Manager" },
                    { value: "worldFuntions", name: "World Funtions" },
                ],
            },
        ];

        const response = await inquirer.prompt(questions);
        options.module = response.selection;
    }

    console.log(chalk.yellow(`- ${options.module}`));
    
    const create = await processLibrary(options);

    if (create) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.create.header")), chalk.yellow(options.module), chalk.whiteBright(language.__("common.library.create.succeed"))))
    } else {
        console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.create.header")), chalk.yellow(options.module), chalk.whiteBright(language.__("common.library.create.error"))))
    }
})

export const libraryStrategies = {
    bedrockSystem: bedrockSystemLibrary,
    blockManager: baseLibrary,
    itemManager: baseLibrary,
    vectorManager: baseLibrary,
    worldFuntions: baseLibrary
};

/**
 * 
 * @param {{module: string}} options 
 * @returns 
 */
const processLibrary = async (options) => {
    const strategy = libraryStrategies[options.module] ?? function () {return false};

    const create = await strategy({name: options.module})

    return create
} 

export default library;