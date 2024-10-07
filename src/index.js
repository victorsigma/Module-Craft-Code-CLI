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

const program = new Command();

program.version(VERSION).description('CLI versátil para generar y gestionar módulos, componentes, eventos y archivos de configuración en proyectos de Minecraft.');
program.name('Module Craft Code CLI');

program.addCommand(init);
program.addCommand(generate);
program.addCommand(itemsComponent);
program.addCommand(blocksComponent);
program.addCommand(lang);
program.addCommand(manifest);
program.addCommand(icon);
program.addCommand(entity);

program.parse(process.argv);