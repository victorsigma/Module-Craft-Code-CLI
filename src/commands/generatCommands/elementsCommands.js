import { Command } from "commander";
import entity from "./elements/entitesCommands.js";
import item from "./elements/itemsCommands.js";
import block from "./elements/blocksCommands.js";
const element = new Command('element').alias('e').description('Generar objeto de tipo [entity|item|block|recipe]')

element.addCommand(entity);
element.addCommand(item);
element.addCommand(block);

export default element;