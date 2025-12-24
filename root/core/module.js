/**
 * Instance by DrewIt
 * 
 * module.js
 */

import {Kernel} from "./runtime.js"

export class KModule {
    constructor(/**@type {Kernel}*/ runtime) {
        this.runtime = runtime
        /**@type {Map<any, ()>} */
        this.mappedData = new Map()
        this.received = null
        this.sentdata = null
    }
}
export const isModule = v => v instanceof KModule