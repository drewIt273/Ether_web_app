/**
 * Instance by DrewIt
 * 
 * module.js
 */

import {Kernel} from "./runtime.js"

export class DModule {
    constructor(/**@type {Kernel}*/ r) {
        this.runtime = r
        /**Mapped data @type {Map<*, (...args)>} */ this.md = new Map()
        /**Received data */ this.rd = null
        /**Sent data */ this.sd = null
        this.init = !1
        this.ready = !1
    }

    emit = data => {
        return {
            /**
             * @param {DModule} t 
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
                this.md.set(data, c)
                return this.emit
            }
        }
    }
}
export const isModule = v => v instanceof DModule
