/**
 * Instance by DrewIt
 * storageapi.js
 */

let Store = localStorage

export function useStorage(b) {
    if (!b || typeof b.getItem !== 'function') throw new Error(`Invalid Storage backend: ${b}`)
    return Store = b
}

function safeParse(v, f = null) {
    try {
        return JSON.parse(v)
    }
    catch {return f}
}

function key(k) {
    if (k.match(/^([a-z].)/i) !== null) return k
    else return `app.${k}`
}

export const StorageAPI = {
    /**
     * @param {string} k
     */
    get: (k) => {
        return safeParse(Store.getItem(key(k)))
    },
    /**
     * @param {string} k @param {*} v 
     */
    set: (k, v) => {
        Store.setItem(key(k), JSON.stringify(v))
    },
    /**
     * @param {string} k 
     */
    has(k) {
        return Store.getItem(key(k)) !== null
    },
    /**
     * @param {string} k 
     */
    remove(k) {
        Store.removeItem(key(k))
    },
    /**
     * @param {string} k 
     */
    getRaw(k) {
        return Store.getItem(key(k))
    },    
    /**
     * @param {string} k @param {*} v 
     */
    setRaw(k, v) {
        Store.setItem(key(k), String(v))
    },
    get size() {
        return Store.length
    },
    clear(prefix = 'app') {
        if (prefix !== null) for (let i = Store.length - 1; i >= 0; i--) {
            const k = Store.key(i)
            if (k?.startsWith(prefix + '.')) Store.removeItem(k)
        }
        else Store.clear()
    },
}