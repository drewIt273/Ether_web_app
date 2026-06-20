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
    mappedBehavior: Map<ProxyMessage, Handler>
    send: (msg: ProxyMessage, to: Rune) => void
    behavior: (msg: ProxyMessage, fn: Handler) => void
    onMessage?: MessageHandler
    This: Rune
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
            mappedBehavior: new Map,
            send(msg, to) {
                const o = this.This.proxies.find(p => p.target === to)
                if (o) o.send(msg)
            },
            behavior(msg, fn) {
                this.mappedBehavior.set(msg, fn)
            },
            This: this,
        }
        RuneInstancesLog.log(this)
        this.ID = `R0${RuneInstancesLog.read().length}`
    }
}
