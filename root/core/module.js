/**
 * Instance by DrewIt
 * 
 * module.js
 */

import {Kernel} from "./runtime.js"

export class KModule {
    constructor(/**@type {Kernel}*/ r) {
        this.runtime = r
        /**@type {Map<*, ()>} */
        this.mappedData = new Map()
        this.receivedData = null
        this.sentData = null
    }
}
export const isModule = v => v instanceof KModule