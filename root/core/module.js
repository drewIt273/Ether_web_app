/**
 * Instance by DrewIt
 * 
 * module.js
 */

import {Kernel} from "./runtime.js"

export class KModule {
    constructor(/**@type {Kernel}*/ r) {
        this.runtime = r
        /**Mapped data @type {Map<*, (...args)>} */ this.md = new Map()
        /**Received data */ this.rd = null
        /**Sent data */ this.sd = null
    }

    emit = data => {
        return {
            /**
             * @param {KModule} t 
             */
            to: (t, ...args) => {
                this.sd = data
                this.runtime.interface.emit(data).to(t, ...args)
                return this.emit
            },
            /**
             * @param {(...args)} c 
             */
            map: (c) => {
                this.md.set(data, (...args) => c.call(this, ...args))
                return this.emit
            }
        }
    }
}
export const isModule = v => v instanceof KModule
