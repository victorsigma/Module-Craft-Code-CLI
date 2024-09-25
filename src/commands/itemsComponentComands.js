import { toCamelCase, uppercaseFirstLetter } from '../utils/stringManager.js';
import { clearEvents, makeComponentFile, makeEventFile } from '../utils/fileOperations.js';
import { ONLY_BEHAVIOR, PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from '../utils/constants.js';
import { propertiesAsync } from '../utils/readProperties.js';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const itemsComponent = new Command('item')
	.description('Crea un componente personalizado de item nuevo');
itemsComponent.option('-n, --name <string>', 'especifica el nombre del componente', 'namespace:item_component', (value) => {
	if (value.includes(':')) return value;
	throw new Error('El nombre del componente debe incluir ":" para separar namespace');
})
itemsComponent.option('-d, --description <string>', 'especifica la descripción del componente', 'description')

itemsComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) {
        return console.log(
            chalk.yellowBright('No puedes generar un componente en un proyecto sin el archivo'), 
            chalk.bold(chalk.green('addon.properties'))
        );
    }
    const behavior = await ONLY_BEHAVIOR()
    if(!behavior) {
        return console.log(
            chalk.yellowBright('No puedes generar un componente en un proyecto que no sea behavior')
        );
    }

    // Asegurar que el nombre tenga un namespace
    while (!options.name.includes(':')) {
        if (!config['addon.namespace']) {
            console.error(
                chalk.red('El nombre del componente debe incluir ":" para separar namespace'),
                chalk.green('\nNombre actual:'), 
                chalk.white(options.name)
            );

            const input = [
                { type: 'input', name: 'name', message: 'Escribe otro nombre:' }
            ];

            const response = await inquirer.prompt(input);
            options.name = response.name;
        } else {
            options.name = `${config['addon.namespace']}:${options.name}`;
        }
    }

    if (options.name === 'namespace:item_component') {
        options.name = config['addon.namespace'] 
            ? `${config['addon.namespace']}:item_component` 
            : 'namespace:item_component';
    }

    const questions = [
        {
            type: 'checkbox',
            name: 'selections',
            message: 'Selecciona tus eventos:',
            choices: [
                { name: 'onBeforeDurabilityDamage', value: 'onBeforeDurabilityDamage' },
                { name: 'onCompleteUse', value: 'onCompleteUse' },
                { name: 'onConsume', value: 'onConsume' },
                { name: 'onHitEntity', value: 'onHitEntity' },
                { name: 'onMineBlock', value: 'onMineBlock' },
                { name: 'onUse', value: 'onUse' },
                { name: 'onUseOn', value: 'onUseOn' },
            ],
        },
    ];

    const response = await inquirer.prompt(questions);

    // Validar si el usuario no selecciona ningún evento
    if (response.selections.length === 0) {
        return console.log(chalk.red('Debes seleccionar al menos un evento.'));
    }

    response.selections.forEach(evento => {
        console.log(chalk.yellow(`- ${evento}`));
    });

    const imports = response.selections.map(event => {
        return `import { ${toCamelCase(options.name.split(':')[1])}${uppercaseFirstLetter(event)}Event } from "../../events/items/${toCamelCase(options.name.split(':')[1])}/${event}Event";`;
    }).join('\n');

    const events = response.selections.map(event => {
        return `${event}: ${toCamelCase(options.name.split(':')[1])}${uppercaseFirstLetter(event)}Event`;
    }).join(',\n\t');

    const content = `${imports}

/**
 * Componente: ${options.name}
 * Descripción: ${options.description}${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 */

export const ${toCamelCase(options.name.split(':')[1])}Component = {
    ${events}
}`;

    const spinner = ora('Creando componente...').start();

    try {
        await makeComponentFile(options.name, PATH_ITEM_COMPONENTS, content);
        await clearEvents(`${PATH_ITEM_EVENTS}/${toCamelCase(options.name.split(':')[1])}`);
        for (let i = 0; i < response.selections.length; i++) {
            await makeEventFile(options.name, response.selections[i], PATH_ITEM_EVENTS);
        }

        spinner.succeed(chalk.bold(chalk.whiteBright(`El componente ${options.name} ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear el componente.'));
        console.error(error);
    }
});



export default itemsComponent;