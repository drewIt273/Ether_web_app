/**
 * Instance by DrewIt
 * 
 * module.js
 */

import {Kernel} from "./runtime.js"

const IMC = {
    emit: (data) => (t, ...args) => {
        if (isModule(t)) try {
            t.rd = data
            if (t.md.has(data)) t.md.get(data).call(t, ...args)
        } catch {}
        else throw new TypeError(`${t} is not a runtime module`)
    },
}

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
                if (isModule(t)) {
                    this.sd = data
                    IMC.emit(data)(t, ...args)
                }
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
