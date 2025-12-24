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

    emit(data) {
        return {
            /**
             * @param {KModule} target 
             * @param {(target: KModule, data?: *)} callback
             */
            to: (target, callback) => {
                if (isModule(target)) {
                    this.runtime.interface.emit(data).to(target, callback)
                    this.sentdata = data
                }
            },
            /**
             * @param {(target: KModule, data?: *)} c 
             */
            map: (c) => {
                this.mappedData.set(data, c)
            }            
        }
    }
}
export const isModule = v => v instanceof KModule