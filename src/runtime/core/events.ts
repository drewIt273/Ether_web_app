/**
 * Instance by DrewIt
 */

import {Module} from "./module";
import {Registry} from "@assets/registry";

type EventHandler = (e: Event) => any

interface CustomEvents {
    'append': Event
}

type GlobalEvents = DocumentEventMap & CustomEvents

interface EventRecordValue {
    node: Node
    fn: EventHandler[]
}

interface UnbubbleListener {
    node: Node
    fn: EventHandler[]
    wrappers: EventHandler[]
}

export class UiEventsModule extends Module {

    ActiveListeners: Registry<EventRecordValue[]>
    BacklogListeners: Registry<EventRecordValue[]>
    ActiveGlobals: Set<string>
    GlobalDelegates: Map<string, (...n: any[]) => any>
    Keybinds: WeakMap<Node, [string[], () => any][]>
    constructor(r: Rune) {
        super(r)
        this.ActiveListeners = new Registry()
        this.BacklogListeners = new Registry()
        this.ActiveGlobals = new Set()
        this.GlobalDelegates = new Map()
        this.Keybinds = new WeakMap()

        this.IMC.map('ln', (ev: keyof GlobalEvents, n: Node, ...fn: EventHandler[]) => this.listen(ev, n, ...fn))
        this.IMC.map('un', (n: Node, ev: keyof GlobalEvents | null) => this.unlisten(n, ev))
        this.IMC.map('kc', (k: string[], n: Node, fn: Handler) => this.keybind(k, n, fn)(n))
        this.IMC.map('ku', (n: Node) => this.Keybinds.delete(n))
        this.IMC.map('re', (n: Node) => this.restore(n))
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    #unbubble = new Set(['mouseenter', 'mouseleave', 'blur', 'focus', 'pointerenter', 'pointerleave'])
    #unmap: Record<string, UnbubbleListener[]> = {}

    listen(ev: keyof GlobalEvents, node: Node, ...handlers: ((e: Event) => any)[]) {
        const existing = this.ActiveListeners.get(ev)
        if (!existing) {
            this.ActiveListeners.includesKey(ev)
                ? this.ActiveListeners.reg[ev]?.push({node, fn: [...handlers]})
                : this.ActiveListeners.write([{node, fn: [...handlers]}], ev)
        }
        else {
            let n = existing.find(o => o.node === node)
            if (n) {
                handlers.forEach(fn => {
                    if (!n!.fn.includes(fn)) n!.fn.push(fn)
                })
            }
            else existing.push({node, fn: [...handlers]})
        }

        this.BacklogListeners = this.BacklogListeners.filter(o => !o.some(v => v.node === node))

        if (this.#unbubble.has(ev)) {
            let entry = this.#unmap[ev]?.find(e => e.node === node)
            if (!entry) {
                entry = {node, fn: [], wrappers: []}
                this.#unmap[ev] ? this.#unmap[ev].push(entry) : this.#unmap[ev] = [entry]
            }
            handlers.forEach(handler => {
                if (!entry!.fn.includes(handler)) {
                    entry!.fn.push(handler)
                    const wrapper = (e: Event) => handler.call(node, e)
                    entry!.wrappers.push(wrapper)
                    node.addEventListener(ev, wrapper)
                }
            })
            this.ActiveGlobals.add(ev)
        }
        else {
            if (!this.ActiveGlobals.has(ev)) {
                this.ActiveGlobals.add(ev)
                const delegatedListener = (e: Event) => {
                    if (!(e.target instanceof Node)) return
                    const listeners = this.ActiveListeners.get(ev)
                    if (!listeners) return
                    for (const o of listeners) {
                        if (o.node.contains(e.target)) o.fn.forEach(fn => fn.call(o.node, e))
                    }
                }
                this.rune.dom.root.addEventListener(ev, delegatedListener)
                this.GlobalDelegates.set(ev, delegatedListener)
            }
        }
    }

    unlisten(node: Node, ev: keyof GlobalEvents | null = null) {
        if (ev) {
            const existing = this.ActiveListeners.get(ev)
            const record = existing?.find(o => o.node === node)

            if (this.#unbubble.has(ev)) {
                const entry = this.#unmap[ev]?.find(a => a.node === node)
                entry?.wrappers.forEach(fn => node.removeEventListener(ev, fn))
                if (entry) {
                    if (this.BacklogListeners.includesKey(ev)) this.BacklogListeners.reg[ev]?.push({node, fn: entry.fn})
                    else this.BacklogListeners.write([{node, fn: entry.fn}], ev)
                    this.#unmap[ev] = this.#unmap[ev]?.filter(a => a.node !== node) ?? []
                    if (!this.#unmap[ev]?.length) delete this.#unmap[ev]
                }
                if (existing && existing.length === 1) this.ActiveGlobals.delete(ev)
            }
            else {
                if (!record) return;
                if (this.BacklogListeners.includesKey(ev)) this.BacklogListeners.reg[ev]?.push({node, fn: record.fn})
                else this.BacklogListeners.write([{node, fn: record.fn}], ev)
                if (existing?.length === 1) {
                    const delegate = this.GlobalDelegates.get(ev)
                    if (delegate) {
                        this.rune.dom.root.removeEventListener(ev, delegate)
                        this.GlobalDelegates.delete(ev)
                    }
                    this.ActiveGlobals.delete(ev)
                }
            }

            if (existing) {
                const remaining = existing.filter(o => o.node !== node)
                if (remaining.length) this.ActiveListeners.reg[ev] = remaining
                else this.ActiveListeners.remove(ev)
            }
        }
        else {
            for (const [k, v] of Object.entries(this.ActiveListeners.reg)) {
                const record = v.find(o => o.node === node)
                if (!record) continue

                if (this.#unbubble.has(k)) {
                    const entry = this.#unmap[k]?.find(a => a.node === node)
                    entry?.wrappers.forEach(fn => node.removeEventListener(k, fn))
                    this.#unmap[k] = this.#unmap[k]?.filter(a => a.node !== node) ?? []
                    if (!this.#unmap[k]?.length) delete this.#unmap[k]
                }

                if (this.BacklogListeners.includesKey(k)) this.BacklogListeners.reg[k]?.push({node, fn: record.fn})
                else this.BacklogListeners.write([{node, fn: record.fn}], k)

                const remaining = v.filter(o => o.node !== node)
                if (remaining.length) this.ActiveListeners.reg[k] = remaining
                else {
                    this.ActiveListeners.remove(k)
                    if (!this.#unbubble.has(k)) {
                        const delegate = this.GlobalDelegates.get(k)
                        if (delegate) {
                            this.rune.dom.root.removeEventListener(k, delegate)
                            this.GlobalDelegates.delete(k)
                        }
                        this.ActiveGlobals.delete(k)
                    }
                }
            }
        }
    }

    restore(target: Node) {
        const o = this.BacklogListeners.find(v => v.some(o => o.node === target))
        if (o) {
            const e = this.BacklogListeners.keyOf(o)
            if (e) o.forEach(r => this.listen(e, target, ...r.fn))
        }
    }

    keybind(keys: string[], node: Node, fn: Handler) {
        this.Keybinds.has(node) ? this.Keybinds.get(node)?.push([keys, fn]) : this.Keybinds.set(node, [[keys, fn]])
        return this.keycall
    }

    keycall(node: Node) {
        if (!this.Keybinds.has(node)) return;
        function k(c: string[], e: KeyboardEvent) {
            const map = {ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey, [e.key]: e.key}
            for (const k of c) {
                if (map[k] === !1) return !1
                if (!map[k] && e.key.toLowerCase() !== k) return !1
            }
            return !0
        }
        const p = this.Keybinds.get(node)
        function listener(e: KeyboardEvent) {
            p?.forEach(([ks, h]) => {
                if (k(ks, e)) {
                    e.preventDefault()
                    h.call(node)
                }
            })
        }
        // @ts-expect-error
        this.listen('keydown', node, listener)
    }
}

export type G = GlobalEvents