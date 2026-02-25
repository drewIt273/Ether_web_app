/**
 * Instance by DrewIt
 * 
 * state.js
 * Co-built with GPT-5
 */

import {useStorage, storagehas} from "../assets/storageapi.js"
import {UINode} from "../assets/ui-root.js"
import {DModule} from "./module.js"

let CURRENT_EFFECT = null

function cs(value) {
    const subscribers = new Set()

    return {
        get() {
            if (CURRENT_EFFECT) subscribers.add(CURRENT_EFFECT)
            return value
        },
        set(next) {
            if (Object.is(value, next)) return
            value = next
            subscribers.forEach(fn => fn())
        }
    }
}

class Dep {
    constructor() {
        this.subs = new Set()
    }

    depend() {
        if (CURRENT_EFFECT) this.subs.add(CURRENT_EFFECT)
    }

    notify() {
        this.subs.forEach(e => e())
    }
}

function signal(value) {
    const dep = new Dep()

    return {
        get() {
            dep.depend()
            return value
        },
        set(v) {
            if (v !== value) {
                value = v
                dep.notify()
            }
        }
    }
}

function effect(fn) {
    const run = () => {
        CURRENT_EFFECT = run
        try {fn()} finally {CURRENT_EFFECT = null}
    }
    run()
    return run
}

export class StateManager extends DModule {

    constructor(runtime) {
        super(runtime)
        this.init = !1
        this.ready = !1
        /**@type {WeakMap<Node, Map<string, *>>} */
        this.reg = new WeakMap()
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        if (!storagehas('uistates')) useStorage(localStorage).set('uistates', {})
        this.ready = !0
    }

    /**
     * @param {UINode} node @param {string} state
     */
    define(node, state, fn = () => {}) {
        if (!this.reg.has(node.node)) this.reg.set(node.node, new Map())
        const o = cs('null')
        this.reg.get(node.node).set(state, {o, fn})
    }

    /**
     * @param {UINode} node @param {string} value
     */
    set(node, value) {
        const entry = this.reg.get(node.node)?.get(value)
        if (!entry) throw new Error(`State '${value}' not defined for ${node.node}`)
        effect(() => {
            entry.o.set(value)
            entry.fn.call(node, node)
            node.dataset({state: entry.o.get()})
        })
        useStorage(localStorage).set('uistates')(node.key, value)
    }
}
