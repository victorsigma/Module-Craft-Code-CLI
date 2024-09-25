import { propertiesAsync } from "../utils/readProperties.js";
import { makeFile } from "../utils/fileOperations.js";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";


const init = new Command('init').alias('i')
    .description('Inicializa el proyecto con un archivo addon.properties');
init.option('-n, --name <string>', 'especifica el nombre del addon', 'New Addon')
init.option('-s, --namespace <string>', 'especifica el namespace del addon', 'namespace')
init.option('-d, --description <string>', 'especifica la descripción', 'Addon Description')
init.addOption(new Option('-t, --type <string>', 'especifica el tipo de proyecto').default('behavior').choices(['behavior', 'resource']))

init.action(async (options) => {
    const config = await propertiesAsync();
    if (config) return console.log(chalk.yellowBright('No puedes inicializar otro proyecto el archivo'), chalk.bold(chalk.green('addon.properties'), chalk.yellowBright('ya existe')));
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
                message: 'Quieres colocar un namespace?:'
            },
        ];

        const response = await inquirer.prompt(confirm);

        if (response.namespace) {
            const input = [
                {
                    type: 'input',
                    name: 'namespace',
                    message: 'Escribe tu namespace:',
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
    if (addon.namespace)  console.log(chalk.yellow(`- Spacename: ${addon.namespace}`));
    if (addon.type)  console.log(chalk.yellow(`- Type: ${addon.type}`));
    const spinner = ora('Creando addon.properties...').start();

    try {
        await makeFile('addon.properties', content);

        spinner.succeed(chalk.bold(chalk.whiteBright(`Proyecto inicializado correctamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear addon.properties.'));
        console.error(error);
    }
});

export default init;