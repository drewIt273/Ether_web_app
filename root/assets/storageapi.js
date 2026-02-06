/**
 * Instance by DrewIt
 * storageapi.js
 */

const stores = [localStorage, caches];
let backend = localStorage, tf = a => typeof a === 'function';

function safeParse(v) {
    try {
        return JSON.parse(v)
    }
    catch(e) {throw new Error(e)}
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
        backend = b
    },
    known: (b) => {
        return ((tf(b.setItem) && tf(b.getItem) && tf(b.removeItem)) || isValidBackend(b)) ? !0 : !1
    }
}

export function useStorage(b = localStorage) {
    api.use(b);

    return {
        /**
         * @param {string} k
         */
        get: (k) => {
            return safeParse(backend?.getItem(key(k)))
        },
        /**
         * @param {string} k @param {*} v 
         */
        set: (k, v) => {
            backend?.setItem(key(k), JSON.stringify(v))
        },
        /**
         * @param {string} k 
         */
        has(k) {
            return backend?.getItem(key(k)) !== null
        },
        /**
         * @param {string} k 
         */
        remove(k) {
            backend?.removeItem(key(k))
        },
        /**
         * @param {string} k 
         */
        getRaw(k) {
            return backend?.getItem(key(k))
        },    
        /**
         * @param {string} k @param {*} v 
         */
        setRaw(k, v) {
            backend?.setItem(key(k), String(v))
        },
        get size() {
            return backend?.length
        },
        clear(prefix = 'app') {
            if (prefix !== null) for (let i = backend?.length - 1; i >= 0; i--) {
                const k = backend?.key(i)
                if (k?.startsWith(prefix + '.')) backend?.removeItem(k)
            }
            else backend?.clear()
        },
    }
}