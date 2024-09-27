#!/usr/bin/env node
import { Command } from 'commander';
import itemsComponent from './commands/itemsComponentComands.js';
import blocksComponent from './commands/blocksComponentComands.js';
import init from './commands/initComands.js';
import generate from './commands/generateCommands.js';
import lang from './commands/langCommands.js';

const program = new Command();

program.version('0.1.0').description('CLI versátil para generar y gestionar módulos, componentes, eventos y archivos de configuración en proyectos de Minecraft.');
program.name('Module Craft Code CLI');




program.addCommand(init);
program.addCommand(generate);
program.addCommand(itemsComponent);
program.addCommand(blocksComponent);
program.addCommand(lang)

program.parse(process.argv);