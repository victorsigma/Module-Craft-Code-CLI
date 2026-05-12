import { describe, test } from "node:test"
import assert from "node:assert"

import { resolvePath } from "../src/core/resolvePath.js";

describe("resolvePath", () => {
    const configSingle = { "namespace.mode": "single" };
    const configMulti = { "namespace.mode": "multi" };

    const casos = [
        { tipo: "entity", descripcion: "entidad client" },
        { tipo: "entities", descripcion: "entidad server" },
        { tipo: "blocks", descripcion: "bloque" },
        { tipo: "items", descripcion: "item" },
    ];

    for (const { tipo, descripcion } of casos) {
        test(`resuelve la ruta de ${descripcion} en single mode`, () => {
            assert.strictEqual(resolvePath(tipo, "test", configSingle), `${tipo}/`)
        });

        test(`resuelve la ruta de ${descripcion} en multi mode`, () => {
            assert.strictEqual(resolvePath(tipo, "test", configMulti), `${tipo}/test/`)
        });
    }
});