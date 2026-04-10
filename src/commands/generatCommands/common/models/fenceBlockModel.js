import fenceIcon from "../../../../assets/templates/models/custom_fence.icon.json" with { type: 'json' };
import fence from "../../../../assets/templates/models/custom_fence.geo.json" with { type: 'json' };

import { generateModelFile } from "../../../../core/generateFile.js";
import { resolveNamespace } from "../../../../core/nameResolver.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const fenceBlockModel = async (options) => {
    options.namespace = await resolveNamespace(options.config);
    
    fence["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_fence`
    fenceIcon["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_fence_icon`
    const fileName = `${options.namespace}_fence.geo.json`
    const fileNameIcon = `${options.namespace}_fence.icon.json`

    await generateModelFile({
        fileName,
        path: "models/blocks/",
        content: fence,
        fileNameIcon,
        contentIcon: fenceIcon
    })
}