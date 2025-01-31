import { Command } from "commander";
import lang from "./common/langCommands.js";
import manifest from "./common/manifestCommands.js";
import library from "./common/libraryCommands.js";
import { language } from '../../utils/i18n.js';
import icon from "./common/iconCommands.js";

const common = new Command('common').alias('cm').description(language.__("common.description"))

common.addCommand(lang);
common.addCommand(manifest);
common.addCommand(library);
common.addCommand(icon);

export default common;