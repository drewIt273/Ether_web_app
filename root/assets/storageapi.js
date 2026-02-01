/**
 * Instance by DrewIt
 * storageapi.js
 */

function safeParse(v, f = null) {
    try {
        return JSON.parse(v)
    }
    catch {return f}
}

function key(k) {
    return /^[a-z]+(\.[a-z0-9_-]+)+$/i.test(k) ? k : `app.${k}`
}

function isValidBackend(b) {
    return b &&
        typeof b.getItem === 'function' &&
        typeof b.setItem === 'function' &&
        typeof b.removeItem === 'function'
}

export const StorageAPI = (backend = localStorage) => {
    if (!isValidBackend(backend)) throw new Error(`Invalid Storage backend: ${backend}`)

    return {
        /**
         * @param {string} k
         */
        get: (k) => {
            return safeParse(backend.getItem(key(k)))
        },
        /**
         * @param {string} k @param {*} v 
         */
        set: (k, v) => {
            backend.setItem(key(k), JSON.stringify(v))
        },
        /**
         * @param {string} k 
         */
        has(k) {
            return backend.getItem(key(k)) !== null
        },
        /**
         * @param {string} k 
         */
        remove(k) {
            backend.removeItem(key(k))
        },
        /**
         * @param {string} k 
         */
        getRaw(k) {
            return backend.getItem(key(k))
        },    
        /**
         * @param {string} k @param {*} v 
         */
        setRaw(k, v) {
            backend.setItem(key(k), String(v))
        },
        get size() {
            return backend.length
        },
        clear(prefix = 'app') {
            if (prefix !== null) for (let i = backend.length - 1; i >= 0; i--) {
                const k = backend.key(i)
                if (k?.startsWith(prefix + '.')) backend.removeItem(k)
            }
            else backend.clear()
        },
    }
}