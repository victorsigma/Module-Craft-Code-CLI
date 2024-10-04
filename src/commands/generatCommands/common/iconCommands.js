import { cloneFile, validateFile } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { ONLY_BEHAVIOR, ONLY_RESOURCE } from "../../../utils/constants.js";
import { Command } from "commander";
import chalk from "chalk";

const icon = new Command('icon')
    .description('Establece un icono generica para tu proyecto')

icon.option('-r, --random <boolean>', 'Habilita la selección aleatoria de íconos', false)


icon.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright('No puedes agregar un icono en un proyecto sin el archivo'),
        chalk.bold(chalk.green('addon.properties'))
    );

    const behavior = await ONLY_BEHAVIOR()
    const resource = await ONLY_RESOURCE()
    if (!behavior && !resource) return console.log(
        chalk.yellowBright('No puedes agregar un icono en un proyecto que no sea behavior o resource')
    );

    const iconsList = [
        'pack_icon_1',
        'pack_icon_2',
        'pack_icon_3',
        'pack_icon_4',
    ];

    const iconsNames = {
        'pack_icon_1': 'Sword ⚔️',
        'pack_icon_2': 'Pickaxe ⛏️',
        'pack_icon_3': 'Axe 🪓',
        'pack_icon_4': 'Shovel 🥄',
    };

    if(validateFile('pack_icon.png')) return console.log(chalk.bold(chalk.yellowBright('El archivo icon_pack.png ya existe')));

    if (options.random) {
        // Selecciona un ícono aleatorio
        options.icon = iconsList[Math.floor(Math.random() * iconsList.length)];
        console.log(chalk.green('✔ Ícono aleatorio seleccionado'));
    } else {
        console.log(
            chalk.yellowBright('La libreria no fue seleciona o no es valida')
        );
        const questions = [
            {
                type: 'list',
                name: 'selection',
                message: 'Selecciona un ícono para tu proyecto:',
                choices: [
                    { value: "pack_icon_1", name: "Sword ⚔️" },
                    { value: "pack_icon_2", name: "Pickaxe ⛏️" },
                    { value: "pack_icon_3", name: "Axe 🪓" },
                    { value: "pack_icon_4", name: "Shovel 🥄" },
                ],
            },
        ];

        const response = await inquirer.prompt(questions);
        options.icon = response.selection;

        console.log(chalk.green('✔ Ícono seleccionado'));
    }

    console.log(chalk.yellow(`- ${iconsNames[options.icon]}`));


    const create = cloneFile(`img/${options.icon}.png`, 'pack_icon.png');

    if(create) {
        console.log(chalk.green('✔'), chalk.bold(chalk.whiteBright(`El ícono ${iconsNames[options.icon]} ha sido establecido correctamente para tu proyecto.`)));
    } else {
        console.log(chalk.red('✖'), chalk.bold(chalk.whiteBright(`El ícono ${iconsNames[options.icon]} no fue establecido correctamente para tu proyecto.`)));
    }
})

export default icon;