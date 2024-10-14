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
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();

                // Divide el valor por comas si las contiene
                const values = trimmedValue.includes(',') ? trimmedValue.split(',').map(item => item.trim()) : [trimmedValue];

                // Si la clave ya existe, combina los valores
                if (config[trimmedKey]) {
                    config[trimmedKey] = Array.isArray(config[trimmedKey]) ? [...config[trimmedKey], ...values] : [config[trimmedKey], ...values];
                } else {
                    config[trimmedKey] = values.length === 1 ? values[0] : values;
                }
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
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();

                // Divide el valor por comas si las contiene
                const values = trimmedValue.includes(',') ? trimmedValue.split(',').map(item => item.trim()) : [trimmedValue];

                // Si la clave ya existe, combina los valores
                if (config[trimmedKey]) {
                    config[trimmedKey] = Array.isArray(config[trimmedKey]) ? [...config[trimmedKey], ...values] : [config[trimmedKey], ...values];
                } else {
                    config[trimmedKey] = values.length === 1 ? values[0] : values;
                }
            }
        });

        return config;
    } catch (error) {
        console.log(error);
        return undefined
    }
}