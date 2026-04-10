import { ONLY_BEHAVIOR, ONLY_RESOURCE } from "../../../utils/constants.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { blockBehaviorPack } from "./blocks/blockBehaviorPack.js";
import { blockResourcePack } from "./blocks/blockResourcePack.js";
import { fenceBehaviorPack } from "./blocks/fenceBehaviorPack.js";
import { slabBehaviorPack } from "./blocks/slabBehaviorPack.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from "commander";
import chalk from "chalk";
import { wallBehaviorPack } from "./blocks/wallBehaviorPack.js";

const block = new Command('block').alias('b')
    .description(language.__("element.block.description"))

block.option('-n, --name <string>', language.__("element.block.option.n"), 'namespace:block');
block.addOption(new Option('-p, --prefab <string>', language.__("element.block.option.p")).default("block").choices(["block", "stair", "slab", "fence", "wall"]));
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
        switch (options.prefab) {
            case "slab":
                await slabBehaviorPack(options);
                break;
            case "fence":
                await fenceBehaviorPack(options);
                break;
            case "wall":
                await wallBehaviorPack(options);
                break;
            default:
                await blockBehaviorPack(options);
                break;
        }
    }
    const resource = await ONLY_RESOURCE()
    if (resource) {
        await blockResourcePack(options);
    }
    process.exit(0);
})

export default block;