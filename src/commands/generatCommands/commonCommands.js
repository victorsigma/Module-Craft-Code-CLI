import { Command } from "commander";
import lang from "./common/langCommands.js";
import manifest from "./common/manifestCommands.js";
import library from "./common/libraryCommands.js";

const common = new Command('common').alias('cm').description('Generar un archivo de la categoria common [lang|manifest]')

common.addCommand(lang);
common.addCommand(manifest);
common.addCommand(library);

export default common;