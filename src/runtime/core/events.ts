/**
 * Instance by DrewIt
 */

import {Module} from "./module";
import {UINodeMap} from "@dom/ui-root";
import {Registry} from "@assets/registry";

type EventHandler = (e: Event) => any

interface EventRecordValue {
    node: Node
    fn: EventHandler[]
}

export class EventsModule extends Module {

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
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    #unbubble = new Set(['mouseenter', 'mouseleave', 'blur', 'focus', 'pointerenter', 'pointerleave'])

    listen(ev: keyof DocumentEventMap, node: Node, ...handlers: ((e: Event) => any)[]) {
        const existing = this.ActiveListeners.get(ev)
        if (!existing) this.ActiveListeners.includesKey(ev) ? this.ActiveListeners.reg[ev]?.push({node: node, fn: [...handlers]}) : this.ActiveListeners.write([{node: node, fn: [...handlers]}], ev)
        else {
            let n = existing.find(o => o.node === node)
            if (n) handlers.forEach(fn => {
                if (!n.fn.includes(fn)) n.fn.push(fn)
            })
        }

            this.BacklogListeners = this.BacklogListeners.filter(o => !o.some(v => v.node === node))

        if (!this.ActiveGlobals.has(ev)) {
            this.ActiveGlobals.add(ev)
            if (this.#unbubble.has(ev)) {
                handlers.forEach(handler => node.addEventListener(ev, e => handler.call(node, e)))
            }
            else {
                const delegatedListener = (e: Event) => {
                    const o = this.ActiveListeners.get(ev)?.find(o => o.node === node)
                    if (o && e.target instanceof Node && o.node.contains(e.target)) o.fn.forEach(fn => fn.call(o.node, e))
                }
                this.rune.dom.root.addEventListener(ev, delegatedListener)
                this.GlobalDelegates.set(ev, delegatedListener)
            }
        }
    }

    unlisten(node: Node, ev: keyof DocumentEventMap) {
        const existing = this.ActiveListeners.get(ev), o = existing?.find(o => o.node === node)
        if (!existing || !o) return;
        // Remove direct listeners for non-bubbling events
            if (o) o.fn.forEach(fn => node.removeEventListener(ev, fn))
        if (!o.fn.length) existing.splice(0, existing.length, ...existing.filter(o => o.node !== node))

        this.BacklogListeners.includesKey(ev) ? this.BacklogListeners.reg[ev]?.push({node: node, fn: o.fn}) : this.BacklogListeners.write([{node: o.node, fn: o.fn}], ev)

            this.ActiveListeners = this.ActiveListeners.filter(o => !o.some(v => v.node === node))
    }

    restore(target: Node) {
        const o = this.BacklogListeners.find(v => v.some(o => o.node === target))
        if (o) {
            const e = this.BacklogListeners.keyOf(o)
            if (e) o.forEach(r => this.listen(e, target, ...r.fn))
        }
    }

    keybind(keys: string[], node: Node, fn: Handler) {
        if (!UINodeMap.has(node)) return;
        else this.Keybinds.has(node) ? this.Keybinds.get(node)?.push([keys, fn]) : this.Keybinds.set(node, [[keys, fn]])
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
