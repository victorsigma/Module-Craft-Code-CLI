import { Block, Dimension, Direction, Player } from "@minecraft/server";
import { decrementItemStack } from "../../../libs/itemManager";

const selectFace = {
    "top": "Down",
    "bottom": "Up"
}

/**
 * Evento onPlayerInteract del componente slabComponent
 * Addon: addon_name
 * @param {{face: Direction, faceLocation: Vector3, player: Player, block: Block, dimension: Dimension}} event
 * @param {{params: { sound: string }}} props
 */
export const slabOnPlayerInteractEvent = ({face, faceLocation, player, block, dimension}, { params }) => {
    try {
        let permutation = block.permutation
    
        const verticalHalf = permutation.getState("minecraft:vertical_half")

        const itemStack = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex)

        const entities = dimension.getEntities({ location: block.bottomCenter(), maxDistance: 1 });

        if (itemStack == undefined) return
        if (itemStack.typeId != block.typeId) return
        if (entities.length > 0) return

        if (selectFace[verticalHalf] == face) {
            decrementItemStack(itemStack, player)
            permutation = permutation.withState("namespace:slab_double", true)
            block.setPermutation(permutation);
            block.setWaterlogged(false);
            
            if (Object.keys(params).length === 0) {
                dimension.playSound("use.stone", block.location)
            } else if (params.sound != undefined || params.sound != "") {
                dimension.playSound(params.sound, block.location)
            } else {
                dimension.playSound("use.stone", block.location)
            }
        }
    } catch (error) {
    }
}