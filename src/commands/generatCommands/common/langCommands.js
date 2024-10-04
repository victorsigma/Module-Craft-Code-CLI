import { propertiesAsync } from "../../../utils/readProperties.js";
import { makeSubFile, validateFile } from "../../../utils/fileOperations.js";
import { LANGS } from "../../../utils/constants.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const lang = new Command('lang')
    .description('Genera un archivo de idioma')

lang.option('-r, --region <string>', 'especifica la region para la localizacion de idioma');

lang.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) {
        return console.log(
            chalk.yellowBright('No puedes generar un archivo de localización en un proyecto sin el archivo'),
            chalk.bold(chalk.green('addon.properties'))
        );
    }

    if (!LANGS.includes(options.region)) {
        console.log(
            chalk.yellowBright('La localización no fue seleciona o no es valida')
        );
        const questions = [
            {
                type: 'list',
                name: 'selection',
                message: 'Selecciona la localización:',
                choices: [
                    { value: "da_DK", name: "Danish, Denmark" },
                    { value: "de_DE", name: "German, Germany" },
                    { value: "en_GB", name: "English, Great Britain" },
                    { value: "en_US", name: "English, North America" },
                    { value: "es_ES", name: "Spanish, Spain" },
                    { value: "es_MX", name: "Mexican Spanish, Mexico" },
                    { value: "fr_CA", name: "Canadian French, Canada" },
                    { value: "fr_FR", name: "French, France" },
                    { value: "it_IT", name: "Italian, Italy" },
                    { value: "hu_HU", name: "Hungarian, Hungary" },
                    { value: "nl_NL", name: "Dutch, Netherlands" },
                    { value: "nb_NO", name: "Bokmål, Norway" },
                    { value: "pl_PL", name: "Polish, Poland" },
                    { value: "pt_BR", name: "Brazilian Portuguese, Brazil" },
                    { value: "pt_PT", name: "Portuguese, Portugal" },
                    { value: "sk_SK", name: "Slovak, Slovakia" },
                    { value: "fi_FI", name: "Finnish, Finland" },
                    { value: "sv_SE", name: "Swedish, Sweden" },
                    { value: "tr_TR", name: "Turkish, Turkey" },
                    { value: "cs_CZ", name: "Czech, Czech Republic" },
                    { value: "el_GR", name: "Greek, Greece" },
                    { value: "bg_BG", name: "Bulgarian, Bulgaria" },
                    { value: "ru_RU", name: "Russian, Russia" },
                    { value: "uk_UA", name: "Ukrainian, Ukraine" },
                    { value: "ja_JP", name: "Japanese, Japan" },
                    { value: "zh_CN", name: "Chinese (Simplified), China" },
                    { value: "zh_TW", name: "Chinese (Traditional), Taiwan" },
                    { value: "ko_KR", name: "Korean, Korea" },
                ],
            },
        ];

        const response = await inquirer.prompt(questions);

        options.region = response.selection;
    }





    console.log(chalk.yellow(`- ${options.region}`));

    const content =
        `pack.name=${config['addon.name']}
pack.description=${config['addon.description']}`

    const spinner = ora('Creando localización...').start();

    try {

        if (validateFile(`texts/${options.region}.lang`)) return spinner.fail(chalk.bold(chalk.yellowBright('La localización ya existe')));
        await makeSubFile(`${options.region}.lang`, 'texts/', content);

        spinner.succeed(chalk.bold(chalk.whiteBright(`La localización ${options.region} ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear el componente.'));
        console.error(error);
    }
})


export default lang;