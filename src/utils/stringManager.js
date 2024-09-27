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