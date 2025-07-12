/**
 * constants.js
 *
 * Este archivo define constantes y funciones utilizadas en un proyecto para la gestión de componentes, eventos y configuraciones en entornos relacionados con Minecraft. También incluye plantillas para eventos personalizados.
 */

import { myRequire } from "./exports.js";
import { propertiesAsync } from "./readProperties.js";
import { toCamelCase } from "./stringManager.js";

// Obtiene la versión del paquete desde package.json
const { version } = myRequire('../../package.json');

/** Versión del módulo */
export const VERSION = version;

/** Rutas para componentes y texturas de ítems y bloques */
export const PATH_ITEM_COMPONENTS = 'scripts/components/items';
export const PATH_ITEM_TEXTURES = 'textures/items';

export const PATH_BLOCK_COMPONENTS = 'scripts/components/blocks';
export const PATH_BLOCK_TEXTURES = 'textures/blocks';

export const PATH_ITEM_EVENTS = 'scripts/events/items';
export const PATH_BLOCK_EVENTS = 'scripts/events/blocks';

/**
 * Verifica si el tipo de complemento es solo de comportamiento
 * @returns {Promise<boolean>} - Verdadero si el tipo es "behavior"
 */
export const ONLY_BEHAVIOR = async () => {
    const config = await propertiesAsync();
    return config['addon.type'] == 'behavior';
}

/**
 * Estructura básica para una entidad de comportamiento
 */
export const BEHAVIOR_ENTITY = {
    "format_version": "",
    "minecraft:entity": {
        "description": {
            "identifier": "namespace:entity",
            "is_spawnable": false,
            "is_summonable": false,
            "is_experimental": false
        },
        "component_groups": {},
        "components": {},
        "events": {}
    }
}

/**
 * Verifica si el tipo de complemento es solo de recursos
 * @returns {Promise<boolean>} - Verdadero si el tipo es "resource"
 */
export const ONLY_RESOURCE = async () => {
    const config = await propertiesAsync();
    return config['addon.type'] == 'resource';
}

/**
 * Estructura básica para una entidad de recurso
 */
export const RESOURCE_ENTITY = {
    "format_version": "",
    "minecraft:client_entity": {
        "description": {
            "identifier": "namespace:entity",
            "materials": {
                "default": "cow"
            },
            "textures": {
                "default": "textures/entity/cow/cow"
            },
            "geometry": {
                "default": "geometry.cow"
            },
            "animations": {},
            "scripts": {
                "animate": [],
                "pre_animation": []
            },
            "render_controllers": ["controller.render.cow"],
            "spawn_egg": {
                "texture": "spawn_egg",
                "texture_index": 1
            }
        }
    }
}


/**
 * Verifica si el tipo de complemento es solo de skins
 * @returns {Promise<boolean>} - Verdadero si el tipo es "skin"
 */
export const ONLY_SKIN = async () => {
    const config = await propertiesAsync();
    return config['addon.type'] == 'skin';
}

/**
 * Plantillas para eventos personalizados en componentes
 */
export const EVENT_TEMPLATES = {
    'onBeforeDurabilityDamage': (name) => onBeforeDurabilityDamage(name),
    'onCompleteUse': (name) => onCompleteUse(name),
    'onConsume': (name) => onConsume(name),
    'onHitEntity': (name) => onHitEntity(name),
    'onMineBlock': (name) => onMineBlock(name),
    'onUse': (name) => onUse(name),
    'onUseOn': (name) => onUseOn(name),
    'beforeOnPlayerPlace': (name) => beforeOnPlayerPlace(name),
    'onEntityFallOn': (name) => onEntityFallOn(name),
    'onPlace': (name) => onPlace(name),
    'onPlayerDestroy': (name) => onPlayerDestroy(name),
    'onPlayerInteract': (name) => onPlayerInteract(name),
    'onRandomTick': (name) => onRandomTick(name),
    'onStepOff': (name) => onStepOff(name),
    'onStepOn': (name) => onStepOn(name),
    'onTick': (name) => onTick(name),
}

/** Versión de módulos utilizados */
export const MODULE_VERSION = {
    '@minecraft/common': '1.2.0',
    '@minecraft/debug-utilities': '1.0.0-beta',
    '@minecraft/server-admin': '1.0.0-beta',
    '@minecraft/server-gametest': '1.0.0-beta',
    '@minecraft/server-net': '1.0.0-beta',
    '@minecraft/server-ui': '1.3.0',
    '@minecraft/server': '1.19.0',
    '@minecraft/server-editor': '0.1.0-beta',
}

/** Librerías */
export const LIBS = [
    "bedrockSystem",
    "blockManager",
    "itemManager",
]

/** Idiomas soportados */
export const LANGS = [
    "da_DK",
    "de_DE",
    "en_GB",
    "en_US",
    "es_ES",
    "es_MX",
    "fr_CA",
    "fr_FR",
    "it_IT",
    "hu_HU",
    "nl_NL",
    "nb_NO",
    "pl_PL",
    "pt_BR",
    "pt_PT",
    "sk_SK",
    "fi_FI",
    "sv_SE",
    "tr_TR",
    "cs_CZ",
    "el_GR",
    "bg_BG",
    "ru_RU",
    "uk_UA",
    "ja_JP",
    "zh_CN",
    "zh_TW",
    "ko_KR",
]

/** Categorías de ítems */
export const CATEGORYS = ["construction", "nature", "equipment", "items"]

/** Nombres de grupos de ítems */
export const ITEM_GROUP_NAMES = {
    "construction": [
        "itemGroup.name.brick",
        "itemGroup.name.climbing",
        "itemGroup.name.cobblestone",
        "itemGroup.name.constructionMisc",
        "itemGroup.name.copper",
        "itemGroup.name.concrete",
        "itemGroup.name.concretePowder",
        "itemGroup.name.door",
        "itemGroup.name.glassPane",
        "itemGroup.name.glass",
        "itemGroup.name.glazedTerracotta",
        "itemGroup.name.ironFence",
        "itemGroup.name.purpur",
        "itemGroup.name.sandstone",
        "itemGroup.name.stairs",
        "itemGroup.name.stainedClay",
        "itemGroup.name.stoneBrick",
        "itemGroup.name.slab",
        "itemGroup.name.trapdoor",
        "itemGroup.name.walls",
        "itemGroup.name.wool",
        "itemGroup.name.woolCarpet"
    ],
    "nature": [
        "itemGroup.name.clay",
        "itemGroup.name.cactus",
        "itemGroup.name.coral",
        "itemGroup.name.coral_decorations",
        "itemGroup.name.crop",
        "itemGroup.name.dirt",
        "itemGroup.name.dye",
        "itemGroup.name.eggBlocks",
        "itemGroup.name.grass",
        "itemGroup.name.gravel",
        "itemGroup.name.greenery",
        "itemGroup.name.ice",
        "itemGroup.name.leaves",
        "itemGroup.name.log",
        "itemGroup.name.miscFood",
        "itemGroup.name.mobEgg",
        "itemGroup.name.monsterStoneEgg",
        "itemGroup.name.mushroom",
        "itemGroup.name.natureBuildingBlocks",
        "itemGroup.name.natureMisc",
        "itemGroup.name.oreBlocks",
        "itemGroup.name.pumpkins",
        "itemGroup.name.rawFood",
        "itemGroup.name.sand",
        "itemGroup.name.sapling",
        "itemGroup.name.sculk",
        "itemGroup.name.seed",
        "itemGroup.name.skull",
        "itemGroup.name.stone",
        "itemGroup.name.wood"
    ],
    "equipment": [
        "itemGroup.name.arrow",
        "itemGroup.name.axe",
        "itemGroup.name.boots",
        "itemGroup.name.cookedFood",
        "itemGroup.name.helmet",
        "itemGroup.name.hoe",
        "itemGroup.name.horseArmor",
        "itemGroup.name.leggings",
        "itemGroup.name.pickaxe",
        "itemGroup.name.potion",
        "itemGroup.name.shovel",
        "itemGroup.name.sword",
        "itemGroup.name.splashPotion",
    ],
    "items": [
        "itemGroup.name.anvil",
        "itemGroup.name.banner",
        "itemGroup.name.banner_pattern",
        "itemGroup.name.beacon",
        "itemGroup.name.bed",
        "itemGroup.name.bell",
        "itemGroup.name.boat",
        "itemGroup.name.buttons",
        "itemGroup.name.camera",
        "itemGroup.name.candles",
        "itemGroup.name.chemistrytable",
        "itemGroup.name.chest",
        "itemGroup.name.chestboat",
        "itemGroup.name.chestplate",
        "itemGroup.name.chiseledBookshelf",
        "itemGroup.name.composter",
        "itemGroup.name.compounds",
        "itemGroup.name.craftingTables",
        "itemGroup.name.element",
        "itemGroup.name.enchantedBook",
        "itemGroup.name.enchantingTable",
        "itemGroup.name.endPortalFrame",
        "itemGroup.name.endRod",
        "itemGroup.name.fence",
        "itemGroup.name.fenceGate",
        "itemGroup.name.fireworkStars",
        "itemGroup.name.firework",
        "itemGroup.name.flower",
        "itemGroup.name.furnaces",
        "itemGroup.name.grindStone",
        "itemGroup.name.goatHorn",
        "itemGroup.name.glowstone",
        "itemGroup.name.hanging_sign",
        "itemGroup.name.lectern",
        "itemGroup.name.lights",
        "itemGroup.name.lingeringPotion",
        "itemGroup.name.minecart",
        "itemGroup.name.musicBlocks",
        "itemGroup.name.ore",
        "itemGroup.name.permission",
        "itemGroup.name.pistons",
        "itemGroup.name.potterySherds",
        "itemGroup.name.pressurePlate",
        "itemGroup.name.products",
        "itemGroup.name.rail",
        "itemGroup.name.record",
        "itemGroup.name.redstone",
        "itemGroup.name.redstoneContainers",
        "itemGroup.name.redstoneProducers",
        "itemGroup.name.shulkerBox",
        "itemGroup.name.sign",
        "itemGroup.name.smithing_templates",
        "itemGroup.name.tnt",
        "itemGroup.name.torch",
    ]
};

/** Materiales de bloques */
export const BLOCK_MATERIALS = [
    "opaque", "double_sided", "blend", "alpha_test"
]

/** Ejemplos de plantillas para el eventos */
const onBeforeDurabilityDamage = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Entity, ItemStack } from "@minecraft/server";

/**
 * Evento onBeforeDurabilityDamage del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{attackingEntity: Entity, durabilityDamage: number, hitEntity: Entity, itemStack: ItemStack}} event 
 */
export const ${toCamelCase(componentName)}OnBeforeDurabilityDamageEvent = ({attackingEntity, durabilityDamage, hitEntity, itemStack}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onCompleteUse = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Player, ItemStack } from "@minecraft/server";

/**
 * Evento onCompleteUse del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player}} event 
 */
export const ${toCamelCase(componentName)}OnCompleteUseEvent = ({itemStack, source}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onConsume = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Player, ItemStack } from "@minecraft/server";

/**
 * Evento onConsume del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player}} event 
 */
export const ${toCamelCase(componentName)}OnConsumeEvent = ({itemStack, source}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onHitEntity = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Entity, ItemStack } from "@minecraft/server";

/**
 * Evento onHitEntity del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{attackingEntity: Entity, hadEffect: boolean, hitEntity: Entity, itemStack: ItemStack}} event 
 */
export const ${toCamelCase(componentName)}OnHitEntityEvent = ({attackingEntity, hadEffect, hitEntity, itemStack}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onMineBlock = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, BlockPermutation, ItemStack, Player } from "@minecraft/server";

/**
 * Evento onMineBlock del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player, block: Block, minedBlockPermutation: BlockPermutation}} event 
 */
export const ${toCamelCase(componentName)}OnMineBlockEvent = ({itemStack, source, block, minedBlockPermutation}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onUse = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { ItemStack, Player } from "@minecraft/server";

/**
 * Evento onUse del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player}} event 
 */
export const ${toCamelCase(componentName)}OnUseEvent = ({itemStack, source}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onUseOn = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, BlockPermutation, ItemStack, Player } from "@minecraft/server";

/**
 * Evento onUseOn del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{blockFace: string, source: Player, usedOnBlockPermutation: BlockPermutation, itemStack: ItemStack, 
 * faceLocation: {x: number, y: number, z: number}, block: Block}} event 
 */
export const ${toCamelCase(componentName)}OnUseOnEvent = ({blockFace, source, usedOnBlockPermutation, itemStack, faceLocation, block}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};


const beforeOnPlayerPlace = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, BlockPermutation, Dimension, Player } from "@minecraft/server";

/**
 * Evento beforeOnPlayerPlace del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{player: Player, face: string, permutationToPlace: BlockPermutation, cancel: boolean, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}BeforeOnPlayerPlaceEvent = ({player, face, permutationToPlace, cancel, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onEntityFallOn = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onEntityFallOn del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{entity: Entity, face: string, fallDistance: number, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnEntityFallOnEvent = ({entity, face, fallDistance, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onPlace = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, BlockPermutation } from "@minecraft/server";

/**
 * Evento onPlace del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{previousBlock: BlockPermutation, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnPlaceEvent = ({previousBlock, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onPlayerDestroy = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, BlockPermutation, Player } from "@minecraft/server";

/**
 * Evento onPlayerDestroy del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{destroyedBlockPermutation: BlockPermutation, player: Player, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnPlayerDestroyEvent = ({destroyedBlockPermutation, player, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onPlayerInteract = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, Direction, Player } from "@minecraft/server";

/**
 * Evento onPlayerInteract del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{face: Direction, faceLocation: Vector3, player: Player, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnPlayerInteractEvent = ({face, faceLocation, player, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onRandomTick = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension } from "@minecraft/server";

/**
 * Evento onRandomTick del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnRandomTickEvent = ({block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onStepOff = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onStepOff del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{entity: Entity, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnStepOffEvent = ({entity, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onStepOn = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onStepOn del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{entity: Entity, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnStepOnEvent = ({entity, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onTick = async (name) => {
    const config = await propertiesAsync();
    const [, componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onTick del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${Array.isArray(config['addon.name']) ? config['addon.name'][0] : config['addon.name']}` : ''}
 * @param {{entity: Entity, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnTickEvent = ({entity, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};