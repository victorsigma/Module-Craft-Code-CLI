import { propertiesAsync } from "../utils/readProperties.js";
import { updateSettings } from "../utils/fileOperations.js";
import { Command, Option } from "commander";
import { language } from '../utils/i18n.js';
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const setting = new Command('setting').alias('s')

setting.description(language.__("setting.description"));

setting.addOption(new Option('-l, --lang <string>', language.__("setting.option.l")).default(undefined).choices(['es', 'en']));

setting.action(async (options) => {
	if (!options.lang) {
		const questions = [
			{
				type: 'list',
				name: 'lang',
				choices: [
					{ name: 'Español', value: 'es' },
					{ name: 'English', value: 'en' }
				],
				message: language.__("setting.questions.1"),
			}
		];

		const response = await inquirer.prompt(questions);
		options.lang = response.lang;
	}

	try {
		const spinner = ora(language.__("setting.spinner.start")).start();
		await updateSettings('lang', options.lang);
		spinner.succeed(language.__("setting.spinner.succeed"));
	} catch (error) {
		spinner.fail(chalk.red(language.__("setting.spinner.error")), error);
	}
});

export default setting;