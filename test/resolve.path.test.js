import { describe, test } from "node:test"
import assert from "node:assert"

import { resolvePath } from "../src/core/resolvePath.js";

describe("resolvePath", () => {
    const configSingle = { "namespace.mode": "single" };
    const configMulti = { "namespace.mode": "multi" };

    test("resuelve la ruta donde se creara un archivo de entidad client, single mode", () => {
        assert.strictEqual(resolvePath("entity", "test", configSingle), "entity/")
    })

    test("resuelve la ruta donde se creara un archivo de entidad client, multi mode", () => {
        assert.strictEqual(resolvePath("entity", "test", configMulti), "entity/test/")
    })

    test("resuelve la ruta donde se creara un archivo de entidad server, single mode", () => {
        assert.strictEqual(resolvePath("entities", "test", configSingle), "entities/")
    })

    test("resuelve la ruta donde se creara un archivo de entidad server, multi mode", () => {
        assert.strictEqual(resolvePath("entities", "test", configMulti), "entities/test/")
    })

    test("resuelve la ruta donde se creara un archivo de bloque, single mode", () => {
        assert.strictEqual(resolvePath("blocks", "test", configSingle), "blocks/")
    })

    test("resuelve la ruta donde se creara un archivo de bloque, multi mode", () => {
        assert.strictEqual(resolvePath("blocks", "test", configMulti), "blocks/test/")
    })

    test("resuelve la ruta donde se creara un archivo de item, single mode", () => {
        assert.strictEqual(resolvePath("items", "test", configSingle), "items/")
    })

    test("resuelve la ruta donde se creara un archivo de item, multi mode", () => {
        assert.strictEqual(resolvePath("items", "test", configMulti), "items/test/")
    })
})