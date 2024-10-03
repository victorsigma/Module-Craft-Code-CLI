import { Block, Dimension } from "@minecraft/server";

/**
* Recupera los bloques vecinos de un bloque de origen
* @param {Block} block 
* @returns {{
* blockNeighborUp: Block, 
* blockNeighborDown: Block, 
* blockNeighborEast: Block, 
* blockNeighborWest: Block,
* blockNeighborNorth: Block, 
* blockNeighborSouth: Block
* }}
*/
export const blockNeighbors = (block) => {
    try {
        if (!block) return;

        const blockNeighborUp = block.above(1);
        const blockNeighborDown = block.below(1);
        const blockNeighborEast = block.east(1);
        const blockNeighborWest = block.west(1);
        const blockNeighborNorth = block.north(1);
        const blockNeighborSouth = block.south(1);

        return {
            blockNeighborUp,
            blockNeighborDown,
            blockNeighborEast,
            blockNeighborWest,
            blockNeighborNorth,
            blockNeighborSouth
        };
    } catch (error) {
        return {}
    }
}

/**
 * Verifica si algún vecino tiene la etiqueta especificada
 * @param {Block} block
 * @param {string} tag 
 * @returns {boolean}
 */
export const checkAnyNeighborHasTag = (block, tag) => {
    const {
        blockNeighborDown, blockNeighborUp,
        blockNeighborEast, blockNeighborWest,
        blockNeighborNorth, blockNeighborSouth
    } = blockNeighbors(block);

    if(!blockNeighborUp || !blockNeighborDown ||
        !blockNeighborEast || !blockNeighborWest ||
        !blockNeighborNorth || !blockNeighborSouth) return;

    return (
        blockNeighborEast.hasTag(tag) ||
        blockNeighborWest.hasTag(tag) ||
        blockNeighborNorth.hasTag(tag) ||
        blockNeighborSouth.hasTag(tag) ||
        blockNeighborUp.hasTag(tag) ||
        blockNeighborDown.hasTag(tag)
    );
};

/**
 * Verifica si algún vecino es del tipo determinado
 * @param {Block} block
 * @param {string} id 
 * @returns {boolean}
 */
export const checkAnyNeighborHasBlockType = (block, id) => {
    const {
        blockNeighborDown, blockNeighborUp,
        blockNeighborEast, blockNeighborWest,
        blockNeighborNorth, blockNeighborSouth
    } = blockNeighbors(block);

    if(!blockNeighborUp || !blockNeighborDown ||
        !blockNeighborEast || !blockNeighborWest ||
        !blockNeighborNorth || !blockNeighborSouth) return;

    return (
        blockNeighborUp.typeId === id ||
        blockNeighborDown.typeId === id ||
        blockNeighborEast.typeId === id ||
        blockNeighborWest.typeId === id ||
        blockNeighborNorth.typeId === id ||
        blockNeighborSouth.typeId === id
    );
};

/**
 * Verifica si todos los vecinos tiene la etiqueta especificada
 * @param {Block} block
 * @param {string} tag 
 * @returns {boolean}
 */
export const checkAllNeighborHasTag = (block, tag) => {
    const {
        blockNeighborDown, blockNeighborUp,
        blockNeighborEast, blockNeighborWest,
        blockNeighborNorth, blockNeighborSouth
    } = blockNeighbors(block);

    if(!blockNeighborUp || !blockNeighborDown ||
        !blockNeighborEast || !blockNeighborWest ||
        !blockNeighborNorth || !blockNeighborSouth) return;

    return (
        blockNeighborUp.hasTag(tag) &&
        blockNeighborDown.hasTag(tag) &&
        blockNeighborEast.hasTag(tag) &&
        blockNeighborWest.hasTag(tag) &&
        blockNeighborNorth.hasTag(tag) &&
        blockNeighborSouth.hasTag(tag)
    );
};

/**
 * Verifica si todos los vecinos son del tipo determinado
 * @param {Block} block
 * @param {string} id 
 * @returns {boolean}
 */
export const checkAllNeighborHasBlockType = (block, id) => {
    const {
        blockNeighborDown, blockNeighborUp,
        blockNeighborEast, blockNeighborWest,
        blockNeighborNorth, blockNeighborSouth
    } = blockNeighbors(block);

    if(!blockNeighborUp || !blockNeighborDown ||
        !blockNeighborEast || !blockNeighborWest ||
        !blockNeighborNorth || !blockNeighborSouth) return;

    return (
        blockNeighborUp.typeId === id &&
        blockNeighborDown.typeId === id &&
        blockNeighborEast.typeId === id &&
        blockNeighborWest.typeId === id &&
        blockNeighborNorth.typeId === id &&
        blockNeighborSouth.typeId === id
    );
};


/**
 * Verifica si vecino de arriba o abajo tiene la etiqueta especificada
 * @param {Block} block
 * @param {string} tag 
 * @returns {boolean}
 */
export const checkTopOrBottomNeighborHasTag = (block, tag) => {
    const {
        blockNeighborDown, blockNeighborUp,
    } = blockNeighbors(block);

    if(!blockNeighborUp || !blockNeighborDown) return;

    return (
        blockNeighborUp.hasTag(tag) ||
        blockNeighborDown.hasTag(tag) 
    );
};


/**
 * Verifica si vecino de arriba o abajo es del tipo determinado
 * @param {Block} block
 * @param {string} id 
 * @returns {boolean}
 */
export const checkTopOrBottomNeighborHasBlockType = (block, id) => {
    const {
        blockNeighborDown, blockNeighborUp,
    } = blockNeighbors(block);

    if(!blockNeighborUp || !blockNeighborDown) return;

    return (
        blockNeighborUp.typeId === id ||
        blockNeighborDown.typeId === id 
    );
};



/**
 * Establece una propiedad del bloque
 * @param {Block} block 
 * @param {string} property 
 * @param {any} value 
 */
export const setBlockProperty = (block, property, value) => {
    let permutation = block.permutation;
    if(block.typeId === 'minecraft:air') return
    permutation = permutation.withState(property, value);

    if(block.typeId === 'minecraft:air') return
    block.setPermutation(permutation);

    return block;
};



/**
 * Rompe el bloque actual en la dimension correspondiente
 * @param {Block} block 
 * @param {Dimension} dimension 
 */
export const setBlockToAir = (block, dimension) => {
    dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} air destroy`)
}