import { describe, test } from "node:test"
import assert from "node:assert"

import { isMultiNamespace, resolveAddonName, resolveNamespace } from "../src/core/nameResolver.js";


describe("nameResolver", () => {
    test("retorna el nombre del Add-On para encabezados JSDoc correctamente", () => {
        const config = { "addon.name": "My Test" };

        assert.strictEqual(resolveAddonName(config), "\n * Addon: My Test")
    })

    test("obtiene el primer nombre para el encabezado JSDoc correctamente", () => {
        const config = { "addon.name": ["My Test 1", "My Test 2"] };

        assert.strictEqual(resolveAddonName(config), "\n * Addon: My Test 1")
    })

    test("verifica si es multi namespace", () => {
        const config = { "namespace.mode": "multi", "addon.namespace": ["mccc", "test"] };

        assert.strictEqual(isMultiNamespace(config), true)
    })

    test("verifica que no sea multi namespace array", () => {
        const config = { "namespace.mode": "multi", "addon.namespace": "mccc" };
        
        assert.strictEqual(isMultiNamespace(config), false)
    })

    test("verifica que no sea multi namespace mode", () => {
        const config = { "namespace.mode": "single", "addon.namespace": ["mccc", "test"] };
        
        assert.strictEqual(isMultiNamespace(config), false)
    })

    test("resuelve el namespace correctamente en single", async () => {
        const config = { "namespace.mode": "single", "addon.namespace": ["em", "res"] };

        assert.strictEqual(await resolveNamespace(config), "em")
    })
})