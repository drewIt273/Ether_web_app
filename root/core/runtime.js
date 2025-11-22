/**
 * Instance by DrewIt
 * 
 * runtime.js
 * co-built with GPT-5
 */

import {dom} from './dom.js'

class Kernel {
    constructor() {
        /**Returns the modules constructors */
        this.modules = {dom};
        this.dom = new dom(this);
        this.hooks = {
            init: [],
            ready: []
        }
        this.ready = !1;
        this.init = !1;
        this.proto = (p, v) => {
            this.#props().includes(p) ? null : this[p] = v
            return p
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

    #props = () => {
        const a = []
        for (const [p] of Object.entries(this)) a.push(p)
        return a
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

export const runtime = new Kernel;