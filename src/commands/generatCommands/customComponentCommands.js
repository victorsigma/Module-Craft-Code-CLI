import itemsComponent from "./components/itemsComponentCommands.js";
import blocksComponent from './components/blocksComponentCommands.js';
import { language } from '../../utils/i18n.js';
import { Command } from "commander";

const component = new Command('component').alias('c').description(language.__("component.description"))

component.addCommand(itemsComponent);
component.addCommand(blocksComponent);

export default component;