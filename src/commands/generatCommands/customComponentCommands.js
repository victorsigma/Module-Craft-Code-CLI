import { Command } from "commander";
import itemsComponent from "./components/itemsComponentCommands.js";
import blocksComponent from './components/blocksComponentCommands.js';

const component = new Command('component').alias('c').description('Generar un componentes personalizado [block|item]')

component.addCommand(itemsComponent);
component.addCommand(blocksComponent);

export default component;