/**
 * Instance by DrewIt
 */

import {DOMInterface} from "@dom/dom";
import {storageapi} from "@assets/storageapi";
import {RuneInstancesLog} from "@assets/registry";
import {RuneProxies, ProxyMessage, MessageHandler, RuntimeProxy} from "./proxy";

interface RuntimeConfig {
    approot: string
}

interface RuntimeHooks {
    init: HandlerList,
    ready: HandlerList
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

export class Rune {

    ID: string
    dom: DOMInterface
    init: boolean
    ready: boolean
    hooks: RuntimeHooks
    config: RuntimeConfig
    proxies: RuntimeProxy[]
    proxyInterface: ProxyInterface
    constructor(o: RuntimeAPI = {proxyTargets: null, shared: false}) {
        this.dom = new DOMInterface(this)
        this.hooks = {
            init: [storageapi.setCache],
            ready: []
        }
        this.init = !1
        this.ready = !1
        this.config = {
            approot: 'lazy-app'
        }
        this.proxies = []
        o.proxyTargets?.forEach(r => {
            this.proxies.push(new RuntimeProxy(r))
        })
        this.proxyInterface = {
            allowed: true,
            received: [],
            mapped: new Map,
            async send(msg, to) {
                const o = RuneProxies.read().find(o => o.targets.includes(to))
                return o?.send(msg, to)
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
        this.ID = `R0${RuneInstancesLog.read().length}`
    }
}
