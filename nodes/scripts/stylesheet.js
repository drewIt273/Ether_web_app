/**
 * Instance by DrewIt
 * 
 * stylesheet.js
 */

import {isString, strictObject, toKebab, create} from "./any.js";

class StylesheetConstructor {
    constructor() {
        this.sheet = create('style')
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
            const fs = this.#base ? (selector === '&' ? `${this.#base}` : selector.startsWith('&') ? `${this.#base}${selector.replace('&', '')}` : `${this.#base} ${selector}`) : selector
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

    /**
     * Overwrites the stylesheet with the object o.
     * @param {{}} o 
     */
    overwrite(o) {
        this.sheet.innerHTML = ''
        this.CSS = o
    }
}

export const stylesheet = StylesheetConstructor
