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
}
