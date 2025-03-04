#!/usr/bin/env node
import { Command } from 'commander';
import { VERSION } from './utils/constants.js';
import generate from './commands/generatCommands/generateCommands.js';
import init from './commands/initCommands.js';
import setting from './commands/settingCommands.js';
import { language } from './utils/i18n.js';


const program = new Command();

program.version(VERSION).description(language.__('program.description'));
program.name(language.__('program.name'));

program.addCommand(init);
program.addCommand(generate);
program.addCommand(setting);


process.on('SIGINT', () => {
	console.log("\n" + language.__('program.exeption.close.1'));
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	if (err.message.includes('force closed')) {
		console.log(language.__('program.exeption.close.2'));
	} else {
		console.error(language.__('program.exeption.close.3'), err);
	}
	process.exit(0);
});

program.parse(process.argv);