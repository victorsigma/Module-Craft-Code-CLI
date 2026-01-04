import { ItemStack, Player } from "@minecraft/server";
import { getGamemode } from "./worldFuntions";

/**
 * Decrementa la cantidad de ítems en la pila del inventario
 * @param {ItemStack} item
 * @param {Player} player
 */
export const decrementItemStack = (item, player) => {
    const amount = item.amount - 1;

    const gamemode = getGamemode(player)

    if(gamemode === 'Survival' || gamemode === 'Adventure') {
        if (amount <= 0) {
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, null);
        } else {
            const decrementItem = new ItemStack(item.typeId, amount)
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, decrementItem);
        }
    }
};


/**
 * Aumenta la cantidad de daño del ítems selecionado
 * @param {ItemStack} item
 * @param {Player} player
 * @param {number} damage
 */
export const addDamageItem = (item, player, damage) => {
    const gamemode = getGamemode(player)
    if(gamemode === 'Survival' || gamemode === 'Adventure') {
        const currentDamage = item.getComponent('minecraft:durability').damage;
        const maxDurability = item.getComponent('minecraft:durability').maxDurability;
        const durability = maxDurability - currentDamage;
        if(durability >= damage) {
            const newDanage = currentDamage + damage;
            item.getComponent('minecraft:durability').damage = newDanage;
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, item);
        } else {
            
            player.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`)
        }
    }
};

/**
 * Aumenta la cantidad de daño del ítems selecionado
 * @param {ItemStack} item
 * @param {Player} player
 * @param {number} damage
 */
export const addDamageItemEnchant = (item, player, damage) => {
    const gamemode = getGamemode(player)
    if(gamemode === 'Survival' || gamemode === 'Adventure') {
        const currentDamage = item.getComponent('minecraft:durability').damage;
        const maxDurability = item.getComponent('minecraft:durability').maxDurability;
        const unbreakingLevel = item.getComponent("enchantable")?.getEnchantment("unbreaking")?.level

        const applyDamage = unbreakingApply(unbreakingLevel);

        const durability = maxDurability - currentDamage;
        if(durability >= damage && applyDamage) {
            const newDanage = currentDamage + damage;
            item.getComponent('minecraft:durability').damage = newDanage;
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, item);
        } else {
            player.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`)
        }
    }
};

/**
 * Aplica de manera correcta el encantamiento unbreaking
 * @param {number | undefined} level 
 * @returns 
 */
const unbreakingApply = (level) => {
    const rand = Math.floor(Math.random() * 10);
    
    // Definimos un objeto que mapea los niveles a las condiciones de applyDamage
    const applyDamageConditions = {
        1: rand > 2,
        2: rand > 4,
        3: rand > 5,
        // Por defecto, si level no está en el objeto, aplicamos true
        default: true,
    };

    // Retornamos el resultado de la condición correspondiente a level, o el default si no está definido
    return applyDamageConditions[level] || applyDamageConditions.default;
}


/**
 * Dispara la entidad selecionada y con una potencia seleccionable
 * @param {Player} player
 * @param {string} projectile
 * @param {number} power
 */
export const shootProjectileWithPower  = (player, projectile, power) => {
    const head = player.getHeadLocation();
    const viewVector = player.getViewDirection();
    const direction = { x: head.x + viewVector.x, y: head.y + viewVector.y, z: head.z + viewVector.z };
    const powerShoot = { x: viewVector.x * power, y: viewVector.y * power, z: viewVector.z * power };
    const shoot = player.dimension.spawnEntity(projectile, direction)
    const projectileComp = shoot.getComponent('minecraft:projectile');
    projectileComp.owner = player;
    projectileComp.shoot(powerShoot);
}


/**
 * Dispara la entidad selecionada y con una potencia seleccionable
 * @param {Player} player
 * @param {string} projectile
 * @param {number} power
 */
export const spawnEntityWithOwner  = (player, projectile) => {
    const head = player.getHeadLocation();
    const viewVector = player.getViewDirection();
    const direction = { x: head.x + viewVector.x, y: head.y + viewVector.y, z: head.z + viewVector.z };
    player.dimension.spawnEntity(projectile, direction).getComponent('minecraft:projectile').owner = player;
}

/**
 * Establece el lore de un item
 * @param {ItemStack} item
 * @param {Player} player
 * @param {Array<string>} lore
 */
export const setLoreItem = (item, player, ...lore) => {
    item.setLore(lore);
    player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, item);
};