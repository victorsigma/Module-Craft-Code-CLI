import { Command } from "commander";
import entity from "./elements/entitesCommands.js";
const element = new Command('element').alias('e').description('Generar objeto de tipo [entity|item|block|recipe]')

element.addCommand(entity);

export default element;