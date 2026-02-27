/**
 * Instance by DrewIt
 * 
 * runtime.js
 * co-built with GPT-5
 */

import {DOMInterface} from './dom.js'
import {EventsModule} from './events.js'
import {StateManager} from './state.js'
import {Reconciler} from './reconciler.js'
import {isModule, DModule} from './module.js'

export class Kernel {
    constructor() {
        /**Returns the modules constructors */
        this.modules = {DOMInterface, EventsModule, StateManager, Reconciler};
        this.dom = new DOMInterface(this);
        this.events = new EventsModule(this);
        this.state = new StateManager(this);
        this.reconciler = new Reconciler(this);
        this.hooks = {
            init: [],
            ready: []
        }
        this.ready = !1;
        this.init = !1;
        this.proto = (p, v) => {
            (function() {const a = []; for (const [p] of Object.entries(this)) a.push(p); return a})().includes(p) ? null : this[p] = v
            return p
        }
        this.config = {}
        this.interface = {
            emit: data => {
                return {
                    /**
                     * @param {DModule} t 
                     */
                    to: (t, ...args) => {
                        if (isModule(t)) try {
                            t.rd = data
                            if (t.md.has(data)) t.md.get(data).call(t, ...args)
                        } catch(e) {throw new Error(`${e}`)}
                        else throw new TypeError(`${t} is not a runtime module`)
                    }
                }
            }
        }
        this.order = [this.dom, this.state, this.reconciler, this.events]
    }

    async boot() {
        await this.#preboot()
        await this.#runstartupHooks()
    }

    async #preboot() {
        try {
            for (let i = 0; i < this.order.length; i++) {
                const a = this.order[i]
                this.hooks.init.push(a.onInit)
                this.hooks.ready.push(a.onReady)
            }
        } catch(e) {throw new Error(`preboot returned an error: ${e}`)}
    }

    async #runstartupHooks() {
        for (const fn of this.hooks.init) await fn.call(this);
        this.init = !0
        for (const fn of this.hooks.ready) await fn.call(this);
        this.ready = !0
    }

    /**
     * 
     * @param {"ready"|"init"} st 
     * @param {()} fn 
     */
    on(st, fn) {
        switch(st) {
            case 'ready':
                this.ready ? fn.call(this) : this.hooks.ready.push(fn)
                break

            case 'init':
                this.init ? fn.call(this) : this.hooks.init.push(fn)
                break
        }
    }
}

export const runtime = new Kernel(), dom = runtime.dom, GlobalEvents = runtime.events, GlobalStates = runtime.state;