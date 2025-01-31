import { Command } from "commander";
import component from "./customComponentCommands.js";
import common from "./commonCommands.js";
import element from "./elementsCommands.js";
import { language } from "../../utils/i18n.js";

const generate = new Command('generate').alias('g');
generate.description(language.__("generate.description"));

generate.addCommand(component);
generate.addCommand(common);
generate.addCommand(element);

export default generate;