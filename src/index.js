#!/usr/bin/env node
import { Command } from 'commander';
import { VERSION } from './utils/constants.js';
import itemsComponent from './commands/generatCommands/components/itemsComponentCommands.js';
import blocksComponent from './commands/generatCommands/components/blocksComponentCommands.js';
import generate from './commands/generatCommands/generateCommands.js';
import lang from './commands/generatCommands/common/langCommands.js';
import init from './commands/initCommands.js';
import manifest from './commands/generatCommands/common/manifestCommands.js';
import icon from './commands/generatCommands/common/iconCommands.js';
import entity from './commands/generatCommands/elements/entitesCommands.js';
import { language } from './utils/i18n.js';


const program = new Command();

program.version(VERSION).description(language.__('program.description'));
program.name(language.__('program.name'));

program.addCommand(init);
program.addCommand(generate);


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