import { stairBlockModel } from "./models/stairBlockModel.js";
import { fenceBlockModel } from "./models/fenceBlockModel.js";
import { slabBlockModel } from "./models/slabBlockModel.js";
import { wallBlockModel } from "./models/wallBlockModel.js";

import { propertiesAsync } from "../../../utils/readProperties.js";
import { ONLY_RESOURCE } from "../../../utils/constants.js";
import { language } from "../../../utils/i18n.js";
import { Command, Option } from "commander";
import chalk from "chalk";
import { fenceGateBlockModel } from "./models/fenceGateBlockModel.js";

const model = new Command('model').alias("mo")
    .description(language.__("common.model.description"))

model.addOption(new Option('-t, --type <string>', language.__("common.model.option.t")).default("slab").choices(["slab", "stair", "fence", "fence_gate", "wall"]));


/**
 * @param {{type: "slab" | "stair" | "fence" | undefined }} options 
 * @returns 
 */
const action = async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("common.model.exits.1")),
        chalk.bold(chalk.green('addon.properties'))
    );

    const resource = await ONLY_RESOURCE()
    if (!resource) return console.log(
        chalk.yellowBright(language.__("common.model.exits.2"))
    );

    options.config = config;
    switch (options.type) {
        case "slab":
            await slabBlockModel(options);
            break;
        case "stair":
            await stairBlockModel(options);
            break;
        case "fence":
            await fenceBlockModel(options);
            break;
        case "fence_gate":
            await fenceGateBlockModel(options);
            break;
        case "wall":
            await wallBlockModel(options);
            break;
    }

    process.exit(0);
}

model.action(async (options) => {
    await action(options)
})

export default model;