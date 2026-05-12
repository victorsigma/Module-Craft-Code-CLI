import { libraryBuilder } from "../../../../core/libraryBuilder.js"

/**
 * @returns
 */
export const bedrockSystemLibrary = async () => {
    const fc1 = await libraryBuilder({ name: "formatter.js" })
    const fc2 = await libraryBuilder({ name: "bedrockSystem.js" })
    return (fc1 && fc2);
}