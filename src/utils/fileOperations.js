import { toCamelCase } from "./stringManager.js";
import path from "path";
import fs from 'fs';
import { EVENT_TEMPLATES } from "./constants.js";


export const validateDirectory = async (dir) => {
    const parts = dir.split(path.sep);
    let prevPath = '';

    for (const folder of parts) {
        const currentPath = path.join(prevPath, folder);

        try {
            // Verificar si la carpeta existe
            await fs.promises.access(currentPath, fs.constants.F_OK);
        } catch (err) {
            // Si la carpeta no existe, crearla
            await fs.promises.mkdir(currentPath, { recursive: true });
        }

        prevPath = currentPath;
    }
}

export const clearEvents = async (dir) => {
    try {
        // Eliminar el directorio si existe
        await fs.promises.rm(dir, { recursive: true, force: true });

        // Crear el directorio de nuevo
        await fs.promises.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error(`Error al eliminar o crear el directorio: ${error.message}`);
    }
}

export const makeComponentFile = async (name, currentPath, content) => {
    const fileName = `${currentPath}/${toCamelCase(name.split(':')[1])}Component.js`;

    await validateDirectory(currentPath);
    try {
        await fs.promises.writeFile(fileName, content, 'utf-8');
    } catch (error) {
        throw error;
    }
}

export const makeEventFile = async (name, event, currentPath) => {
    const fileName = `${currentPath}/${toCamelCase(name.split(':')[1])}/${event}Event.js`;

    await validateDirectory(`${currentPath}/${toCamelCase(name.split(':')[1])}`);
    const content = await EVENT_TEMPLATES[event](name);

    try {
        await fs.promises.writeFile(fileName, content, 'utf-8');
    } catch (error) {
        throw error;
    }
}

export const makeFile = async (name, content) => {
    const fileName = name;
    try {
        await fs.promises.writeFile(fileName, content, 'utf-8');
    } catch (error) {
        throw error;
    }
}