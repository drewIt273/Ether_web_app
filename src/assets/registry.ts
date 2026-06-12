/**
 * Instance by DrewIt
 */

import {strictObject, isValidJSONString} from "./any";

export class Registry {
    reg: Record<string, any>
    constructor(src: {} | Registry = {}) {
        this.reg = strictObject(src) ? {...src} : {}
    }

    #n = (k = '') => {
        if (k === '') return 'a'
        let c = k.split(''), i = c.length - 1
        while (i >= 0) {
            if (c[i] !== 'z') {
                c[i] = String.fromCharCode(c[i]!.charCodeAt(0) + 1);
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
     * Writes data in the registry and returns it key
     */
    write(data: any, key = ''): string {
        if (!(typeof key !== 'string') || !key || key === '') key = this.#generatekey()
        this.reg[key] = data
        return key
    }

    /**
     * Calls a callback for each key in the registry
     */
    forEach(callback: (value: any, key: string) => any) {
        Object.entries(this.reg).forEach(([k, v]) => callback.call(this, v, k))
        return this
    }

    /**
     * Returns the given value at the specified key
     */
    get(key: string): any {
        return this.reg[key]
    }

    /**
     * Removes the specified key from the registry
     */
    remove(key: string) {
        delete this.reg[key]
        return this
    }

    /**
     * Returns the key of the specified value o if found in the registry
     */
    keyOf(o: any): string | undefined {
        for (const [k, v] of Object.entries(this.reg)) if (o === v) return k
    }

    /**
     * Returns first value where predicate returns true
     */
    find(predicate: (v: any, k?: string) => boolean): any {
        for (const [k, v] of Object.entries(this.reg)) if (predicate(v, k)) return v
    }

    /**
     * Filters entries where predicate returns true
     */
    filter(predicate: (v: any, k?: string) => boolean): Registry {
        const filtered: Record<string, any> = {}
        Object.entries(this.reg).forEach(([a, b]) => {
            if (predicate(b, a)) filtered[a] = b
        })
        return new Registry(filtered)
    }

    /**
     * 
     */
    mutate(predicate: (v: any, k?: string) => boolean) {
        for (const [k, v] of Object.entries(this.reg)) {
            if (predicate(v, k)) Object.defineProperty(this.reg, k, v)
        }
        return this
    }

    /**
     * Merges other registries and/or objects into this one
     */
    merge(...others: [Registry, string][]) {
        others.forEach(other => {
            const o = other[0], r = other[1], k = this.includesKey(r) ? `_${r}` : r
            this.reg[k] = o
        })
    }

    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove. If value of this argument is either a negative number, zero, undefined, or a type that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements.
     * @param items  Elements to insert into the array in place of the deleted elements.
     */
    splice(start: number, deleteCount: number, ...items: [string, any][]): [string, any][] {
        return Object.entries(this.reg).splice(start, deleteCount, ...items)
    }

    /**
     * Returns true if this registry has the key k
     */
    includesKey(k: string): boolean {
        return Object.keys(this.reg).includes(k)
    }

    /**
     * Converts this registry into a JSON string
     */
    stringify() {
        return JSON.stringify(this.reg)
    }

    /**
     * Converts a valid JSON string into a registry. Returns undefined if src is invalid.
     */
    parse(src: string): Registry | undefined {
        if (isValidJSONString(src)) return new Registry(JSON.parse(src))
    }

    get size() {
        return Object.entries(this.reg).length
    }

    /**
     * Caution. Clears all entries
     */
    clear() {
        this.reg = {}
    }
}