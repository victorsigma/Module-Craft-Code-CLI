import { describe, test } from 'node:test';
import assert from 'node:assert';

import { componentBuilder, componentEventsBuilder, componentImportsBuilder } from '../src/core/componentBuilder.js';
import { componentBuilderResult, componentEventsBuilderResult, componentImportsBuilderResult } from './values.fixture.js';

describe("componentBuilder", () => {
    const name = "mccc:test";
    test("genera los imports correctamente", () => {
        const events = ["beforeOnPlayerPlace", "onPlayerInteract", "onRedstoneUpdate", "onEntityFallOn"]

        assert.strictEqual(componentImportsBuilder({name, events}), componentImportsBuilderResult)
    })

    
    test("genera el objeto de eventos correctamente", () => {
        const events = ["beforeOnPlayerPlace", "onPlayerInteract"]

        assert.strictEqual(componentEventsBuilder({name, events}), componentEventsBuilderResult)
    })

    test("genera el componente completo correctamente", () => {
        const events = ["beforeOnPlayerPlace", "onPlayerInteract", "onRedstoneUpdate"]
        const projectName = "\n * Addon: New Addon"
        const description = "xd"
        assert.strictEqual(componentBuilder({ name, projectName, events, description }), componentBuilderResult);
    })
})