/**
 * Instance by DrewIt
 * 
 * store.js
 */

const Storage = localStorage

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
    get size() {
        return Storage.length
    }
}