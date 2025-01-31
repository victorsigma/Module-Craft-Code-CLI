import { Command } from "commander";
import entity from "./elements/entitesCommands.js";
import item from "./elements/itemsCommands.js";
import block from "./elements/blocksCommands.js";
import { language } from '../../utils/i18n.js';

const element = new Command('element').alias('e').description(language.__("element.description"))

element.addCommand(entity);
element.addCommand(item);
element.addCommand(block);

export default element;