/**
 * Instance by DrewIt
 */

import {DOMInterface} from "@dom/dom";
import {UiEventsModule} from "./events";
import {UiStateManager} from "@lifecycle/state";
import {Scheduler} from "./scheduler";
import {storageapi} from "@assets/storageapi";
import {ArrayLogLock} from "@assets/registry";
import {RuneProxies, ProxyMessage, MessageHandler, RuntimeProxy} from "./proxy";

interface RuntimeConfig {
    approot: string
}

interface RuntimeHooks {
    init: (() => Error | unknown)[],
    ready: (() => Error | unknown)[]
}

interface RuntimeAPI {
    proxyTargets?: Rune[] | null
    shared?: boolean
}

interface ProxyInterface {
    allowed: boolean
    received: ProxyMessage[]
    mapped: Map<ProxyMessage, Handler>
    send: (msg: ProxyMessage, to: Rune) => Promise<ProxyMessage | undefined>
    behavior: (msg: ProxyMessage, fn: Handler) => void
    connect: (proxy: RuntimeProxy) => void
    resolve?: (msg: ProxyMessage) => boolean
    onMessage?: MessageHandler
    readonly This: Rune
}

export const RuneInstancesLog: ArrayLogLock<Rune> = new ArrayLogLock;

export class Rune {

    readonly ID: string
    dom: DOMInterface
    events: UiEventsModule
    states: UiStateManager
    scheduler: Scheduler
    init: boolean
    ready: boolean
    hooks: RuntimeHooks
    config: RuntimeConfig
    proxy: ProxyInterface
    constructor(o: RuntimeAPI = {proxyTargets: null, shared: false}) {
        this.scheduler = new Scheduler()
        this.hooks = {
            init: [storageapi.setCache],
            ready: [() => this.#pn.call(this)]
        }
        this.init = !1
        this.ready = !1
        this.config = {
            approot: 'lazy-app'
        }
        this.#o = o
        this.proxy = {
            allowed: true,
            received: [],
            mapped: new Map,
            async send(msg, to) {
                const o = RuneProxies.find(o => o.targets.includes(to))
                return await o?.send(msg, to, this.This)
            },
            behavior(msg, fn) {
                this.mapped.set(msg, fn)
            },
            connect(proxy) {
                proxy.append(this.This)
            },
            This: this
        }
        RuneInstancesLog.log(this)
        this.ID = `R0${RuneInstancesLog.size}`
        this.dom = new DOMInterface(this)
        this.events = new UiEventsModule(this)
        this.states = new UiStateManager(this)
    }

    #o: RuntimeAPI | null = null

    #pn() {
        if (this.#o)
            if (this.#o.shared) {
                const k = new RuntimeProxy(this); k.shared = true
                this.#o.proxyTargets?.forEach(n => k.append(n))
                RuneProxies.log(k)
            }
            else {
                if (this.#o.proxyTargets?.length) this.#o.proxyTargets.forEach(n => RuneProxies.log(new RuntimeProxy(this, n)))
            }
    }

    async boot() {
        const a = await this.#preboot()
        return a === undefined ? await this.#runstartupHooks() : a
    }

    async #preboot() {
        const a = [this.dom, this.states, this.events]
        try {
            for (const k of a) {
                // @ts-expect-error
                this.hooks.init.push(() => k.onInit.call(k))
                this.hooks.ready.push(() => k.onReady.call(k))
            }
        }
        catch(e) {return new Error(`${e}`)}
    }

    async #runstartupHooks() {
        for (const fn of this.hooks.init) {
            const v = await fn()
            if (v instanceof Error) {
                this.init = !1
                return v
            }
            else this.init = !0
        }
        if (this.init) for (const fn of this.hooks.ready) {
            const v = await fn()
            if (v instanceof Error) {
                this.init = !1
                return v
            }
            else this.init = !0
        }
    }
}
