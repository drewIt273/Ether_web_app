/**
 * Instance by DrewIt
 * storageapi.js
 */

/**@deprecated */
const native = undefined
const cache = {}
const stores = [cache]

let i = a => typeof a === 'function';

function safeParse(v) {
    try {
        return JSON.parse(v)
    }
    catch {
        return v
    }
}

function key(k) {
    return /^[a-z]+(\.[a-z0-9_-]+)+$/i.test(k) ? k : `app.${k}`
}

function isValidBackend(b) {
    return stores.includes(b)
}

const api = {
    use: (b) => {
        if (!api.known(b)) throw new Error(`Invalid Storage backend: ${b}`)
        else return b
    },
    known: (b) => {
        return ((i(b.setItem) && i(b.getItem) && i(b.removeItem)) || isValidBackend(b)) ? !0 : !1
    }
}

