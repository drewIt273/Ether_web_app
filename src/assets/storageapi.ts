/**
 * Instance by DrewIt
 */

import {safeParse, strictObject} from "./any"
import {CacheError} from "@core/error"

const cache: Record<string, any> = {}
const stores = [cache]

function isValidBackend(o: any) {
    return stores.includes(o)
}

function setCache() {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            if (k) cache[k] = safeParse(localStorage.getItem(k));
        }
    }
    catch(e) {return new CacheError(`${e}`)}
}

const memory = {
    get(k: string) {
        return cache[k]
    },
    set(k: string, v: any = undefined) {
        if (v !== undefined) {
            cache[k] = v
            setItem(k, v)
        }
        else return (p: string, o: any) => {
            const n = cache[k]
            if (strictObject(n)) {
                n[p] = o; cache[k] = o
                setItem(k, n)
            }
        }
    },
    has(k: string) {
        return Object.hasOwn(cache, k)
    },
    remove(k: string) {
        delete cache[k]
        syncCache()
    }
}

function setItem(k: string, v: any) {
    localStorage.setItem(k, JSON.stringify(v))
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
            if (k) if (!(k in cache)) {
                localStorage.removeItem(k)
                i-- // adjust index after removal
            }
        }
    }
    catch(e) {return new CacheError(`${e}`)}
}

export const storageapi = {syncCache, setCache, isValidBackend, log: () => console.log(cache), o: memory}