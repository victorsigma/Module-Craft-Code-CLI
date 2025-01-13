/**
 * 
 * @param {String} string 
 * @returns {String}
 */
export const toCamelCase = (string) => {
    const output = string.replace(/([-_][a-z])/g, group => group.toUpperCase().replaceAll('-', '').replaceAll('_', ''));
    return output;
}

/**
 * 
 * @param {String} string 
 * @returns {String}
 */
export const toSnackCase = (string) => {
    const output = string.toLowerCase().replaceAll(' ', '_').replaceAll('-', '_');
    return output;
}


/**
 * 
 * @param {String} string 
 * @returns {String}
 */
export const uppercaseFirstLetter = (string) => {
    const output = string.charAt(0).toUpperCase() + string.slice(1);
    return output
}

/**
 * 
 * @param {String} string 
 * @returns {String}
 */
const isValidUUIDv4 = (string) => {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(string);
};



export const customStringify = (obj, spaces = 2) => {
    const jsonString = JSON.stringify(obj, null, spaces);

    // Limpiar saltos de línea innecesarios dentro de los arrays
    return jsonString
        .replace(/(\[\n\s*)/g, '[')
        .replace(/(\n\s*\])/g, ']');
}