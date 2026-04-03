import terrain_texture from "../../../../assets/jsons/terrain_texture.json" with { type: 'json' };

import { getJsonFile, makeSubFile, validateFileAsync } from "../../../../utils/fileOperations.js";
import { resolveElementName } from "../../../../core/nameResolver.js";
import { PATH_BLOCK_TEXTURES } from "../../../../utils/constants.js";
import { language } from "../../../../utils/i18n.js";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

/**
 * @param {{name: string, config: {[key: string]: string | Array<string> }}} options 
 * @returns 
 */
export const blockResourcePack = async (options) => {
    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "block");

    const textureName = options.name.split(':')[1]

    const spinner = ora(language.__("element.block.resource.spinner.start")).start();
    try {
        const fileName = `textures/terrain_texture.json`
        let fileData = { ...terrain_texture };
        if (await validateFileAsync(fileName)) {
            fileData = await getJsonFile(fileName);
            fileData.texture_data[textureName] = { "textures": `${PATH_BLOCK_TEXTURES}/${textureName}` }
            await makeSubFile('terrain_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        } else {
            fileData.texture_data[textureName] = { "textures": `${PATH_BLOCK_TEXTURES}/${textureName}` }
            await makeSubFile('terrain_texture.json', `textures/`, JSON.stringify(fileData, null, 2))
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(language.__("element.block.resource.spinner.succeed").replace("${textureName}", textureName))));
    } catch (error) {
        spinner.fail(chalk.red(language.__("element.block.resource.spinner.error").replace("${textureName}", textureName)));
        console.error(error);
    }
}