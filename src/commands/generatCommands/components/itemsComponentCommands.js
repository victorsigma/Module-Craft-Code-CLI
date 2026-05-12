import { propertiesAsync } from '../../../utils/readProperties.js';
import { slabComponent } from "./itemPrefabs/slabComponent.js";
import { itemComponent } from "./itemPrefabs/itemComponent.js";
import { ONLY_BEHAVIOR } from '../../../utils/constants.js';
import { language } from "../../../utils/i18n.js";
import { Command, Option } from 'commander';
import chalk from 'chalk';

const itemsComponent = new Command('item').alias('i')
    .description(language.__("component.item.description"));
itemsComponent.option('-n, --name <string>', language.__("component.item.option.n"), 'namespace:item_component');
itemsComponent.option('-d, --description <string>', language.__("component.item.option.n"), 'description');
itemsComponent.addOption(new Option('-p, --prefab <string>', language.__("component.item.option.p")).default("none").choices(["none", "slab"]));

export const componentItemStrategies = {
    none: itemComponent,
    slab: slabComponent
};

itemsComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("component.item.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    options.config = config;

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright(language.__("component.item.exits.2"))
    );

    const strategy = componentItemStrategies[options.prefab] ?? itemComponent;
    await strategy(options)

    process.exit(0);
});


export default itemsComponent;