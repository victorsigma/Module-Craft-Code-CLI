import ora from "ora";
import fence from "../../../../assets/templates/models/custom_fence.geo.json" with { type: 'json' };
import fenceIcon from "../../../../assets/templates/models/custom_fence.icon.json" with { type: 'json' };
import { language } from "../../../../utils/i18n.js";
import { makeSubFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import chalk from "chalk";
import { selectFromArray } from "../../../../utils/forms.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const fenceBlockModel = async (options) => {
    if (Array.isArray(options.config['addon.namespace'])) {
        console.log(chalk.yellow(language.__("addon.namespace.multiple")));
        const namespace = await selectFromArray(options.config['addon.namespace']);
        options.namespace = namespace
    } else {
        options.namespace = options.config['addon.namespace']
    }

    const spinner = ora(language.__("common.model.spinner.start")).start();
    fence["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_fence`
    fenceIcon["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_fence_icon`
    const fileName = `${options.namespace}_fence.geo.json`
    const fileNameIcon = `${options.namespace}_fence.icon.json`

    try {
        if (await validateFileAsync(`models/blocks/${fileName}`)) return spinner.fail(chalk.bold(chalk.yellowBright(language.__("common.model.exits.3").replace("fileName", fileName))));
        await makeSubFile(fileName, `models/blocks/`, JSON.stringify(fence, null, 2))
        await makeSubFile(fileNameIcon, `models/blocks/`, JSON.stringify(fenceIcon, null, 2))

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("common.model.spinner.succeed"))));
    } catch (error) {
        console.log(error);
        spinner.fail(chalk.red(language.__("common.model.spinner.error")));
    }
}