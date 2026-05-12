import { cloneFile, validateFileAsync } from "../utils/fileOperations.js";
import { language } from "../utils/i18n.js";
import chalk from "chalk";

/**
 * Construye el contenido del archivo para definir la libreria
 * @param {{ name: 
 * "formatter.js" | "bedrockSystem.js" | "blockManager.js" | "itemManager.js" | "vectorManager.js" | "worldFuntions.js"
 * }} params
 * @returns
 */
export async function libraryBuilder({ name = "bedrockSystem.js" }) {
    const validationLib = await validateFileAsync(`scripts/libs/${name}`);

    if (validationLib) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow(name), chalk.whiteBright(language.__(`common.library.build.exists`))));
        return false;
    }

    const fc = await cloneFile(`js/libs/${name}`, `scripts/libs/${name}`)
    if (fc) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow(name), chalk.whiteBright(language.__(`common.library.build.succeed`))))
    } else {
        console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("common.library.build.header")), chalk.yellow(name), chalk.whiteBright(language.__(`common.library.build.error`))))
    }
    return fc;
}