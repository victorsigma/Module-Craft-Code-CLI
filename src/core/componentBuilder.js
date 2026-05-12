import { toCamelCase, uppercaseFirstLetter } from "../utils/stringManager.js";

/**
 * Contruye el contenido del archivo para definir el componente
 * @param {{ name: string, events: string[], projectName: string, description: string, type: "blocks" | "items", basePath: string}} params
 */
export function componentBuilder({ name, events, projectName, description, type = "blocks", basePath = "../../events" }) {
    const imports = componentImportsBuilder({ name, events, type, basePath });
    const eventMappings = componentEventsBuilder({ name, events });

    const nameCamel = resolveComponentName(name);

    const content = `${imports}

/**
 * Componente: ${name}
 * Descripción: ${description}${projectName}
 */

export const ${nameCamel}Component = {
    ${eventMappings}
}`;
    
    return content;
}

/**
 * Construye los imports de eventos que utilizara el componente
 * @param {{ name: string, events: string[], type: "blocks" | "items", basePath: string}} params 
 * @returns 
 */
export function componentImportsBuilder({ name, events, type = "blocks", basePath = "../../events" }) {
    if (!events?.length) return "";
    
    const nameCamel = resolveComponentName(name);

    return events.map(event => {
            return `import { ${nameCamel}${uppercaseFirstLetter(event)}Event } from "${basePath}/${type}/${nameCamel}/${event}Event";`;
    }).join('\n');
}

/**
 * Construye la asignacion de eventos del componente
 * @param {{ name: string, events: string[]}} params 
 */
export function componentEventsBuilder({ name, events }) {
    if (!events?.length) return "";

    const nameCamel = resolveComponentName(name);

    return events.map(event => {
        return `${event}: ${nameCamel}${uppercaseFirstLetter(event)}Event`;
    }).join(',\n\t');
}

/**
 * @param {string} name 
 * @returns 
 */
function resolveComponentName(name) {
    const [, rawName] = name.split(':');
    return toCamelCase(rawName);
}

