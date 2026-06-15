/**
 * Instance by DrewIt
 */

import {strictObject, toKebab} from "./any"

class StylesheetConstructor {

    sheet: HTMLStyleElement
    /**
     * @example
     * const o = new stylesheet
     * o.CSS = {
     *     ".lepopup-container": {
     *          display: "block",
     *          padding: "2em",
     *          "h3.lepopup-header": { // converted into .lepopup-container h3.lepopup-header
     *              fontSize: "3em",
     *              color: "#3b5998",
     *          },
     *          "&.flex": { // converted into .lepopup-container.flex
     *              display: "flex",
     *          },
     *      },
     * }
     */
    constructor() {
        this.sheet = document.createElement('style')
    }

    #base = ''
    #decls: string[] = []
    #processBlock(s: string, block: Record<string, any>) {
        const decls = []
        for (const prop in block) {
            const value = block[prop]
            // Nested selector (like ".parent": { ".child": {...} })
                if (strictObject(value)) {
                    let ch = prop.startsWith('&') ? prop.replace('&', s) : `${s} ${prop}`.trim()
                    this.#processBlock(ch, value)
                    continue
                }
            // Convert property names to kebab-case
                if (typeof value === 'string' || typeof value === 'number') decls.push(`${toKebab(prop)}: ${value}`)
        }
        // Only push if the block has at least one property
            if (decls.length) this.#decls.push(`${s} {${decls.join('; ')};}`);
    }

    /**
     * Optional: Sets the string selector that prefixes all rules
     */
    set base(s: string) {
        this.#base = s
    }

    /**
     * Optional. Sets the style tag id property
     */
    set id(s: string) {
        this.sheet.id = s
    }

    /**
     * Generates CSS text from an object and writes it into the style tag.
     * 
     * The object o can have nested objects.
     */
    set CSS(o: Record<string, any>) {
        this.#decls = []
        for (const [selector, block] of Object.entries(o)) {
            const fs = this.#base ? (selector === '&' ? `${this.#base}` : selector.startsWith('&') ? `${this.#base}${selector.replace('&', '')}` : `${this.#base} ${selector}`) : selector
            this.#processBlock(fs, block)
        }
        this.sheet.innerHTML += this.#decls.join('\n');
    }

    /**
     * Appends the stylesheet into the document head
     */
    append() {
        !this.sheet.isConnected ? document.head.append(this.sheet) : null
    }

    /**
     * Removes the stylesheet from the document
     */
    remove() {
        if (this.sheet.isConnected) this.sheet.remove()
    }

    /**
     * Overwrites the stylesheet with object o
     */
    overwrite(o: {}) {
        this.sheet.innerHTML = ''
        this.CSS = o
    }
}

export {StylesheetConstructor as stylesheet}
