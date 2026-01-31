/**
 * Instance by DrewIt
 * 
 * store.js
 */

let Storage = localStorage

export function useStorage(s) {
    return Storage = s
}

function safeParse(v, f = null) {
    try {
        return JSON.parse(v)
    }
    catch {return f}
}

function key(k, prefix = 'app') {
    return `${prefix}.${k}`
}

export const GlobalStorage = {
    /**
     * @param {string} k 
     */
    get: (k) => {
        return safeParse(Storage.getItem(key(k)))
    },
    /**
     * @param {string} k @param {*} v 
     */
    set: (k, v) => {
        Storage.setItem(key(k), JSON.stringify(v))
    },
    /**
     * @param {string} k 
     */
    has(k) {
        return Storage.getItem(key(k)) !== null
    },
    /**
     * @param {string} k 
     */
    remove(k) {
        Storage.removeItem(key(k))
    },
    /**
     * @param {string} k 
     */
    getRaw(k) {
        return Storage.getItem(key(k))
    },    
    /**
     * @param {string} k @param {*} v 
     */
    setRaw(k, v) {
        Storage.setItem(key(k), String(v))
    },
    get size() {
        return Storage.length
    },
    clear(prefix = 'app') {
        for (let i = Storage.length - 1; i >= 0; i--) {
            const k = Storage.key(i)
            if (k?.startsWith(prefix + '.')) Storage.removeItem(k)
        }
    },
}