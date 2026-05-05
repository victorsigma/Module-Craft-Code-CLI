import { Block, Dimension, Direction, Player } from "@minecraft/server";


const CARDINAL_OPPOSITE = {
    north: "south",
    south: "north",
    west: "east",
    east: "west"
};

const CARDINAL_GROUP_SN = ["south", "north"];
const CARDINAL_GROUP_WE = ["east", "west"];
/**
 * Evento onPlayerInteract del componente fenceGateComponent
 * Addon: addon_name
 * @param {{face: Direction, faceLocation: Vector3, player: Player, block: Block, dimension: Dimension}} event
 * @param {{params: { sound_open: string, sound_close: string }}} props
 */
export const fenceGateOnPlayerInteractEvent = ({face, faceLocation, player, block, dimension}, {params}) => {
    try {
        let permutation = block.permutation;
        const placeDirection = permutation.getState("minecraft:cardinal_direction")
        const direction = CARDINAL_OPPOSITE[face.toLowerCase()];
        const isOpen = permutation.getState("namespace:open");

        if (direction) {
            if (CARDINAL_GROUP_SN.includes(direction) && CARDINAL_GROUP_SN.includes(placeDirection)) {
                permutation = permutation.withState("namespace:direction", direction);
            } else if (CARDINAL_GROUP_WE.includes(direction) && CARDINAL_GROUP_WE.includes(placeDirection)) {
                permutation = permutation.withState("namespace:direction", direction);
            }
        }

        permutation = permutation.withState("namespace:open", !isOpen)

        if (isOpen) {
            dimension.playSound(params?.sound_close, block.bottomCenter());
        } else {
            dimension.playSound(params?.sound_open, block.bottomCenter());
        }

        block.setPermutation(permutation);
    } catch {
    }
}