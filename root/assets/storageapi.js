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
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        cache[k] = safeParse(localStorage.getItem(k));
    }
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
    set(k, v) {
        cache[k] = v
    },
    /**
     * @param {string} k 
     */
    has(k) {
        return Object.hasOwn(cache, k)
    }
}

function compareCache() {
    const a = Object.entries(cache)
    for (let i = 0; i < a.length; i++) {
        const k = localStorage.key(i), b = a[i][0], v = a[i][1]

        if (((b === k) && localStorage.getItem(k) !== v)) {
            localStorage.setItem(b, JSON.stringify(v))
            continue;
        }
        if (localStorage.getItem(b) === null) localStorage.removeItem(b);
    }
}