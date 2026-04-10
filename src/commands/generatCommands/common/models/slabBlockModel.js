import slab from "../../../../assets/templates/models/custom_slab.geo.json" with { type: 'json' };

import { generateModelFile } from "../../../../core/generateFile.js";
import { resolveNamespace } from "../../../../core/nameResolver.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const slabBlockModel = async (options) => {
    options.namespace = await resolveNamespace(options.config);

    slab["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_slab`
    const fileName = `${options.namespace}_slab.geo.json`

    await generateModelFile({
        fileName,
        path: "models/blocks/",
        content: slab
    })
}