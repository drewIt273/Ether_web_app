/**
 * Instance by DrewIt
 * 
 * store.js
 */

const Storage = localStorage

function safeParse(v, f) {
    try {
        return JSON.parse(v)
    }
    catch {return f}
}

export const GlobalStorage = {
    get: (k) => {
        return Storage.getItem(k)
    },
}