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
import {Scheduler} from './scheduler.js'
import {storageapi} from '../assets/storageapi.js'

export class Kernel {
    constructor() {
        /**Returns the modules constructors */
        this.modules = {DOMInterface, EventsModule, StateManager, Reconciler, Scheduler};
        this.dom = new DOMInterface(this);
        this.events = new EventsModule(this);
        this.state = new StateManager(this);
        this.reconciler = new Reconciler(this);
        this.scheduler = new Scheduler(this);
        this.hooks = {
            init: [storageapi.setCache],
            ready: []
        }
        this.ready = !1;
        this.init = !1;
        this.config = {
            approot: 'lazy-app',
            appui: 'appLayoutContainer',
        }
        this.interface = {}
        this.order = [this.dom, this.state, this.reconciler, this.scheduler, this.events]
    }

    async boot() {
        const a = await this.#preboot()
        return a === undefined ? await this.#runstartupHooks() : a
    }

    async #preboot() {
        try {
            for (let i = 0; i < this.order.length; i++) {
                const a = this.order[i]
                this.hooks.init.push(a.onInit)
                this.hooks.ready.push(a.onReady)
            }
        } catch(e) {return new Error(`preboot: ${e}`)}
    }

    async #runstartupHooks() {
        for (const fn of this.hooks.init) {
            const v = await fn.call(this)
            if (typeof v === 'string') {
                try {
                    return new Error(`${v}`)
                } finally {
                    this.init = !1
                    break
                }
            }
            else this.init = !0
        }
        if (this.init) for (const fn of this.hooks.ready) {
            const v = await fn.call(this)
            if (typeof v === 'string') {
                try {
                    return new Error(`${v}`)
                } finally {
                    this.ready = !1
                    break
                }
            }
            else this.ready = !0
        }
    }

    /**
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