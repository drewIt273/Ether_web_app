/**
 * Instance by DrewIt
 * 
 * runtime.js
 * co-built with GPT-5
 */

import {dom_module} from './dom.js'
import {events_module} from './events.js'
import {states_module} from './state.js'
import {isModule, KModule} from './module.js'

export class Kernel {
    constructor() {
        /**Returns the modules constructors */
        this.modules = {dom_module, events_module, states_module};
        this.dom = new dom_module(this);
        this.events = new events_module(this);
        this.state = new states_module(this);
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
                     * @param {KModule} t 
                     */
                    to: (t, ...args) => {
                        if (isModule(t)) try {
                            t.rd = data
                            if (t.md.has(data)) t.md.get(data).call(t, ...args)
                        } catch(e) {}
                        else throw new TypeError(`${t} is not a module`)
                    }
                }
            }
        }
    }

    async boot() {
        await this.#runstartupHooks()
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

export const runtime = new Kernel, dom = runtime.dom, GlobalEvents = runtime.events, GlobalStates = runtime.state;