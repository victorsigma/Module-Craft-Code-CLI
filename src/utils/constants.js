import { propertiesAsync } from "./readProperties.js";
import { toCamelCase } from "./stringManager.js";

export const PATH_ITEM_COMPONENTS = 'scripts/components/items';
export const PATH_BLOCK_COMPONENTS = 'scripts/components/blocks';

export const PATH_ITEM_EVENTS = 'scripts/events/items';
export const PATH_BLOCK_EVENTS = 'scripts/events/blocks';

export const ONLY_BEHAVIOR = async () => {
    const config = await propertiesAsync();
    return config['addon.type'] == 'behavior';
}


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

const onBeforeDurabilityDamage = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Entity, ItemStack } from "@minecraft/server";

/**
 * Evento onBeforeDurabilityDamage del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{attackingEntity: Entity, durabilityDamage: number, hitEntity: Entity, itemStack: ItemStack}} event 
 */
export const ${toCamelCase(componentName)}OnBeforeDurabilityDamageEvent = ({attackingEntity, durabilityDamage, hitEntity, itemStack}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onCompleteUse = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Player, ItemStack } from "@minecraft/server";

/**
 * Evento onCompleteUse del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player}} event 
 */
export const ${toCamelCase(componentName)}OnCompleteUseEvent = ({itemStack, source}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onConsume = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Player, ItemStack } from "@minecraft/server";

/**
 * Evento onConsume del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player}} event 
 */
export const ${toCamelCase(componentName)}OnConsumeEvent = ({itemStack, source}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onHitEntity = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Entity, ItemStack } from "@minecraft/server";

/**
 * Evento onHitEntity del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{attackingEntity: Entity, hadEffect: boolean, hitEntity: Entity, itemStack: ItemStack}} event 
 */
export const ${toCamelCase(componentName)}OnHitEntityEvent = ({attackingEntity, hadEffect, hitEntity, itemStack}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onMineBlock = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, BlockPermutation, ItemStack, Player } from "@minecraft/server";

/**
 * Evento onMineBlock del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player, block: Block, minedBlockPermutation: BlockPermutation}} event 
 */
export const ${toCamelCase(componentName)}OnMineBlockEvent = ({itemStack, source, block, minedBlockPermutation}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onUse = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { ItemStack, Player } from "@minecraft/server";

/**
 * Evento onUse del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{itemStack: ItemStack, source: Player}} event 
 */
export const ${toCamelCase(componentName)}OnUseEvent = ({itemStack, source}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onUseOn = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, BlockPermutation, ItemStack, Player } from "@minecraft/server";

/**
 * Evento onUseOn del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{blockFace: string, source: Player, usedOnBlockPermutation: BlockPermutation, itemStack: ItemStack, 
 * faceLocation: {x: number, y: number, z: number}, block: Block}} event 
 */
export const ${toCamelCase(componentName)}OnUseOnEvent = ({blockFace, source, usedOnBlockPermutation, itemStack, faceLocation, block}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};


const beforeOnPlayerPlace = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, BlockPermutation, Dimension, Player } from "@minecraft/server";

/**
 * Evento beforeOnPlayerPlace del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{player: Player, face: string, permutationToPlace: BlockPermutation, cancel: boolean, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}BeforeOnPlayerPlaceEvent = ({player, face, permutationToPlace, cancel, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onEntityFallOn = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onEntityFallOn del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{entity: Entity, face: string, fallDistance: number, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnEntityFallOnEvent = ({entity, face, fallDistance, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onPlace = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, BlockPermutation } from "@minecraft/server";

/**
 * Evento onPlace del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{previousBlock: BlockPermutation, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnPlaceEvent = ({previousBlock, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onPlayerDestroy = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, BlockPermutation, Player } from "@minecraft/server";

/**
 * Evento onPlayerDestroy del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{destroyedBlockPermutation: BlockPermutation, player: Player, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnPlayerDestroyEvent = ({destroyedBlockPermutation, player, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onPlayerInteract = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, Direction, Vector3, Player } from "@minecraft/server";

/**
 * Evento onPlayerInteract del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{face: Direction, faceLocation: Vector3, player: Player, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnPlayerInteractEvent = ({face, faceLocation, player, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onRandomTick = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension } from "@minecraft/server";

/**
 * Evento onRandomTick del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnRandomTickEvent = ( block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onStepOff = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onStepOff del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{entity: Entity, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnStepOffEvent = ({entity, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onStepOn = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onStepOn del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{entity: Entity, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnStepOnEvent = ({entity, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};

const onTick = async (name) => {
	const config = await propertiesAsync();
    const [,componentName] = name.split(':');
    return `import { Block, Dimension, Entity } from "@minecraft/server";

/**
 * Evento onTick del componente ${toCamelCase(componentName)}Component${config['addon.name'] ? `\n * Addon: ${config['addon.name']}` : ''}
 * @param {{entity: Entity, block: Block, dimension: Dimension}} event
 */
export const ${toCamelCase(componentName)}OnTickEvent = ({entity, block, dimension}) => {
    // Aquí puedes agregar la lógica para manejar el evento
}`};