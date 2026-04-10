import stairIcon from "../../../../assets/templates/models/custom_stair.icon.json" with { type: 'json' };
import stair from "../../../../assets/templates/models/custom_stair.geo.json" with { type: 'json' };

import { generateModelFile } from "../../../../core/generateFile.js";
import { resolveNamespace } from "../../../../core/nameResolver.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const stairBlockModel = async (options) => {
    options.namespace = await resolveNamespace(options.config);

    stair["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_stair`
    stairIcon["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_stair_icon`
    const fileName = `${options.namespace}_stair.geo.json`
    const fileNameIcon = `${options.namespace}_stair.icon.json`

    await generateModelFile({
        fileName,
        path: "models/blocks/",
        content: stair,
        fileNameIcon,
        contentIcon: stairIcon
    })
}