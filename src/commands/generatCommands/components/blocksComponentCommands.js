import { fenceGateComponent } from "./blockPrefabs/fenceGateComponent.js";
import { propertiesAsync } from '../../../utils/readProperties.js';
import { blockComponent } from "./blockPrefabs/blockComponent.js";
import { slabComponent } from "./blockPrefabs/slabComponent.js";
import { ONLY_BEHAVIOR } from '../../../utils/constants.js';
import { language } from "../../../utils/i18n.js";
import { Command, Option } from 'commander';
import chalk from 'chalk';

const blocksComponent = new Command('block').alias('b')
    .description(language.__("component.block.description"));
blocksComponent.option('-n, --name <string>', language.__("component.block.option.n"), 'namespace:block_component');
blocksComponent.option('-d, --description <string>', language.__("component.block.option.d"), 'description');
blocksComponent.addOption(new Option('-p, --prefab <string>', language.__("component.item.option.p")).default("none").choices(["none", "slab", "fence_gate"]));

export const componentBlockStrategies = {
    none: blockComponent,
    slab: slabComponent,
    fence_gate: fenceGateComponent
};

blocksComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("component.block.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    options.config = config;

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright(language.__("component.block.exits.2"))
    );

    const strategy = componentBlockStrategies[options.prefab] ?? blockComponent;
    await strategy(options)
    
    process.exit(0);
});

export default blocksComponent;