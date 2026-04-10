import { toSnackCase } from "../utils/stringManager.js";
import { selectFromArray } from "../utils/forms.js";
import { language } from "../utils/i18n.js";
import inquirer from "inquirer";
import chalk from "chalk";

/**
 * 
 * @param {string} name 
 * @param {{[key: string]: string | Array<string> }} config 
 * @param {"item" | "block" | "entity"} type 
 * @returns {Promise<string>}
 */
export async function resolveElementName(name, config, type) {
    name = await ensureNamespacedName(name, config);
    name = await resolveDefaultNamespacePlaceholder(name, config, type);
    return name;
}


/**
 * 
 * @param {string} name 
 * @param {{[key: string]: string | Array<string> }} config 
 * @returns {Promise<string>}
 */
async function ensureNamespacedName(name, config) {
    name = toSnackCase(name);
    let attempts = 0;
    while (!name.includes(':')) {
        if (attempts++ > 5) {
            throw new Error("Too many invalid namespace attempts");
        }
        if (!config['addon.namespace']) {
            console.error(
                chalk.red(language.__("addon.namespace.error.1")),
                chalk.green(language.__("addon.namespace.error.2")),
                chalk.white(name)
            );

            const input = [
                { type: 'input', name: 'name', message: language.__("addon.namespace.question") }
            ];

            const response = await inquirer.prompt(input);
            name = toSnackCase(response.name);
        } else {
            name = await applyNamespace(name, config)
        }
    }
    return name
}

/**
 * 
 * @param {string} name 
 * @param {{[key: string]: string | Array<string> }} config 
 * @param {"item" | "block" | "entity"} type 
 * @returns {Promise<string>}
 */
async function resolveDefaultNamespacePlaceholder(name, config, type) {
    if (name !== `namespace:${type}`) return name

    name = await applyNamespace(type, config)
    return name
}

function isMultiNamespace(config) {
    if(!config['namespace.mode']) return console.warn(chalk.yellow(language.__("addon.namespace.mode_warning")));
    return Array.isArray(config['addon.namespace']) &&
        config['namespace.mode'] === "multi";
}

/**
 * Retorna un namespace simple, ya sea el único definido o el primero de una lista.
 * @param {{[key: string]: string | Array<string> }} config 
 * @returns {string}
 */
function getSingleNamespace(config) {
    return Array.isArray(config['addon.namespace'])
        ? config['addon.namespace'][0]
        : config['addon.namespace'];
}

/**
 * Resuelve el namespace a usar, ya sea seleccionando uno de varios disponibles o usando el único definido.
 * @param {{[key: string]: string | Array<string> }} config 
 * @returns 
 */
export async function resolveNamespace(config) {
    if (isMultiNamespace(config)) {
        console.log(chalk.yellow(language.__("addon.namespace.multiple")));
        return await selectFromArray(config['addon.namespace']);
    }

    return getSingleNamespace(config);
}

async function applyNamespace(name, config) {
    let namespace = await resolveNamespace(config);
    if (!namespace) {
        namespace = "namespace";
    }
    name = `${namespace}:${name}`;

    return name;
}