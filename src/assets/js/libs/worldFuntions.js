import { GameMode, Player, world } from "@minecraft/server";

/**
 * Obtiene el modo de juego del jugador
 * @param {Player} player 
 * @returns 
 */
export const getGamemode = (player) => {
    // Loop through each gamemode in the GameMode enum
    const gamemodeValues = Object.values(GameMode);
    for (const gameMode of gamemodeValues) {
        // Use world.getPlayers() to get an iterator of all players in the world with the same name and game mode as the given player
        const gameModePlayer = world.getPlayers({ name: player.name, gameMode });
        // If a player is found with the given name and game mode, return the corresponding string representation of the gamemode
        if (gameModePlayer.length > 0) {
            return gameMode
        }
    }
    // If no matching player is found, return undefined
    return undefined;
}

/**
 * 
 * @param {Player} player 
 * @param {string} objective 
 * @returns 
 */
export const getScoreboardForPlayer = (player, objective) => {
    const scoreboard = world.scoreboard.getObjective(objective);
    const participant = world.scoreboard.getParticipants().filter((data) => {
        return data.displayName == player.nameTag;
    })
    if (participant[0] == undefined) return undefined;
    const score = scoreboard.getScore(participant[0]);

    return score
}

/**
 * 
 * @param {Player} player 
 * @param {string} objective 
 * @returns 
 */
export const getScoreboardParticipant = (player, objective) => {
    const scoreboard = world.scoreboard.getObjective(objective);
    const participant = world.scoreboard.getParticipants().filter((data) => {
        return data.displayName == player.nameTag;
    })
    if (participant[0] == undefined) return undefined;
    const score = scoreboard.getScore(participant[0]);

    return score
}