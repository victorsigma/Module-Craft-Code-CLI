import { getTextFileEvent } from "../utils/fileOperations.js";
import { language } from "../utils/i18n.js";

/**
 * Carga y procesa templates de eventos
 * @param {{events: string[], addonName: string, namespace: string, templatePath: string}} params
 * @returns
 */
export async function eventTemplates({ events, addonName, namespace, templatePath = "blocks/slab" }) {
    const variables = {
        addon_name: addonName,
        namespace
    };

    const results = await Promise.all(events.map(async (event) => {
        let content = await getTextFileEvent(`${templatePath}/${event}Event.js`);

        if (!content) {
            throw new Error(language.__("operations.error.8"));
        }

        return { event, content: applyTemplate(content, variables) }
    }))

    return results;
}

/**
 * @param {string} content 
 * @param {Object} variables 
 * @returns 
 */
export function applyTemplate(content, variables) {
    return Object.entries(variables).reduce((acc, [key, value]) => {
        return acc.replaceAll(key, value);
    }, content);
}