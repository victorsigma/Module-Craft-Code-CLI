import { describe, test } from "node:test"
import { applyTemplate } from "../src/core/templateProcessor.js";
import assert from "node:assert";

describe("templateProcessor", () => {
    test("no modifica el contenido si no hay variables", () => {
        assert.strictEqual(applyTemplate("Hola mundo", {}), "Hola mundo");
    });

    test("reemplaza variables en el template", () => {
        const content = "Hola addon_name en namespace";
        const variables = { addon_name: "MyAddon", namespace: "mccc" };
        assert.strictEqual(applyTemplate(content, variables), "Hola MyAddon en mccc");
    });
})