import { toCamelCase, toSnackCase, uppercaseFirstLetter } from '../../../utils/stringManager.js';
import { clearEvents, makeComponentFile, makeEventFile, updateIndexFile } from '../../../utils/fileOperations.js';
import { ONLY_BEHAVIOR, PATH_ITEM_COMPONENTS, PATH_ITEM_EVENTS } from '../../../utils/constants.js';
import { propertiesAsync } from '../../../utils/readProperties.js';
import { selectFromArray } from '../../../utils/forms.js';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const itemsComponent = new Command('item')
    .description('Crea un componente personalizado de item nuevo');
itemsComponent.option('-n, --name <string>', 'Especifica el nombre del componente del ítem', 'namespace:item_component');
itemsComponent.option('-d, --description <string>', 'Especifica la descripción del componente del ítem', 'description');


itemsComponent.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright('No puedes generar un componente en un proyecto sin el archivo'),
        chalk.bold(chalk.green('addon.properties'))
    );

    const behavior = await ONLY_BEHAVIOR()
    if (!behavior) return console.log(
        chalk.yellowBright('No puedes generar un componente en un proyecto que no sea behavior')
    );

    // Asegurar que el nombre tenga un namespace
    options.name = toSnackCase(options.name);
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
            if(Array.isArray(config['addon.namespace'])){
                console.log(chalk.yellow(`Se encontraron multiples namespace`));
                const namespace = await selectFromArray(config['addon.namespace']);
                options.name = `${namespace}:${options.name}`;
            } else {
                options.name = `${config['addon.namespace']}:${options.name}`;
            }
        }
    }

    if (options.name === 'namespace:item_component') {
        if(Array.isArray(config['addon.namespace'])){
            console.log(chalk.yellow(`Se encontraron multiples namespace`));
            const namespace = await selectFromArray(config['addon.namespace']);
            options.name = namespace
            ? `${namespace}:item_component`
            : 'namespace:item_component';
        } else {
            options.name = config['addon.namespace']
            ? `${config['addon.namespace']}:item_component`
            : 'namespace:item_component';
        }
        
    }

    const questions = [
        {
            type: 'checkbox',
            name: 'selections',
            message: 'Selecciona los eventos:',
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
    if (!response.selections.length) return console.log(chalk.red('Debes seleccionar al menos un evento.'));

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
 * Descripción: ${options.description}${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
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

        updateIndexFile('item', options.name, `./components/items/${toCamelCase(options.name.split(':')[1])}`);
        spinner.succeed(chalk.bold(chalk.whiteBright(`El componente ${options.name} ha sido creado exitosamente!`)));
    } catch (error) {
        spinner.fail(chalk.red('Error al crear el componente.'));
        console.error(error);
    }
});



export default itemsComponent;