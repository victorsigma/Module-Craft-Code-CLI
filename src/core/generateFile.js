import { makeSubFile, validateFileAsync } from "../utils/fileOperations.js";
import { language } from "../utils/i18n.js";
import chalk from "chalk";
import ora from "ora";

/**
 * 
 * @param {{fileName: string, path: string, content: any, lang: {
 *  start: string,
 *  success: string,
 *  error: string,
 *  exists: string},
 *  interpolate: any
 * }} params 
 * @returns 
 */
export async function generateFile({fileName, path, content, lang, interpolate = {}}) {
    const spinner = ora(language.__(lang.start)).start();
    try {
        if (await validateFileAsync(`${path}${fileName}`))
            return spinner.fail(chalk.bold(chalk.yellowBright(language.__(lang.exists).replace("fileName", fileName))));
        await makeSubFile(fileName, path, JSON.stringify(content, null, 2))

        let successMsg = language.__(lang.success);

        Object.entries(interpolate).forEach(([key, value]) => {
            successMsg = successMsg.replaceAll(`\${${key}}`, value);
        });

        spinner.succeed(chalk.bold(chalk.whiteBright(successMsg)));
    } catch (error) {
        let errorMsg = language.__(lang.error);

        Object.entries(interpolate).forEach(([key, value]) => {
            errorMsg = errorMsg.replaceAll(`\${${key}}`, value);
        });

        spinner.fail(chalk.red(errorMsg));
    }
}