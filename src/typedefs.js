/**
 * @typedef {{ 
 *     "addon.name": string,
 *     "addon.description": string,
 *     "addon.namespace": string | string[],
 *     "addon.type": "resource" | "behavior",
 *     "namespace.mode": "single" | "multi"
 * }} AddonProperties
 */
export const AddonProperties = {};

/**
 * @typedef {{ 
 *     name: string,
 *     config: AddonProperties
 * }} Options
 */
export const Options = {};