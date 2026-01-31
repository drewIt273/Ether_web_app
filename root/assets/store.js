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

export const GlobalStorage = {
    /**
     * @param {string} k 
     */
    get: (k) => {
        return Storage.getItem(k)
    },
}