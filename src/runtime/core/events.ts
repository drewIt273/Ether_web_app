/**
 * Instance by DrewIt
 */

import {Module} from "./module";
import {Registry} from "@assets/registry";

type EventHandler = (e: Event) => any
type GlobalEvents = keyof DocumentEventMap

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

    listen(ev: GlobalEvents, node: Node, ...handlers: EventHandler[]) {
        const existing = this.ActiveListeners.get(ev)
        if (!existing) this.ActiveListeners.write([{node: node, fn: [...handlers]}], ev)
        else {
            let n = existing.find(o => o.node === node)
            if (n) handlers.forEach(fn => {
                if (!n.fn.includes(fn)) n.fn.push(fn)
            })
        }

        this.BacklogListeners.splice(0, this.BacklogListeners.size, this.BacklogListeners.filter(o => o.some(v => v.node === node)))

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

    unlisten(node: Node, ev: GlobalEvents) {
        const existing = this.ActiveListeners.get(ev), o = existing?.find(o => o.node === node)
        if (!existing || !o) return;
        // Remove direct listeners for non-bubbling events
            if (o) o.fn.forEach(fn => node.removeEventListener(ev, fn))
        if (!o.fn.length) existing.splice(0, existing.length, ...existing.filter(o => o.node !== node))

        this.BacklogListeners.includesKey(ev) ? this.BacklogListeners.reg[ev]?.push({node: node, fn: o.fn}) : this.BacklogListeners.write([{node: o.node, fn: o.fn}], ev)

        this.ActiveListeners.splice(0, this.ActiveListeners.size, this.ActiveListeners.filter(o => o.some(v => v.node === node)))
    }
}
