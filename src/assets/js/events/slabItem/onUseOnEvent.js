import { Block, system, world } from "@minecraft/server";
import VectorManager from "../../../libs/vectorManager";
import { decrementItemStack } from "../../../libs/itemManager";

/**
 * Evento onUseOn del componente slabItemComponent
 * Addon: addon_name
 */
export const slabItemOnUseOnEvent = () => {}

world.beforeEvents.playerInteractWithBlock.subscribe(({block, blockFace, itemStack, player}) => {
    try {
        if(!itemStack) return
        if (!itemStack.hasTag("namespace:slabs")) return
        
        if (!player.isSneaking) {
            const hasState = block.permutation.getState("namespace:slab_double")
            if (block.typeId == itemStack.typeId && hasState != undefined && blockFace == "Up") return
        }

        const facePosition = getFaceLocation(block, blockFace)
        const blockWithFace = block.dimension.getBlock(facePosition);

        const slabComponent = itemStack.getComponent("namespace:slab_item")

        if (blockWithFace && blockWithFace.typeId == itemStack.typeId) {
            const entities = blockWithFace.dimension.getEntities({ location: blockWithFace.bottomCenter(), maxDistance: 1 });
            if (entities.length > 0) return

            system.run(() => {
                let permutation = blockWithFace.permutation;
                const isDouble = permutation.getState("namespace:slab_double");

                if (isDouble) return

                permutation = permutation.withState("namespace:slab_double", true);

                blockWithFace.setPermutation(permutation);
                blockWithFace.setWaterlogged(false);
                decrementItemStack(itemStack, player)

                if (!slabComponent) return blockWithFace.dimension.playSound("use.stone", blockWithFace.location);
                const params = slabComponent.customComponentParameters.params

                if (Object.keys(params).length === 0) {
                    blockWithFace.dimension.playSound("use.stone", blockWithFace.location)
                } else if (params.sound != undefined || params.sound != "") {
                    blockWithFace.dimension.playSound(params.sound, blockWithFace.location)
                } else {
                    blockWithFace.dimension.playSound("use.stone", blockWithFace.location)
                }
            })
        }
    } catch { }
})

/**
 * Obtiene la ubicacion de la cara para buscar el bloque
 * @param {Block} block 
 * @param {string} blockFace 
 * @returns {{ x: number, y: number, z: number }}
 */
const getFaceLocation = (block, blockFace) => {
    switch (blockFace.toLowerCase()) {
        case "down":
            return VectorManager.addVectors(block.location, { x: 0, y: -1, z: 0 });
        case "up":
            return VectorManager.addVectors(block.location, { x: 0, y: 1, z: 0 });
        case "north":
            return VectorManager.addVectors(block.location, { x: 0, y: 0, z: -1 });
        case "south":
            return VectorManager.addVectors(block.location, { x: 0, y: 0, z: 1 });
        case "west":
            return VectorManager.addVectors(block.location, { x: -1, y: 0, z: 0 });
        case "east":
            return VectorManager.addVectors(block.location, { x: 1, y: 0, z: 0 });
        default:
            return VectorManager.addVectors(block.location, { x: 0, y: 1, z: 0 });
    }
}