/**
 * Instance by DrewIt
 * 
 * state.js
 * Co-built with GPT-5
 */

import {storagehas, persistedStore} from "../assets/storageapi.js"
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

function computed(fn) {
    const out = signal(undefined)
    let dirty = true

    const runner = effect(() => {
        const value = fn()
        out.set(value)
        dirty = false
    })

    return {
        get() {
            if (dirty) runner()
            return out.get()
        }
    }
}

const persist = function(n, v) {
    persistedStore.set('uistates')(n, v)
}

export class StateManager extends DModule {

    constructor(runtime) {
        super(runtime)
        /**Node -> state map @type {WeakMap<Node, {}>} */
        this.reg = new WeakMap()
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        if (!storagehas('uistates')) persistedStore.set('uistates', {})
        this.ready = !0
    }

    /**
     * @param {UINode} node @param {string} state
     */
    define(node, state, fn = () => {}) {
        const map = this.reg.get(node.node) ?? {}
        map[state] = {t: 'static', fn}
        this.reg.set(node.node, map)
    }

    /**
     * @param {UINode} node @param {string} state 
     */
    defineComputed(node, state, fn = () => {}) {
        const map = this.reg.get(node.node) ?? {}, c = computed(() => fn.call(node))
        map[state] = {t: 'computed', g: () => c.get()}
        effect(() => {
            node.dataset({state: c.get()})
            persist(node.key, state)
        })
        this.reg.set(node.node, map)
    }

    /**
     * @param {UINode} node @param {string} state @param {{schedule: false}} opts 
     */
    set(node, state, opts) {
        const map = this.reg.get(node.node), entry = map[state]
        if (!map || !map[state]) throw new Error(`State ${state} not defined for node ${node.key}`)
        if (opts.schedule === !1) if (entry.t === 'static') {
            node.dataset({state: state})
            entry.fn.call(node)
        }
        persist(node.key, state)
        // Computed states are not manually set
    }
}
