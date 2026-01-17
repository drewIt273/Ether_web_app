/**
 * Instance by DrewIt
 * 
 * state.js
 */

import {UINode} from "../assets/ui-root.js"
import {DModule} from "./module.js"

let CURRENT_EFFECT = null

function cs(initial) {
    let value = initial
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
        this.ready = !0
    }

    /**
     * @param {UINode} node @param {string} state
     */
    define(node, name, initial, fn = () => {}) {
        if (!this.reg.has(node.node)) this.reg.set(node.node, new Map())
        const state = cs(initial)
        this.reg.get(node.node).set(name, {state, fn})
        effect(() => {
            const v = state.get()
            node.dataset({state: v})
            fn.call(node, v)
        })
    }

    /**
     * @param {UINode} node @param {string} name
     */
    set(node, name, value) {
        const entry = this.reg.get(node.node)?.get(name)
        if (!entry) throw new Error(`State '${name}' not defined`)
        entry.state.set(value)
    }
}
