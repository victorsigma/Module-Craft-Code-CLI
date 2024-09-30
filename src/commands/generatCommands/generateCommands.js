import { Command } from "commander";
import component from "./customComponentCommands.js";
import common from "./commonCommands.js";

const generate = new Command('generate').alias('g');

generate.addCommand(component);
generate.addCommand(common);

export default generate;