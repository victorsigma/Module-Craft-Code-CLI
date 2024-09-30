import fs from 'fs';
import path from 'path';

/**
 * Obtiene las propiedades de la aplicación de manera asincrona.
 * @returns {Promise<Array<string>>}
 */
export const propertiesAsync = async () => {
    const filePath = path.join('./addon.properties');

    try {
        if (!fs.existsSync(filePath)) return undefined;

        const file = await fs.promises.readFile(filePath, 'utf-8');

        const lines = file.replace(/\r\n|\n/g, "\n").split("\n")

        const config = {};

        lines.forEach(line => {
            if (line.trim() !== '' && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                config[key.trim()] = value.trim();
            }
        });

        return config;
    } catch {
        return undefined
    }
}

/**
 * Obtiene las propiedades de la aplicación de manera sincrona.
 * @returns {Array<string>}
 */
export const propertiesSync = () => {
    const filePath = path.join('./addon.properties');

    try {
        if (!fs.existsSync(filePath)) return undefined;

        const file = fs.readFileSync(filePath, { encoding: 'utf-8' });

        const lines = file.replace(/\r\n|\n/g, "\n").split("\n");

        const config = {};

        lines.forEach(line => {
            if (line.trim() !== '' && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                config[key.trim()] = value.trim();
            }
        });

        return config;
    } catch (error) {
        console.log(error);
        return undefined
    }
}