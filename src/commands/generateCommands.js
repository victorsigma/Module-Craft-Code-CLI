import { Command } from "commander";
import component from "./customComponentComands.js";

const generate = new Command('generate').alias('g');

generate.addCommand(component);

export default generate;