import ora from "ora";
import stair from "../../../../assets/templates/models/custom_stair.geo.json" with { type: 'json' };
import { language } from "../../../../utils/i18n.js";
import { makeSubFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import chalk from "chalk";
import { selectFromArray } from "../../../../utils/forms.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const stairBlockModel = async (options) => {
    if (Array.isArray(options.config['addon.namespace'])) {
        console.log(chalk.yellow(language.__("addon.namespace.multiple")));
        const namespace = await selectFromArray(options.config['addon.namespace']);
        options.namespace = namespace
    } else {
        return
    }

    const spinner = ora(language.__("common.model.spinner.start")).start();
    stair["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_stair`
    const fileName = `${options.namespace}_stair.geo.json`

    try {
        if (await validateFileAsync(`models/blocks/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("common.model.exits.3").replace("fileName", fileName))));
        await makeSubFile(fileName, `models/blocks/`, JSON.stringify(stair, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("common.model.spinner.succeed"))));
    } catch (error) {
        console.log(error);
        spinner.fail(chalk.red(language.__("common.model.spinner.error")));
    }
}