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

    if (gamemode === 'survival' || gamemode === 'adventure') {
        if (amount <= 0) {
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, null);
        } else {
            const decrementItem = new ItemStack(item.typeId, amount)
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, decrementItem);
        }
    }
};


/**
 * Decrementa la cantidad de ítems en una pila de elemento
 * @param {ItemStack} item 
 * @param {number} count 
 * @returns 
 */
export const decrementItemStackObject = (item, count) => {
    const amount = item.amount - count;

    if (amount <= 0) {
        return null;
    } else {
        const decrementItem = new ItemStack(item.typeId, amount)
        return decrementItem;
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
    if (gamemode === 'survival' || gamemode === 'adventure') {
        const currentDamage = item.getComponent('minecraft:durability').damage;
        const maxDurability = item.getComponent('minecraft:durability').maxDurability;
        const durability = maxDurability - currentDamage;
        if (durability >= damage) {
            const newDanage = currentDamage + damage;
            item.getComponent('minecraft:durability').damage = newDanage;
            player.getComponent('minecraft:inventory').container.setItem(player.selectedSlotIndex, item);
        } else {

            player.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:air`)
        }
    }
};

/**
 * Dispara la entidad selecionada y con una potencia seleccionable
 * @param {Player} player
 * @param {string} projectile
 * @param {number} power
 */
export const shootProjectileWithPower = (player, projectile, power) => {
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
export const spawnEntityWithOwner = (player, projectile) => {
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