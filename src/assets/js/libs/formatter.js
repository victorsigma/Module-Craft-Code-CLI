/**
 * Formatea un valor dado en una cadena de texto, aplicando varias opciones de formato.
 *
 * @param {any} value - El valor que se va a formatear.
 * @param {Object} [options={}] - Opciones para personalizar el formato.
 * @param {string} [options.type='r'] - Tipo de formateo para los códigos de color.
 * @param {number} [options.maxDepth=Infinity] - Profundidad máxima para la recursión al formatear objetos anidados.
 * @param {number} [options.lineLength=40] - Longitud máxima de una línea antes de insertar saltos de línea.
 * @param {boolean} [options.arrayIndex=true] - Si se deben incluir los índices de los elementos del array en el formato.
 * @param {boolean} [options.hideFunction=false] - Si se deben ocultar las funciones en la salida formateada.
 * @returns {string} - Cadena de texto que representa el valor formateado, con códigos de color opcionales.
 */
export const format = (value, options = {}) => {
    let type = 'r';
    const noColor = false;

    const defaultOptions = {
        maxDepth: Infinity,
        lineLength: 40,
        arrayIndex: true,
        hideFunction: false,
    };

    if (options.type) {
        type = options.type;
    }

    options = { ...defaultOptions, ...options };

    const f = {
        string: (v) => `§6"${v}"§${type}`,
        number: (v) => `§a${v}§${type}`,
        boolean: (v) => `§s${v}§${type}`,
        'null': () => `§7null§${type}`,
        'undefined': () => `§7undefined§${type}`,
        'class': (v) => `§g[class ${v.name}]§${type}`,
        'function': (v) => `§5§oƒ§${type} §e${v.name ?? ''}()§${type}`,
        'constructor': (v) => `§l§7${v}§${type}`,
        'index': (v) => `§7${v}§${type}`,
        circular: () => `§c[Circular]§${type}`,
        omission: () => `§7...§${type}`
    };

    function isClass(obj) {
        return obj.toString().startsWith("class ");
    }

    function isObject(obj) {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    }

    function run(value, result, step, stack) {
        const nextLine = () => '\n';
        const indent = (s) => ' '.repeat(2 * s);
        const bracket = (b) => step % 2 ? `§e${b}§${type}` : `§d${b}§${type}`;
        const startBracket = (b, line) => result += (line ? nextLine() : '') + bracket(b);
        const endBracket = (b, line) => result += (line ? `${nextLine()}${indent(step - 1)}` : '') + bracket(b);

        if (typeof value === 'string') return result += f.string(value);
        if (typeof value === 'number') return result += f.number(value);
        if (typeof value === 'boolean') return result += f.boolean(value);
        if (typeof value === 'function') {
            if (isClass(value)) return result += f.class(value);
            else return result += f.function(value);
        }
        if (typeof value === 'undefined') return result += f.undefined();
        if (value === null) return result += f.null();

        if (isObject(value)) {
            for (const _value of stack) {
                if (_value === value) return result += f.circular();
            }
            if (value.__proto__) result += f.constructor(value.__proto__.constructor.name) + ' ';
            startBracket('{');
            let short;
            if (step >= options.maxDepth) {
                result += ` ${f.omission()} `;
                short = true;
            } else {
                stack.push(value);
                const entries = [];
                for (const key in value) {
                    const v = value[key];
                    if (!options.hideFunction && typeof v === 'function') continue;
                    const formatted = run(v, '', step + 1, stack);
                    const k = key.match(/\.|\//) ? `"${key}"` : key;
                    entries.push(`${k}: ${formatted}`);
                }
                short = entries.reduce((a, b) => a + b.length, 0) < options.lineLength;
                result += short
                    ? (entries.length > 0 ? ` ${entries.join(', ')} ` : '')
                    : `\n${indent(step)}` + entries.join(',\n' + indent(step));
                stack.pop();
            }
            endBracket('}', !short);
            return result;
        }

        if (Array.isArray(value)) {
            for (const _value of stack) {
                if (_value === value) return result += f.circular();
            }
            result += f.constructor(`Array(${value.length}) `);
            startBracket('[');
            let short;
            if (step >= options.maxDepth) {
                result += ` ${f.omission()} `;
                short = true;
            } else {
                stack.push(value);
                const entries = [];
                for (const index in value) {
                    const v = value[index];
                    if (!options.hideFunction && typeof v === 'function') continue;
                    const formatted = run(v, '', step + 1, stack);
                    entries.push((options.arrayIndex ? `${f.index(index)}: ` : '') + formatted);
                }
                short = entries.reduce((a, b) => a + b.length, 0) < options.lineLength;
                result += short
                    ? (entries.length > 0 ? ` ${entries.join(', ')} ` : '')
                    : `\n${indent(step)}` + entries.join(',\n' + indent(step));
                stack.pop();
            }
            endBracket(']', !short);
            return result;
        }
        return String(value);
    }
    const res = run(value, '', 1, []);
    return noColor ? res.replace(/§./g, '') : res;
}