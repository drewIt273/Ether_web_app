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
        /**@type {WeakMap<Node, {}>} */
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
    define(node, state, fn = () => {}) {
        !this.reg.has(node.node) ? this.reg.set(node.node, {[state]: fn}) : this.reg.get(node.node)[state] = fn
        node.dataset({state: state})
    }

    /**
     * @param {UINode} node @param {string} state 
     */
    set(node, state) {
        if (this.reg.has(node))
            if (Object.hasOwn(this.reg.get(node.node), state)) {
                node.dataset({state: state})
                this.reg.get(node.node)[state].call(node)
            }
            else throw new Error(`State '${state}' not defined for UINode '${node}'`)
        else throw new Error(`[StateManager] UINode '${node}' not registered`)
    }
}
