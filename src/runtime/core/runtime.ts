/**
 * Instance by DrewIt
 */

import {DOMInterface} from "@dom/dom";
import {storageapi} from "@assets/storageapi";
import {RuneInstancesLog} from "@assets/registry";

interface RuntimeConfig {
    approot: string
}

interface RuntimeHooks {
    init: HandlerList,
    ready: HandlerList
}

export class Rune {

    ID: string
    dom: DOMInterface
    init: boolean
    ready: boolean
    hooks: RuntimeHooks
    config: RuntimeConfig
    constructor() {
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
        RuneInstancesLog.log(this)
        this.ID = `R0${RuneInstancesLog.read().length}`
    }
}
