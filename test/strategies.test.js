import { describe, test } from "node:test"
import assert from "node:assert"

import { behaviorBlockStrategies } from "../src/commands/generatCommands/elements/blocksCommands.js";
import { behaviorItemStrategies } from "../src/commands/generatCommands/elements/itemsCommands.js";
import { componentBlockStrategies } from "../src/commands/generatCommands/components/blocksComponentCommands.js";
import { componentItemStrategies } from "../src/commands/generatCommands/components/itemsComponentCommands.js";
import { modelStrategies } from "../src/commands/generatCommands/common/modelCommands.js";
import { libraryStrategies } from "../src/commands/generatCommands/common/libraryCommands.js";

describe("strategies", () => {
    const casos = [
        { tipo: "behaviorBlockStrategies", strategy: behaviorBlockStrategies, values: ["block", "stair", "slab", "fence", "fence_gate", "wall"] },
        { tipo: "behaviorItemStrategies", strategy: behaviorItemStrategies, values: ["item", "axe", "pickaxe", "shovel", "slab", "sword"] },
        { tipo: "componentBlockStrategies", strategy: componentBlockStrategies, values: ["none", "slab", "fence_gate"] },
        { tipo: "componentItemStrategies", strategy: componentItemStrategies, values: ["none", "slab"] },
        { tipo: "modelStrategies", strategy: modelStrategies, values: ["slab", "stair", "fence", "fence_gate", "wall"] },
        { tipo: "libraryStrategies", strategy: libraryStrategies, values: ["bedrockSystem", "blockManager", "itemManager", "vectorManager", "worldFuntions"] },
    ];

    for (const { tipo, strategy, values } of casos) {
        describe(tipo, () => {
            for (const value of values) {
                test(`tiene estrategia para "${value}"`, () => {
                    assert.ok(strategy[value], `falta estrategia para ${value}`);
                });
            }
        });
    }
})