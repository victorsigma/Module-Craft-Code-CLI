import { Command } from "commander";
import { v4 as uuidv4 } from 'uuid';
import { MODULE_VERSION, ONLY_BEHAVIOR, ONLY_RESOURCE, ONLY_SKIN, VERSION } from "../../../utils/constants.js";
import { makeFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";

const manifest = new Command('manifest')
    .description('Genera un archivo manifest para behavior | resource | skin')

manifest.option('-l, --link <string>', 'Vincula un resource_pack con un behavior_pack');
manifest.option('-s, --scripts <boolean>', 'Habilita los scripts en un behavior_pack');
manifest.option('-c, --capabilities <boolean>', 'Habilita las capacidades en un resource_pack');


manifest.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright('No puedes generar un archivo manifest en un proyecto sin el archivo'),
        chalk.bold(chalk.green('addon.properties'))
    );

    options.config = config;

    const behavior = await ONLY_BEHAVIOR()
    if (behavior) {
        await behaviorPack(options);
    }

    const resource = await ONLY_RESOURCE()
    if (resource) {
        await resourcePack(options);
    }

    const skin = await ONLY_SKIN()
    if (skin) {
        await skinPack(options);
    }
})



const behaviorPack = async (options) => {
    if (validateFile(`manifest.json`)) return console.log(chalk.bold(chalk.yellowBright('El archivo manifest.json ya existe')));
    let scripts = '';
    let modules = '';
    options.modules = [];
    if (options.scripts) {
        let response
        do {
            const questions = [
                {
                    type: 'checkbox',
                    name: 'selections',
                    message: 'Selecciona los modulos:',
                    choices: [
                        { name: 'minecraft/common', value: '@minecraft/common' },
                        { name: 'minecraft/debug-utilities', value: '@minecraft/debug-utilities' },
                        { name: 'minecraft/server-admin', value: '@minecraft/server-admin' },
                        { name: 'minecraft/server-gametest', value: '@minecraft/server-gametest' },
                        { name: 'minecraft/server-net', value: '@minecraft/server-net' },
                        { name: 'minecraft/server-ui', value: '@minecraft/server-ui' },
                        { name: 'minecraft/server', value: '@minecraft/server' },
                        { name: 'minecraft/server-editor', value: '@minecraft/server-editor' },
                    ],
                },
            ];

            response = await inquirer.prompt(questions);
            if (response.selections.length === 0) {
                console.log(chalk.red('Debes seleccionar al menos un modulo.'));
            }
        }
        while (response.selections.length === 0)


        options.modules = response.selections;

        for (let i = 0; i < options.modules.length; i++) {
            if (i === options.modules.length - 1) {
                modules =
                    `${modules}${options.modules.length > 1 ? '\n        ' : ''}{
            "module_name": "${options.modules[i]}",
            "version": "${MODULE_VERSION[options.modules[i]]}"
        }`
            } else if (i === 0) {
                modules =
                    `{
            "module_name": "${options.modules[i]}",
            "version": "${MODULE_VERSION[options.modules[i]]}"
        },`
            } else {
                modules =
                    `${modules}
        {
            "module_name": "${options.modules[i]}",
            "version": "${MODULE_VERSION[options.modules[i]]}"
        },`
            }
        }

        scripts =
            `,
        {
            "type": "script",
            "language": "javascript",
            "uuid": "${uuidv4()}",
            "entry": "scripts/index.js",
            "version": [1, 0, 0]
        }`
    }
    let link = '';
    if (options.link) link =
        `{
			"uuid": "${options.link}",
			"version": [1, 0, 0]
		}`


    const content =
        `{
	"format_version": 2,
	"header": {
		"uuid": "${uuidv4()}",
		"name": "pack.name",
		"description": "pack.description",
		"version": [1, 0, 0],
		"min_engine_version": [1, 20, 40]
	},
	"modules": [
		{
			"uuid": "${uuidv4()}",
			"type": "data",
			"description": "pack.description",
			"version": [1, 0, 0]
		}${scripts}
	],
	"dependencies": [
		${link}${link != '' ? options.modules.length !== 0 ? ',\n        ' : '' : ''}${modules}
	],
	"metadata": {
		"generated_with": {
			"module_craft_code_cli": ["${VERSION}"]
		}
	}
}`;

    const spinner = ora('Creando manifiesto...').start();
    try {
        await makeFile(`manifest.json`, content);

        spinner.succeed(chalk.bold(chalk.whiteBright(`El manifiesto ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear el manifiesto.'));
        console.error(error);
    }
}

const resourcePack = async (options) => {
    if (validateFile(`manifest.json`)) return console.log(chalk.bold(chalk.yellowBright('El archivo manifest.json ya existe')));
    let capabilities = [];
    if (options.capabilities) {
        let response
        do {
            const questions = [
                {
                    type: 'checkbox',
                    name: 'selections',
                    message: 'Selecciona las capacidades:',
                    choices: [
                        { name: 'Physically Based Rendering', value: 'pbr' },
                        { name: 'Ray Tracing', value: 'raytraced' },
                        { name: 'Experimental Custom UI', value: 'experimental_custom_ui' },
                    ],
                },
            ];

            response = await inquirer.prompt(questions);
            if (!response.selections.length) {
                console.log(chalk.red('Debes seleccionar una capacidad.'));
            }
        }
        while (!response.selections.length)
        capabilities = response.selections;
    }
    const content =
        `{
	"format_version": 1,
	"header": {
		"name": "pack.name",
		"description": "pack.description",
		"uuid": "${uuidv4()}",
		"version": [1, 0, 0]
	},
	"modules": [
		{
			"description": "pack.description",
			"type": "resources",
			"uuid": "${uuidv4()}",
			"version": [1, 0, 0]
		}
	],
	"capabilities": ${options.capabilities ? JSON.stringify(capabilities) : '[]'},
	"metadata": {
		"generated_with": {
			"module_craft_code_cli": ["${VERSION}"]
		}
	}
}`
    const spinner = ora('Creando manifiesto...').start();
    try {
        await makeFile(`manifest.json`, content);

        spinner.succeed(chalk.bold(chalk.whiteBright(`El manifiesto ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear el manifiesto.'));
        console.error(error);
    }
}

const skinPack = async (options) => {

    if (validateFile(`manifest.json`)) return console.log(chalk.bold(chalk.yellowBright('El archivo manifest.json ya existe')));
    const content =
        `{
    "format_version": 1,
    "header": {
        "uuid": "${uuidv4()}",
        "name": "${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}",
        "version": [ 1, 0, 0 ]
    },
    "modules": [
        {
            "uuid": "${uuidv4()}",
            "type": "skin_pack",
            "version": [ 1, 0, 0 ]
        }
    ]
}`
    const spinner = ora('Creando manifiesto...').start();
    try {
        await makeFile(`manifest.json`, content);

        spinner.succeed(chalk.bold(chalk.whiteBright(`El manifiesto ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear el manifiesto.'));
        console.error(error);
    }
}

export default manifest;