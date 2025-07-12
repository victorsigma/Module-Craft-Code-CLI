import { EVENT_TEMPLATES } from "./constants.js";
import { toCamelCase } from "./stringManager.js";
import { fileURLToPath } from 'url';
import { language } from "./i18n.js";
import chalk from "chalk";
import path from "path";
import fs from 'fs';

import settings from '../assets/settings.json' with { type: 'json' };

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


export const validateFile = (dir) => {
	return fs.existsSync(dir);
}

export const validateFileAsync = async (dir) => {
	try {
		await fs.promises.access(dir, fs.constants.F_OK);
		return true;
	} catch (error) {
		return false;
	}
}



export const clearEvents = async (dir) => {
	try {
		// Eliminar el directorio si existe
		await fs.promises.rm(dir, { recursive: true, force: true });

		// Crear el directorio de nuevo
		await fs.promises.mkdir(dir, { recursive: true });
	} catch (error) {
		console.error(`${language.__("operations.error.7")} ${error.message}`);
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

export const makeSubFile = async (name, currentPath, content) => {
	const fileName = `${currentPath}${name}`;
	try {
		await validateDirectory(`${currentPath}`);
		await fs.promises.writeFile(fileName, content, 'utf-8');
	} catch (error) {
		throw error;
	}
}

export const validateFileAndCreate = async (dir, content) => {
	try {
        // Usar fs.promises.access para comprobar si el archivo existe de forma asíncrona
        await fs.promises.access(dir, fs.constants.F_OK);
        return false; // El archivo ya existe, no hace falta crear nada
    } catch (error) {
        // Si no existe, crea el archivo
        await makeFile(dir, content);
        return true; // El archivo ha sido creado
    }
}

export const cloneFile = async (sourceFileName, destinationPath) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	// Ruta al archivo de origen dentro del directorio de la CLI
	const sourcePath = path.join(__dirname, `../assets/${sourceFileName}`);

	try {
		// Verifica si la ruta de destino existe
		const dirpath = path.dirname(destinationPath);
		await validateDirectory(dirpath);
		// Copiar archivo al destino
		await fs.promises.copyFile(sourcePath, destinationPath);

		return true;
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(chalk.red(language.__("operations.error.1")), sourceFileName);
		} else if (error.code === 'EACCES') {
			console.error(chalk.red(language.__("operations.error.2")), destinationPath);
		} else {
			console.error(chalk.red(language.__("operations.error.3")), error);
		}
		return false;
	}
};

export const updateIndexFile = async (componentType, componentName, componentPath) => {
	const filePath = path.join(process.cwd(), 'scripts/index.js');

	const validation = await validateFileAsync('scripts/index.js');
	if (!validation) {
		await cloneFile('js/index.js', 'scripts/index.js')

		console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(language.__("operations.make.index.1")), chalk.yellow(language.__("operations.make.index.2")), chalk.whiteBright(language.__("operations.make.index.3"))))
	}
	try {
		const fileContent = await fs.promises.readFile(filePath, 'utf-8');

		// El componente que deseas insertar
		const componentImport = `import { ${toCamelCase(componentName.split(':')[1])}Component } from '${componentPath}Component';\n`;
		const componentRegister = `initEvent.${componentType}ComponentRegistry.registerCustomComponent('${componentName.toLowerCase()}', ${toCamelCase(componentName.split(':')[1])}Component);\n`;

		// Verificar si el componente ya está registrado para evitar duplicados
		if (fileContent.includes(componentRegister)) return console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`${language.__("operations.has.component.1")} ${componentName} ${language.__("operations.has.component.2")}`)));


		// Insertar el import del componente
		let updatedContent = fileContent.replace(
			new RegExp(`// aquí se agregan los imports de componentes ${componentType}`),
			`${componentImport}// aquí se agregan los imports de componentes ${componentType}`
		);

		// Insertar la declaración en el registro de componentes
		updatedContent = updatedContent.replace(
			new RegExp(`// aquí se agregan los registros de componentes ${componentType}`),
			`${componentRegister}    // aquí se agregan los registros de componentes ${componentType}`
		);

		// Escribir el archivo actualizado
		await fs.promises.writeFile(filePath, updatedContent, 'utf-8');

		console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`${language.__("operations.make.component.1")} ${componentName} ${language.__("operations.make.component.2")}`)));
	} catch (error) {
		console.error(language.__("operations.error.4"), error);
		console.error("2", error);
	}
};

/**
 * 
 * @param {{}} file 
 * @returns 
 */
export const getJsonFile = async (file) => {
	const filePath = path.join(process.cwd(), file);

	const validation = await validateFileAsync(file);
	if (!validation) return console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("operations.notfound.1")), chalk.yellow(path.basename(filePath)), chalk.whiteBright(language.__("operations.notfound.2"))))
	try {
		const fileContent = await fs.promises.readFile(filePath, 'utf-8');

		return JSON.parse(fileContent);
	} catch (error) {
		console.error(language.__("operations.error.5"), error);
	}
};

/**
 * 
 * @param {{}} file 
 * @returns
 */
export const getJsonFileOrBool = async (file) => {
	const filePath = path.join(process.cwd(), file);

	const validation = await validateFileAsync(file);
	if (!validation) {
		console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(language.__("operations.notfound.1")), chalk.yellow(path.basename(filePath)), chalk.whiteBright(language.__("operations.notfound.2"))))
		return false;
	}
	try {
		const fileContent = await fs.promises.readFile(filePath, 'utf-8');

		return JSON.parse(fileContent);
	} catch (error) {
		console.error(language.__("operations.error.5"), error);
	}
};

export const updateSettings = async (key, value) => {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		// Ruta al archivo de origen dentro del directorio de la CLI
		const sourcePath = path.join(__dirname, `../assets/settings.json`);

		settings[key] = value;

		await makeFile(sourcePath, JSON.stringify(settings, null, 2));
	} catch (error) {
		console.error(language.__("operations.error.6"), error);
	}
}