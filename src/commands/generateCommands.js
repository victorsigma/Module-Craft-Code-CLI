import { Command } from "commander";
import component from "./customComponentComands.js";
import lang from "./langCommands.js";

const generate = new Command('generate').alias('g');

generate.addCommand(component);
generate.addCommand(lang);

export default generate;