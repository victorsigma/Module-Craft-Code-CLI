import { ONLY_BEHAVIOR, ONLY_RESOURCE } from "../../../utils/constants.js";
import { fenceGateBehaviorPack } from "./blocks/fenceGateBehaviorPack.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { blockBehaviorPack } from "./blocks/blockBehaviorPack.js";
import { blockResourcePack } from "./blocks/blockResourcePack.js";
import { fenceBehaviorPack } from "./blocks/fenceBehaviorPack.js";
import { slabBehaviorPack } from "./blocks/slabBehaviorPack.js";
import { wallBehaviorPack } from "./blocks/wallBehaviorPack.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from "commander";
import chalk from "chalk";

export const behaviorBlockStrategies = {
    block: blockBehaviorPack,
    stair: blockBehaviorPack,
    slab: slabBehaviorPack,
    fence: fenceBehaviorPack,
    fence_gate: fenceGateBehaviorPack,
    wall: wallBehaviorPack
};

const block = new Command('block').alias('b')
    .description(language.__("element.block.description"))

block.option('-n, --name <string>', language.__("element.block.option.n"), 'namespace:block');
block.addOption(new Option('-p, --prefab <string>', language.__("element.block.option.p")).default("block").choices(["block", "stair", "slab", "fence", "fence_gate", "wall"]));
block.option('-m, --menu <boolean>', language.__("element.block.option.m"), false);
block.option('-l, --liquid <boolean>', language.__("element.block.option.l"), false);
block.addOption(new Option('-r, --render <string>', language.__("element.block.option.r")).default('opaque').choices(['opaque', 'double_sided', 'blend', 'alpha_test']));

block.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("element.block.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );
    options.config = config;
    const behavior = await ONLY_BEHAVIOR()
    if (behavior) {
        const strategy = behaviorBlockStrategies[options.prefab] ?? blockBehaviorPack;
        await strategy(options);
    }
    
    const resource = await ONLY_RESOURCE()
    if (resource) {
        await blockResourcePack(options);
    }
    process.exit(0);
})

export default block;