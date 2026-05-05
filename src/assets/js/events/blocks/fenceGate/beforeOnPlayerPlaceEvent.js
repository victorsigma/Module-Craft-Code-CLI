import { Block, BlockPermutation, Dimension, Player } from "@minecraft/server";

/**
 * Evento beforeOnPlayerPlace del componente fenceGateComponent
 * Addon: addon_name
 * @param {{permutationToPlace: BlockPermutation, block: Block, dimension: Dimension}} ev
 */
export const fenceGateBeforeOnPlayerPlaceEvent = (ev) => {
    try {
        const cardinal = ev.permutationToPlace.getState("minecraft:cardinal_direction");
        ev.permutationToPlace = ev.permutationToPlace.withState("namespace:direction", cardinal);
    } catch {
    }
}