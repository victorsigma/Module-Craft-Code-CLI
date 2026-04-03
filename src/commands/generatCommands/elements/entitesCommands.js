import { BEHAVIOR_ENTITY, ONLY_BEHAVIOR, ONLY_RESOURCE, RESOURCE_ENTITY } from "../../../utils/constants.js";
import { makeSubFile, validateFileAsync } from "../../../utils/fileOperations.js";
import { propertiesAsync } from "../../../utils/readProperties.js";
import { resolveElementName } from "../../../core/nameResolver.js";
import { generateFile } from "../../../core/generateFile.js";
import { resolvePath } from "../../../core/resolvePath.js";
import { language } from "../../../utils/i18n.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const entity = new Command('entity').alias('e')
    .description(language.__("element.entity.description"))

entity.option('-n, --name <string>', language.__("element.entity.option.n"), 'namespace:entity');
entity.option('-r, --runtime <string>', language.__("element.entity.option.r"));
entity.option('-e, --experimental <boolean>', language.__("element.entity.option.e"), false);
entity.option('-sp, --spawnable <boolean>', language.__("element.entity.option.sp"), false);
entity.option('-su, --summonable <boolean>', language.__("element.entity.option.su"), false);

entity.action(async (options) => {
    const config = await propertiesAsync();
    if (!config) return console.log(
        chalk.yellowBright(language.__("element.entity.exits.1")),
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
})

const behaviorPack = async (options) => {
    const entity = {...BEHAVIOR_ENTITY};

    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "entity");

    const fileName = `${options.name.split(':')[1]}.json`;
    const namespace = options.name.split(':')[0];

    
    entity.format_version = "1.20.80";
    entity["minecraft:entity"].description.identifier = options.name;

    if(options.runtime) {
        entity["minecraft:entity"].description.runtime_identifier = options.runtime;
    }

    entity["minecraft:entity"].description.is_experimental = JSON.parse(options.experimental) ? true : false;
    entity["minecraft:entity"].description.is_spawnable = JSON.parse(options.spawnable) ? true : false;
    entity["minecraft:entity"].description.is_summonable = JSON.parse(options.summonable) ? true : false;

    await generateFile({
        fileName,
        path: resolvePath("entities", namespace, options.config),
        content: entity,
        lang: {
            start: "element.entity.spinner.start",
            success: "element.entity.spinner.succeed",
            error: "element.entity.spinner.error",
            exists: "element.entity.exits.2"
        },
        interpolate: {
            "options.name": options.name
        }
    })
}

const resourcePack = async (options) => {
    const entity = {...RESOURCE_ENTITY};

    // Asegurar que el nombre tenga un namespace
    options.name = await resolveElementName(options.name, options.config, "entity");

    const fileName = `${options.name.split(':')[1]}.entity.json`
    const namespace = options.name.split(':')[0]

    entity.format_version = "1.10.0";
    entity["minecraft:client_entity"].description.identifier = options.name;

    await generateFile({
        fileName,
        path: resolvePath("entity", namespace, options.config),
        content: entity,
        lang: {
            start: "element.entity.spinner.start",
            success: "element.entity.spinner.succeed",
            error: "element.entity.spinner.error",
            exists: "element.entity.exits.2"
        },
        interpolate: {
            "options.name": options.name
        }
    })
}

export default entity;