/**
 * Instance b DrewIt
 */

import {storageapi} from "@assets/storageapi";
import {Module} from "./module";

let CURRENT_EFFECT: Handler | null = null

function signal(value: any) {
    const dep: {
        subs: Set<Handler>
        depend: () => void
        notify: () => void
    } = {
        subs: new Set(),
        depend() {
            if (CURRENT_EFFECT) this.subs.add(CURRENT_EFFECT)
        },
        notify() {
            this.subs.forEach(e => e())
        },
    }

    return {
        get: () => {
            dep.depend()
            return value
        },
        set: (v: any) => {
            if (v !== value) {
                value = v
                dep.notify()
            }
        }
    }
}

function effect(fn: Handler) {
    const run = () => {
        CURRENT_EFFECT = run
        try {fn()} finally {CURRENT_EFFECT = null}
    }
    run()
    return run
}

function computed(fn: Handler) {
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

const persist = function(n: string, v: any) {
    storageapi.o.set('uistates')?.(n, v)
}

export class UiStateManager extends Module {

    reg: WeakMap<Node, Record<string, {t: 'static' | 'computed', fn: Handler}>>
    constructor(r: Rune) {
        super(r)
        this.reg = new WeakMap
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        if (!storageapi.o.has('uistates')) storageapi.o.set('uistates', {})
        this.ready = !0
    }

    define(node: UINode, state: string, fn = (n: UINode) => {}) {
        const map = this.reg.get(node.node) ?? {}
        map[state] = {t: 'static', fn: () => {if (node.mounted) node.attrs({[`data-${state}`]: state}), fn.call(node, node)}}
        this.reg.set(node.node, map)
    }

    defineComputed(node: UINode, state: string, fn = (n: UINode) => {}) {
        const map = this.reg.get(node.node) ?? {}, c = computed(() => fn.call(node, node))
        map[state] = {t: 'computed', fn: () => c.get()}
        effect(() => {
            node.attrs({state: c.get()})
            if (node.key) persist(node.key, state)
        })
        this.reg.set(node.node, map)
    }

    set(node: UINode, state: string, opts = {schedule: false}) {
        const map = this.reg.get(node.node), entry = map ? map[state] : null
        if (!map || !map[state]) throw new Error(`State ${state} not defined for node ${node.key}`)
        if (opts.schedule === !1 && entry) {
            if (entry.t === 'static') entry.fn.call(node)
        }
         if (node.key)persist(node.key, state)
        // Computed states are not manually set
    }
}