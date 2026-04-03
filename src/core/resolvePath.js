/**
 * 
 * @param {"blocks" | "items" | "entities" | "entity"} type 
 * @param {string} namespace 
 * @param {{[key: string]: string | Array<string> }} config 
 * @returns {string}
 */
export function resolvePath(type, namespace, config) {
    const namespaceMode = config['namespace.mode'];

    if (namespaceMode === "single") {
        return `${type}/`; 
    }

    return `${type}/${namespace}/`;
}