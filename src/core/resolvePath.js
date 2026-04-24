import { AddonProperties } from "../typedefs.js"

/**
 * Determina la carpeta en la que se crearan los archivos
 * @param {"blocks" | "items" | "entities" | "entity"} type 
 * @param {string} namespace 
 * @param {AddonProperties} config 
 * @returns {string}
 */
export function resolvePath(type, namespace, config) {
    const namespaceMode = config['namespace.mode'];

    if (namespaceMode === "single") {
        return `${type}/`; 
    }

    return `${type}/${namespace}/`;
}