import { Block, Dimension } from "@minecraft/server";

/**
 * Evento onRedstoneUpdate del componente fenceGateComponent
 * Addon: addon_name
 * @param {{block: Block, dimension: Dimension, powerLevel: number, previousPowerLevel: number}} event
 * @param {{params: { sound_open: string, sound_close: string }}} props
 */
export const fenceGateOnRedstoneUpdateEvent = ({ block, dimension, powerLevel, previousPowerLevel }, { params }) => {
    try {
        let perm = block.permutation;
        const isOpen = block.permutation.getState("namespace:open")

        if (!powerLevel && isOpen && previousPowerLevel !== 0) {
            dimension.playSound(params?.sound_close, block.bottomCenter());
        } else if (powerLevel && !isOpen && previousPowerLevel === 0) {
            dimension.playSound(params?.sound_open, block.bottomCenter());
        }

        if (powerLevel > 0) {
            block.setPermutation(perm.withState('namespace:open', true));
        }
        else {
            block.setPermutation(perm.withState('namespace:open', false));
        }
    } catch {
    }
}