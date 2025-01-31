import { propertiesAsync } from "../utils/readProperties.js";
import { makeFile } from "../utils/fileOperations.js";
import { Command, Option } from "commander";
import { language } from '../utils/i18n.js';
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";


const init = new Command('init').alias('i')
    .description(language.__("init.description"));
init.option('-n, --name <string>', language.__("init.option.n"), 'New Addon');
init.option('-s, --namespace <string>', language.__("init.option.s"), 'namespace');
init.option('-d, --description <string>', language.__("init.option.d"), 'Addon Description');
init.addOption(new Option('-t, --type <string>', language.__("init.option.t")).default('behavior').choices(['behavior', 'resource', 'skin']));

init.action(async (options) => {
    const config = await propertiesAsync();
    if (config) return console.log(chalk.yellowBright(language.__("init.exits.1")), chalk.bold(chalk.green(language.__("init.exits.2")), chalk.yellowBright(language.__("init.exits.3"))));
    const addon = {
        name: options.name,
        namespace: undefined,
        description: options.description,
        type: options.type
    }

    if (options.namespace == 'namespace') {
        const confirm = [
            {
                type: 'confirm',
                name: 'namespace',
                message: language.__("init.questions.1")
            },
        ];

        const response = await inquirer.prompt(confirm);

        if (response.namespace) {
            const input = [
                {
                    type: 'input',
                    name: 'namespace',
                    message: language.__("init.questions.2"),
                }
            ];

            const response = await inquirer.prompt(input);

            addon.namespace = response.namespace;
        }
    } else {
        addon.namespace = options.namespace;
    }

    const content =
        `##Project Config
addon.name=${addon.name}
addon.description=${addon.description}
${addon.namespace ? `addon.namespace=${addon.namespace}` : '#addon.namespace='}
addon.type=${addon.type}`.replace(/\r\n|\n/g, "\n");

    console.log(chalk.yellow(`- Addon: ${addon.name}`));
    console.log(chalk.yellow(`- Description: ${addon.description}`));
    if (addon.namespace) console.log(chalk.yellow(`- Spacename: ${addon.namespace}`));
    if (addon.type) console.log(chalk.yellow(`- Type: ${addon.type}`));
    const spinner = ora(language.__("init.spinner.start")).start();

    try {
        await makeFile('addon.properties', content);

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("init.spinner.succeed"))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("init.spinner.error")));
        console.error(error);
    }
});

export default init;