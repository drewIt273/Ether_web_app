/**
 * Instance by DrewIt
 * 
 * stylesheet.js
 */

import {isString, strictObject, toKebab} from "./utilities/any.js";

class StylesheetConstructor {
    constructor() {
        this.sheet = document.createElement('style')
    }

    #base = ''
    #declarations = []
    #processBlock(selector, block) {
        const decls = []
        for (const prop in block) {
            const value = block[prop]

            // Nested selector (like ".parent": { ".child": {...} })
                if (strictObject(value)) {
                    let ch = prop.startsWith('&') ? prop.replace('&', selector) : `${selector} ${prop}`.trim()
                    this.#processBlock(ch, value)
                    continue
                }

            // Convert property names to kebab-case
                if (isString(value) || typeof value === 'number') {
                    decls.push(`${toKebab(prop)}: ${value}`)
                }
        }

            // Only push if the block has at least one property
                if (decls.length) this.#declarations.push(`${selector} {${decls.join('; ')};}`);
    }

    /**
     * Sets the string selector that prefixes all rules.
     * @param {string} s 
     */
    set base(s) {
        this.#base = s
    }

    /**
     * Optional: sets the style tag id.
     * @param {string} i 
     */
    set id(i) {
        this.sheet.id = i
    }

    /**
     * Generates CSS text from an object and writes it to the style tag.
     * @param {{}} o 
     */
    set CSS(o) {
        this.#declarations = []
        for (const [selector, block] of Object.entries(o)) {
            const fs = this.#base ? `${this.#base} ${selector === '&' ? '' : selector}`.trim() : selector
            this.#processBlock(fs, block)
        }
        this.sheet.innerHTML += this.#declarations.join('\n');
    }

    /**
     * Appends this stylesheet into the document head.
     */
    append() {
        !this.sheet.isConnected ? document.head.append(this.sheet) : null
    }

    /**
     * Removes this stylesheet from the document.
     */
    remove() {
        this.sheet.isConnected ? this.sheet.remove() : null
    }
}

export const stylesheet = StylesheetConstructor

export function sheet(style = {}, id = "css-js", overwrite = false) {
    const rules = [];

    const processblock = (selector, block) => {
        const declarations = [];

        for (const prop in block) {
            let value = block[prop];

            // Handle nested objects (not @media or @keyframes though)
                if (typeof value === "object" && value !== null) {
                    processblock(`${selector} ${prop}`.trim(), value);
                    continue
                }

                if (typeof value === "string" && value.endsWith("!important")) {
                    value = value.replace(/!important$/, "".trim())
                    declarations.push(`${toKebab(prop)}: ${value} !important;`)
                }
                else {
                    declarations.push(`${toKebab(prop)}: ${value};`)
                }
        }

        if (declarations.length) rules.push(`${selector} {\n  ${declarations.join('\n  ')}\n}`);
    }

    for (const key in style) {
        const value = style[key];

        if (key.startsWith('@import')) rules.push(`@import '${value}';`)
    
        else if (key.startsWith('@keyframes')) {
            const frames = [];

            for (const frame in value) {
                const props = value[frame];
                const decls = Object.entries(props).map(([prop, val]) => `${prop}: ${val};`).join('\n');
                frames.push(`${frame} {\n   ${decls}\n  }`);
            }
            rules.push(`${key} {\n  ${frames.join('\n ')}\n}`)
        }
        else if (key.startsWith('@media')) {
            const innerRules = [];
            for (const selector in value) {
                const props = value[selector];
                const decls = Object.entries(props)
                    .map(([prop, val]) => {
                        if (typeof val === "string" && val.endsWith('!important')) {
                            val = val.replace(/!important$/, "").trim();
                            return `  ${prop}: ${val} !important;`
                        }
                        else {
                            return `  ${prop}: ${val};`
                        }
                    })
                    .join('\n ');
                innerRules.push(`${selector} {\n  ${decls}\n }`);
            }
            rules.push(`${key} {\n  ${innerRules.join('\n ')}\n}`)
        }
        else {
            processblock(key, value);
        }
    }
    const csstext = rules.join('\n\n');
    if (id === "" || typeof id !== "string") id = 'css-js';

    // Use fallback pattern. Get existing or create new style tag
        const sheet = document.querySelector(`style#${id}`) || Object.assign(document.createElement('style'), {id});
        if (!sheet.isConnected) document.head.appendChild(sheet);

        if (overwrite) {
            sheet.innerHTML = csstext
        }
        else {
            sheet.innerHTML += "\n" + csstext
        }
    
    return csstext
}