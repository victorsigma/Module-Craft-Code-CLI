/**
 * 
 * @param {String} string 
 * @returns {String}
 */
export const toCamelCase = (string) => {
    const output = string.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
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