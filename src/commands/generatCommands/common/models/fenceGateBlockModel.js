import fenceGateIcon from "../../../../assets/templates/models/custom_fence_gate.icon.json" with { type: 'json' };
import fenceGate from "../../../../assets/templates/models/custom_fence_gate.geo.json" with { type: 'json' };

import { generateModelFile } from "../../../../core/generateFile.js";
import { resolveNamespace } from "../../../../core/nameResolver.js";


/**
 * @param {{config:{"addon.namespace": string}}} options 
 * @returns 
 */
export const fenceGateBlockModel = async (options) => {
    options.namespace = await resolveNamespace(options.config);
    
    fenceGate["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_fence_gate`
    fenceGateIcon["minecraft:geometry"][0]["description"]["identifier"] = `geometry.${options.namespace}_fence_gate_icon`
    const fileName = `${options.namespace}_fence_gate.geo.json`
    const fileNameIcon = `${options.namespace}_fence_gate.icon.json`

    await generateModelFile({
        fileName,
        path: "models/blocks/",
        content: fenceGate,
        fileNameIcon,
        contentIcon: fenceGateIcon
    })
}