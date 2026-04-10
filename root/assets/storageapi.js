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
        return (isValidBackend(b)) ? !0 : !1
    }
}

function setCache() {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            cache[k] = safeParse(localStorage.getItem(k));
        }
    }
    catch(e) {return `Cache ${e}`}
}

const memory = {
    /**
     * @param {string} k 
     */
    get(k) {
        return cache[k]
    },
    /**
     * @param {string} k @param {*} v 
     */
    set(k, v = undefined) {
        if (v !== undefined) {
            cache[k] = v
            setItem(k, v)
        }
        else return (p, n) => {
            const o = cache[k]; o[p] = n; cache[k] = o
            setItem(k, o)
        }
    },
    /**
     * @param {string} k 
     */
    has(k) {
        return Object.hasOwn(cache, k)
    },
    /**
     * @param {string} k 
     */
    remove(k) {
        delete cache[k]
        syncCache()
    }
}

/**
 * @param {string} k @param {*} v 
 */
function setItem(k, v) {
    localStorage.setItem(k, JSON.stringify(v))
}

/**
 * @param {string} k 
 */
function removeItem(k) {
    localStorage.removeItem(k)
}

function syncCache() {
    try {

        // CREATE + UPDATE
        for (const [k, v] of Object.entries(cache)) {
            const serialized = JSON.stringify(v)
            if (localStorage.getItem(k) !== serialized) localStorage.setItem(k, serialized)
        }

        // DELETE
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            if (!(k in cache)) {
                removeItem(k)
                i-- // adjust index after removal
            }
        }
    }
    catch(e) {return `Cache: ${e}`}
}

export const storageapi = {syncCache, setCache, isValidBackend, log: () => console.log(cache), o: memory}
