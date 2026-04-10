import { updateSettings } from "../utils/fileOperations.js";
import { Command, Option } from "commander";
import { language } from '../utils/i18n.js';
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const setting = new Command('setting').alias('s')

setting.description(language.__("setting.description"));

setting.addOption(new Option('-l, --lang <string>', language.__("setting.option.l")).default(undefined).choices(['es', 'en']));
setting.addOption(new Option('-n, --namespacemode <string>', language.__("setting.option.n")).default(undefined).choices(['single', 'multi']));

setting.action(async (options) => {
	let spinner;
	try {
		const questions = [];

		if (!options.lang) {
			questions.push({
				type: 'select',
				name: 'lang',
				choices: [
					{ name: 'Español', value: 'es' },
					{ name: 'English', value: 'en' }
				],
				message: language.__("setting.questions.1"),
			});
		}

		if (!options.namespacemode) {
			questions.push({
				type: 'select',
				name: 'namespacemode',
				choices: [
					{ name: 'Single namespace', value: 'single' },
					{ name: 'Multiple namespaces', value: 'multi' }
				],
				message: language.__("setting.questions.2"),
			});
		}

		const answers = questions.length > 0
			? await inquirer.prompt(questions)
			: {};

		const finalOptions = {
			lang: options.lang ?? answers.lang,
			namespacemode: options.namespacemode ?? answers.namespacemode
		};

		spinner = ora(language.__("setting.spinner.start")).start();

		if (finalOptions.lang) {
			await updateSettings('lang', finalOptions.lang);
		}

		if (finalOptions.namespacemode) {
			await updateSettings('namespace.mode', finalOptions.namespacemode);
		}

		spinner.succeed(language.__("setting.spinner.succeed"));
	} catch (error) {
		if (spinner) {
			spinner.fail(language.__("setting.spinner.error"));
		}
		console.error(chalk.red(error.message));
	}
});

export default setting;