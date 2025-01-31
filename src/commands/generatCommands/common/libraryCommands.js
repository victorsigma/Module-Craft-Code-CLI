import { cloneFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { LIBS, ONLY_BEHAVIOR } from "../../../utils/constants.js";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { language } from "../../../utils/i18n.js";

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
                type: 'list',
                name: 'selection',
                message: language.__("common.library.selections"),
                choices: [
                    { value: "bedrockSystem", name: "Bedrock System" },
                    { value: "blockManager", name: "Block Manager" },
                    { value: "itemManager", name: "Item Manager" },
                ],
            },
        ];

        const response = await inquirer.prompt(questions);
        options.module = response.selection;
    }

    console.log(chalk.yellow(`- ${options.module}`));
    let create = false;

    switch (options.module) {
        case "bedrockSystem":
            const validationFormatter = validateFile('scripts/libs/formatter.js');
            let fc1 = false;
            let fc2 = false;
            if (!validationFormatter) {
                fc1 = await cloneFile('js/libs/formatter.js', 'scripts/libs/formatter.js')
                if (fc1) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('formatter.js'), chalk.whiteBright(language.__(`common.library.build.succeed`))))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('formatter.js'), chalk.whiteBright(language.__(`common.library.build.error`))))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('formatter.js'), chalk.whiteBright(language.__(`common.library.build.exists`))))
            }
            const validationBedrockSystem = validateFile('scripts/libs/bedrockSystem.js');
            if (!validationBedrockSystem) {
                fc2 = await cloneFile('js/libs/bedrockSystem.js', 'scripts/libs/bedrockSystem.js')
                if (fc2) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('bedrockSystem.js'), chalk.whiteBright(language.__(`common.library.build.succeed`))))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('bedrockSystem.js'), chalk.whiteBright(language.__(`common.library.build.error`))))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('bedrockSystem.js'), chalk.whiteBright(language.__(`common.library.build.exists`))))
            }

            create = (fc1 && fc2);
            break;
        case "blockManager":
            const validationBlockManager = validateFile('scripts/libs/blockManager.js');
            let fc3 = false;
            if (!validationBlockManager) {
                fc3 = await cloneFile('js/libs/blockManager.js', 'scripts/libs/blockManager.js')
                if (fc3) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('blockManager.js'), chalk.whiteBright(language.__(`common.library.build.succeed`))))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('blockManager.js'), chalk.whiteBright(language.__(`common.library.build.error`))))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('blockManager.js'), chalk.whiteBright(language.__(`common.library.build.exists`))))
            }
            create = fc3;
            break;
        case "itemManager":
            const validationItemManager = validateFile('scripts/libs/itemManager.js');
            let fc4 = false;
            if (!validationItemManager) {
                fc4 = await cloneFile('js/libs/itemManager.js', 'scripts/libs/itemManager.js')
                if (fc4) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('itemManager.js'), chalk.whiteBright(language.__(`common.library.build.succeed`))))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('itemManager.js'), chalk.whiteBright(language.__(`common.library.build.error`))))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow('itemManager.js'), chalk.whiteBright(language.__(`common.library.build.exists`))))
            }

            create = fc4;
            break;
        default:
            break;
    }

    if (create) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.create.header")), chalk.yellow(options.module), chalk.whiteBright(language.__("common.library.create.succeed"))))
    } else {
        console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.create.header")), chalk.yellow(options.module), chalk.whiteBright(language.__("common.library.create.error"))))
    }
})

export default library;