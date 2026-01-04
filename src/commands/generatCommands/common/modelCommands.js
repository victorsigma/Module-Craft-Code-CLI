import { Command, Option } from "commander";
import { language } from "../../../utils/i18n.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { ONLY_RESOURCE } from "../../../utils/constants.js";
import chalk from "chalk";
import { slabBlockModel } from "./models/slabBlockModel.js";
import { stairBlockModel } from "./models/stairBlockModel.js";

const model = new Command('model').alias("mo")
    .description(language.__("common.model.description"))

model.addOption(new Option('-t, --type <string>', language.__("common.model.option.t")).default("slab").choices(["slab", "stair"]));


/**
 * @param {{type: "slab" | "stair" | undefined }} options 
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
    if (options.type === "slab") {
        await slabBlockModel(options)
    } else {
        await stairBlockModel(options);
    }

    process.exit(0);
}

model.action(async (options) => {
    await action(options)
})

export default model;