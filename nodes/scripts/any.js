/**
 * Instance by DrewIt
 * 
 * any.js
 * co-built with GPT-5
 */

/**
 * Converts camelCase or pascalCase to kebab-case: myAttrName -> my-attr-name
 * @param {string} s 
 */
export function toKebab(s) {
    return String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export const isNode = v => v instanceof Node

export const isElement = n => n instanceof Element || n instanceof HTMLElement

/** @param {Node} v */
export const hasNode = v => isNode(v) && document.contains(v)

export const isArray = a => Array.isArray(a)

/** @param {string} v */
export const isString = v => typeof v === "string"

/**
 * @param {Element} e @param {string} a
 */
export const hasAttr = (e, a) => e.hasAttribute(a)

/**
 * Returns a random whole number between min and max inclusively.
 * @param {number} min @param {number} max 
 */
export const $ran = (min, max) => Math.round(Math.random() * (max - min) + min)

/**
 * Returns a random string whose length is specified.
 * @param {number} length The length of each string block. @param {number} count The number of string blocks seperated with '-'. @param {string} end The optional string to be added at the end.
 */
export const ranstring = (length, count, end = '') => {
    const chars = 'abcdefd', vchars = chars + '1234567890';
    let f = (s, c) => Array.from({length: c}, () => s[Math.floor(Math.random() * s.length)]).join(''), key = f(chars, 1);
    key += Array.from({length: count}, () => f(vchars, length)).join('-')

    return (end.length) ? key += `${end}` : key
}

/**
 * Returns true if o is strictly an object
 * @param {*} o 
 */
export const strictObject = o => o !== null && typeof o === "object" && o?.constructor === Object

/**
 * Returns the computed style property of an element
 * @param {Element} e @param {string} p 
 */
export const getStyle = (e, p) => getComputedStyle(e)?.[p]

/**
 * Set an inline property style of an element
 * @param {Element} e Element @param {String} p CSSProperty @param {String} v CSSValue
 */
export const setStyle = (e, p, v) => e.style.setProperty(p, v)

export class Registry {

    /**
     * @param {{}} src 
     */
    constructor(src = {}) {
        /**A reference to the registry object */
        this.reg = strictObject(src) ? {...src} : {}
    }

    #n = (k = '') => {
        if (k === '') return 'a'
        let c = k.split(''), i = c.length - 1
        while (i >= 0) {
            if (c[i] !== 'z') {
                c[i] = String.fromCharCode(c[i].charCodeAt(0) + 1);
                return c.join('')
            }
            c[i] = 'a'
            i--
        }
        return 'a'.repeat(k.length + 1);
    }

    #l = ''

    #generatekey() {
        this.#l = this.#n(this.#l)
        return this.#l
    }

    /**
     * Writes data into the registry and returns its key.
     * @param {*} data The data of any type which needs to be written in the registry.
     * @param {string} key The key to which the data will be attached. Generated automatically if not specified.
     */
    write(data, key = '') {
        if (!isString(key) || !key || key === '') key = this.#generatekey()
        this.reg[key] = data
        return key
    }

    /**
     * Performs the specified action for each element in the registry.
     * @param {(value: any, key: string)} callback 
     */
    forEach(callback) {
        Object.entries(this.reg).forEach(([key, value]) => callback(value, key));
        return this
    }

    /**
     * Returns the value at a given key.
     * @param {string} key 
     */
    get(key) {
        return this.reg[key]
    }

    /**
     * Removes the specifed key from the registry.
     * @param {string} key 
     */
    remove(key) {
        delete this.reg[key]
        return this
    }

    /**
     * Returns the key of the specified value v if found in the registry.
     * @param {any} v 
     */
    keyOf(v) {
        for (const [k, a] of Object.entries(this.reg)) if (v === a) return k
    }

    /**
     * Find first value where predicate returns true.
     * @param {(value: any, key: string) => boolean} predicate 
     */
    find(predicate) {
        for (const [key, value] of Object.entries(this.reg)) if (predicate(value, key)) return value;
        return null
    }

    /**
     * Filter enteries where predicate returns true.
     * @param {(value: any, key: string)} predicate 
     */
    filter(predicate) {
        const filtered = {}
        Object.entries(this.reg).forEach(([key, value]) => {
            if (predicate(value, key)) filtered[key] = value
        })
        return new Registry(filtered)
    }

    /**
     * 
     * @param {(value: any, key: string)} predicate 
     */
    mutate(predicate) {
        for (const [k, v] of Object.entries(this.reg)) {
            if (predicate(v, k)) this.reg = Object.defineProperty(this.reg, k, v)
        }
        return this.reg
    }

    /**
     * Merge other Registries into this one
     * @param  {...Registry} others 
     */
    merge(...others) {
        others.forEach(other => {
            if (other instanceof Registry) {
                Object.entries(other.reg).forEach(([key, value]) => {
                    this.reg[key] = value;
                })
            }
            else {
                let k = this.#generatekey();
                Object.assign(this.reg, {[k]: other})
            }
        })
        return this
    }

    /**
     * Removes elements from this registry and, if necessary, inserts new elements in their place.
     * @param {number} start @param {number} deleteCount @param {...any} items 
     */
    splice(start, deleteCount, ...items) {
        return Object.entries(this.reg).splice(start, deleteCount, ...items)
    }

    /**
     * Determines whether this registry includes a certain key, returning true or false as appropriate.
     * @param {string} key The key to check in the registry
     */
    includesKey(key) {
        return Object.keys(this.reg).includes(key)
    }

    /**
     * Determines whether this registry includes a certain value, returning true or false as appropriate.
     * @param {*} value 
     */
    includesValue(value) {
        for (const [k, v] of Object.entries(this.reg)) if (value === v) return !0
        return !1
    }

    get size() {
        return Object.keys(this.reg).length
    }

    get values() {
        return Object.values(this.reg)
    }

    /**Clear all enteries*/
    clear() {
        this.reg = {}
        return this
    }
}

/**
 * @param {Node|string} s 
 * @returns {Node|null}
 */
export const find = s => isString(s) ? document.querySelector(s) : hasNode(s) ? s : null

/**
 * @param {string} s 
 */
export const findAll = s => isString(s) ? Array.from(document.querySelectorAll(s)) : null

/**
 * @param {string} e 
 */
export const create = e => document.createElement(e)

/**
 * @param {Element} e @param {string} a @param {string} v 
 */
export const dataset = (e, a, v) => e.setAttribute(`data-${toKebab(a)}`, v)

/**
 * @param {Element} e @param {string} a @param {string} v 
 */
export const setAttr = (e, a, v) => e.setAttribute(a, v)

/**
 * @param {Element} e @param {string} a 
 */
export const removeAttr = (e, a) => hasAttr(e, a) ? e.removeAttribute(a) : null
