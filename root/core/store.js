/**
 * Instance by DrewIt
 * 
 * store.js
 */

import {DModule} from "./module.js"

const local = localStorage, session = sessionStorage, indexed = indexedDB

function stringify(v) {
    return v?.key ? v.key : JSON.stringify(v)
}

export class StorageManager extends DModule {

    constructor(runtime) {
        super(runtime)
    }

    local = {
        /**
         * @param {number} i 
         */
        key: i => {
            return local.key(i)
        },
        /**
         * @param {string} k @param {*} v 
         */
        set: (k, v) => {
            local.setItem(k, JSON.stringify(v))
        },
        /**
         * @param {string} k 
         */
        get: k => {
            return JSON.parse(local.getItem(k))
        },
        /**
         * @param {string} k 
         */
        undo: k => {
            local.removeItem(k)
        },
        size: local.length,
    }
}
