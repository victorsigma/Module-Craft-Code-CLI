import { libraryBuilder } from "../../../../core/libraryBuilder.js"

/**
 * @param {{
 * name: "blockManager" | "itemManager" | "vectorManager" | "worldFuntions"
 * }} params
 * @returns
 */
export const baseLibrary = async ({name = "blockManager"}) => {
    return await libraryBuilder({ name: `${name}.js` });
}