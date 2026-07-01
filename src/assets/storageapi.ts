/**
 * Instance by DrewIt
 */

import {safeParse, strictObject} from "./any"
import {CacheError} from "@core/error"

interface CacheAPI {
    syncCache: () => CacheError | undefined
    setCache: () => CacheError | undefined
    isValidBackend: (o: any) => boolean
    log: () => void
    o: {
        get<K extends keyof CacheObject>(k: K): CacheObject[K];
        set<K extends keyof CacheObject>(k: K, v?: CacheObject[K]): ((p: string, o: any) => void) | undefined;
        has(k: keyof CacheObject): boolean;
        remove(k: keyof CacheObject): void;
    }
}

type nodekey = string

interface CacheObject {
    uistates?: Record<nodekey, string>
}

const cache: CacheObject = {}
const stores = [cache]

function isValidBackend(o: any) {
    return stores.includes(o)
}

function setCache() {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            // @ts-expect-error
            if (k) cache[k] = safeParse(localStorage.getItem(k));
        }
    }
    catch(e) {return new CacheError(`${e}`)}
}

const memory = {
    get<K extends keyof CacheObject>(k: K) {
        return cache[k]
    },
    set<K extends keyof CacheObject>(k: K, v: CacheObject[K] | undefined = undefined) {
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
    has(k: keyof CacheObject) {
        return Object.hasOwn(cache, k)
    },
    remove(k: keyof CacheObject) {
        delete cache[k]
        syncCache()
    }
}

function setItem(k: keyof CacheObject, v: any) {
    localStorage.setItem(String(k), JSON.stringify(v))
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

export const storageapi: CacheAPI = {syncCache, setCache, isValidBackend, log: () => console.log(cache), o: memory}