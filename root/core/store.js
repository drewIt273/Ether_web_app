/**
 * Instance by DrewIt
 * 
 * store.js
 */

import {DModule} from "./module.js"

const local = localStorage, session = sessionStorage, indexed = indexedDB

export class StorageManager extends DModule {

    constructor(runtime) {
        super(runtime)
    }
}
