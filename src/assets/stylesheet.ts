/**
 * Instance by DrewIt
 */

import {strictObject, toKebab} from "./any"

type CSSObject = {
    [K in keyof CSSStyleProperties]?: any
}

interface CSSDeclaration {
    [x: string]: CSSObject | CSSDeclaration
}

class StylesheetConstructor {

    sheet: HTMLStyleElement
    /**
     * @example
     * const o = new stylesheet
     * o.css({
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
     * })
     */
    constructor(o: {id?: string, base?: string} = {id: '', base: ''}) {
        this.sheet = document.createElement('style')
        this.#base = o.base
        this.sheet.id = o.id ? o.id : ""
    }

    #base;
    #decls: string[] = []
    #processBlock(s: string, block: CSSDeclaration) {
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
     * Generates CSS text from an object and writes it into the style tag.
     * 
     * The object o can have nested objects.
     */
    css(o: CSSDeclaration) {
        this.#decls = []
        for (const [selector, block] of Object.entries(o)) {
            const fs = this.#base ? (selector === '&' ? `${this.#base}` : selector.startsWith('&') ? `${this.#base}${selector.replace('&', '')}` : `${this.#base} ${selector}`) : selector
            this.#processBlock(fs, block)
        }
        this.sheet.textContent += this.#decls.join('\n');
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
    overwrite(o: CSSDeclaration) {
        this.sheet.innerHTML = ''
        this.css(o)
    }
}

export {StylesheetConstructor as stylesheet}
