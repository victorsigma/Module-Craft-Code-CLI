import { language } from '../utils/i18n.js';
import inquirer from "inquirer";

/**
 * Genera un fomulario dinamico para selecionar un elemento de un array
 * @param {Array} array
 * @returns {Promise<string | number | boolean>}
 */
export const selectFromArray = async (array) => {
    const choices = array.map((value) => {
        return { value, name: `${value}` }
    })

    const questions = [
        {
            type: 'list',
            name: 'selection',
            message: language.__("form.selection"),
            choices
        }
    ];

    const response = await inquirer.prompt(questions);
    return response.selection;
}