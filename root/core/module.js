/**
 * Instance by DrewIt
 * 
 * module.js
 */

import {Kernel} from "./runtime.js"

const IMC = {
    emit: (data) => async (t, ...args) => {
        if (isModule(t)) try {
            let fn = t.md.get(data); t.rd = data
            if (t.md.has(data)) return await fn.call(t, ...args)
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
             * Emits data to the target module and returns the returned value of the mapped function
             * @param {"dom"|"events"|"state"|"reconciler"} t 
             */
            to: (t, ...args) => {
                const o = Object.keys(this.runtime)[t]
                if (isModule(o)) {
                    this.sd = data
                    return IMC.emit(data)(o, ...args)
                }
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
