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

    emit(data) {
        return {
            /**
             * @param {KModule} t 
             * @param {...args} c 
             */
            to: (t, ...args) => {
                this.sentData = data
                this.runtime.interface.emit(data).to(t, ...args);
                return this.emit
            },
            /**
             * @param {(...args)} c 
             */
            map: (c) => {
                this.mappedData.set(data, c)
                return this.emit
            }
        }
    }
}
export const isModule = v => v instanceof KModule
