import { Command } from "commander";
import { LIBS, ONLY_BEHAVIOR } from "../../../utils/constants.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { cloneFile, validateFile } from "../../../utils/fileOperations.js";

const library = new Command('library').alias('lib')
    .description('Genera un archivo de idioma');

library.option('-m, --module <string>', 'especifica la libreria a agregar')


library.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright('No puedes agregar una libreria en un proyecto sin el archivo'),
        chalk.bold(chalk.green('addon.properties'))
    );

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright('No puedes generar un componente en un proyecto que no sea behavior')
    );
    if (!LIBS.includes(options.module)) {
        console.log(
            chalk.yellowBright('La libreria no fue seleciona o no es valida')
        );
        const questions = [
            {
                type: 'list',
                name: 'selection',
                message: 'Selecciona la libreria:',
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
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('formatter.js'), chalk.whiteBright('fue agregado exitosamente.')))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('formatter.js'), chalk.whiteBright('no pudo ser agregado')))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('formatter.js'), chalk.whiteBright('ya existe.')))
            }
            const validationBedrockSystem = validateFile('scripts/libs/bedrockSystem.js');
            if (!validationBedrockSystem) {
                fc2 = await cloneFile('js/libs/bedrockSystem.js', 'scripts/libs/bedrockSystem.js')
                if (fc2) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('bedrockSystem.js'), chalk.whiteBright('fue agregado exitosamente.')))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('bedrockSystem.js'), chalk.whiteBright('no pudo ser agregado')))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('bedrockSystem.js'), chalk.whiteBright('ya existe.')))
            }

            create = (fc1 && fc2);
            break;
        case "blockManager":
            const validationBlockManager = validateFile('scripts/libs/blockManager.js');
            let fc3 = false;
            if (!validationBlockManager) {
                fc3 = await cloneFile('js/libs/blockManager.js', 'scripts/libs/blockManager.js')
                if(fc3) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('blockManager.js'), chalk.whiteBright('fue agregado exitosamente.')))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('blockManager.js'), chalk.whiteBright('no pudo ser agregado')))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('blockManager.js'), chalk.whiteBright('ya existe.')))
            }
            create = fc3;
            break;
        case "itemManager":
            const validationItemManager = validateFile('scripts/libs/itemManager.js');
            let fc4 = false;
            if (!validationItemManager) {
                fc4 = await cloneFile('js/libs/itemManager.js', 'scripts/libs/itemManager.js')
                if(fc4) {
                    console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('itemManager.js'), chalk.whiteBright('fue agregado exitosamente.')))
                } else {
                    console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('itemManager.js'), chalk.whiteBright('no pudo ser agregado')))
                }
            } else {
                console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El archivo`), chalk.yellow('itemManager.js'), chalk.whiteBright('ya existe.')))
            }
            
            create = fc4;
            break;
        default:
            break;
    }

    if (create) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`La libreria`), chalk.yellow(options.module), chalk.whiteBright('fue agregada exitosamente.')))
    } else {
        console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`La libreria`), chalk.yellow(options.module), chalk.whiteBright('no puedo ser agregada.')))
    }
})

export default library;