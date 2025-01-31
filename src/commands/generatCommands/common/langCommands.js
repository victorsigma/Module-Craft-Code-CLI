import { propertiesAsync } from "../../../utils/readProperties.js";
import { makeSubFile, validateFile } from "../../../utils/fileOperations.js";
import { LANGS } from "../../../utils/constants.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from 'fs';

const lang = new Command('lang').alias('lan')
    .description(language.__("common.lang.description"))

lang.addOption(new Option('-r, --region <string>', language.__("common.lang.option.r")).choices(LANGS));

lang.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) {
        return console.log(
            chalk.yellowBright(language.__("common.lang.exits.1")),
            chalk.bold(chalk.green('addon.properties'))
        );
    }

    if (!LANGS.includes(options.region)) {
        console.log(
            chalk.yellowBright(language.__("common.lang.exits.2")),
        );
        const questions = [
            {
                type: 'list',
                name: 'selection',
                message: language.__("common.lang.selections"),
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
        `pack.name=${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}
pack.description=${Array.isArray(config['addon.description']) ? config['addon.description'][0] : config['addon.description']}`

    const spinner = ora(language.__("common.lang.spinner.start")).start();

    try {

        if (validateFile(`texts/${options.region}.lang`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("common.lang.exits.3"))));
        await makeSubFile(`${options.region}.lang`, 'texts/', content);

        if (!validateFile(`texts/languages.json`)) {
            const languages = [options.region];

            makeSubFile('languages.json', 'texts/', JSON.stringify(languages, null, 2))
        } else {
            const languagesText = await fs.promises.readFile('texts/languages.json', 'utf8');

            const languages = JSON.parse(languagesText);

            languages.push(options.region);

            makeSubFile('languages.json', 'texts/', JSON.stringify(languages, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("common.lang.spinner.succeed").replace("${options.region}", options.region))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("common.lang.spinner.error")));
        console.error(error);
    }
})


export default lang;