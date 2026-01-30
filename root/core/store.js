/**
 * Instance by DrewIt
 * 
 * store.js
 */

import {DModule} from "./module.js"

const local = localStorage, session = sessionStorage

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

    session = {
        /**
         * @param {number} i 
         */
        key: i => {
            return session.key(i)
        },
        /**
         * @param {string} k @param {*} v 
         */
        set: (k, v) => {
            session.setItem(k, JSON.stringify(v))
        },
        /**
         * @param {string} k 
         */
        get: k => {
            return JSON.parse(session.getItem(k))
        },
        /**
         * @param {string} k 
         */
        undo: k => {
            session.removeItem(k)
        },
        size: session.length,        
    }
}
