/**
 * Instance by DrewIt
 */

import {safeParse, strictObject, getNodeByID} from "./any"
import {CacheError} from "@core/error"

interface CacheAPI {
    syncCache: () => CacheError | undefined
    setCache: () => CacheError | undefined
    isValidBackend: (o: any) => boolean
    log: () => void
    o: {
        get<K extends keyof CacheObject>(k: K): CacheObject[K];
        set<K extends keyof CacheObject>(k: K): ((p: string, o: any) => void);
        set<K extends keyof CacheObject>(k: K, v: CacheObject[K]): void;
        has(k: keyof CacheObject): boolean;
        remove(k: keyof CacheObject): void;
    },
    dep: Record<StorageKeyReference, string[]>
}

const dep: Partial<Record<StorageKeyReference, string[]>> = {}

type nodekey = string

interface CacheObject {
    uistates?: Record<nodekey, string>
    userdocs?: Record<string, string>
    session?: SessionCache
    [x: string]: any
}

interface SessionCache {
    constructedModule: keyof UiModulesInterfaceMap
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
            if (k) cache[k] = safeParse(localStorage.getItem(k));
        }
    }
    catch(e) {return new CacheError(`${e}`)}
}

function notifyNodes(k: StorageKeyReference, d: any) {
    dep[k]?.forEach(n => {
        getNodeByID(n)?.$.cacheapi.resolveData(k, d)
    })
}

const memory = {
    get<K extends keyof CacheObject>(k: K) {
        return cache[k]
    },
    set<K extends keyof CacheObject>(k: K, v: CacheObject[K] | undefined = undefined): ((p: string, o: any) => void) | void {
        if (v !== undefined) {
            cache[k] = v, setItem(k, v)
            return;
        }
        else return (p: string, o: any) => {
            const n = cache[k]
            if (strictObject(n)) {
                n[p] = o; cache[k] = n
                setItem(k, n)
            }
        }
    },
    has(k: keyof CacheObject) {
        return Object.hasOwn(cache, k)
    },
    remove(k: keyof CacheObject) {
        delete cache[k]
        syncCache(), notifyNodes(k as StorageKeyReference, cache[k])
    }
}

function setItem(k: keyof CacheObject, v: any) {
    localStorage.setItem(String(k), JSON.stringify(v))
    notifyNodes(k as StorageKeyReference, v)
}

function syncCache() {
    try {
        // CREATE + UPDATE
        for (const [k, v] of Object.entries(cache)) {
            const serialized = JSON.stringify(v)
            if (localStorage.getItem(k) !== serialized) localStorage.setItem(k, serialized)
            notifyNodes(k as StorageKeyReference, v)
        }
        // DELETE
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            if (k) if (!(k in cache)) {
                notifyNodes(k as StorageKeyReference, localStorage[k])
                localStorage.removeItem(k)
                i-- // adjust index after removal
            }
        }
    }
    catch(e) {return new CacheError(`${e}`)}
}

declare global {
    type StorageKeyReference = 'projects' | 'issues' | 'spaces' | 'docs'
}

// @ts-expect-error
export const storageapi: CacheAPI = {syncCache, setCache, isValidBackend, log: () => console.log(cache), o: memory, dep: dep}