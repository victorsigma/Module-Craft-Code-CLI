import { Command } from "commander";
import itemsComponent from "./itemsComponentComands.js";
import blocksComponent from './blocksComponentComands.js';

const component = new Command('component').alias('c').description('Generar un componentes personalizado [block|item]')

component.addCommand(itemsComponent);
component.addCommand(blocksComponent);

export default component;