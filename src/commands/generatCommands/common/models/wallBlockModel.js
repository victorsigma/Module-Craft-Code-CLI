import wallIcon from "../../../../assets/templates/models/custom_wall.icon.json" with { type: 'json' };
import wall from "../../../../assets/templates/models/custom_wall.geo.json" with { type: 'json' };

import { generateModelFile } from "../../../../core/generateFile.js";
import { resolveNamespace } from "../../../../core/nameResolver.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const wallBlockModel = async (options) => {
    options.namespace = await resolveNamespace(options.config);

    wall["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_wall`
    wallIcon["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_wall_icon`
    const fileName = `${options.namespace}_wall.geo.json`
    const fileNameIcon = `${options.namespace}_wall.icon.json`

    await generateModelFile({
        fileName,
        path: "models/blocks/",
        content: wall,
        fileNameIcon,
        contentIcon: wallIcon
    })
}