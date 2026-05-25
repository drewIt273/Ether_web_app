/**
 * Instance by DrewIt
 * 
 * events.js
 */

import {find, isNode, isString, Registry} from "../../nodes/scripts/any.js"
import {UIBlock as block, UICell as cell, UIComponent as comp, UIConstructorOf as struct} from "../assets/ui-root.js"
import {DModule} from "./module.js"

export class EventsModule extends DModule {
    
    constructor(runtime) {
        super(runtime)
        /**A registry for nodes still having active listeners in the DOM */
            this.ActiveListeners = new Registry()
        /**A registry for nodes whose event listeners are pending or where removed from the DOM */
            this.BacklogListeners = new Registry()
        /**Track which global events are already delegated @type {Set<string>} */
            this.ActiveGlobals = new Set()
        /**Stores references to global delegated listeners so they can be removed later @type {Map<string, ()>} */
            this.GlobalDelegates = new Map()
        /**@type {WeakMap<Node, [string[], ()][]>} */
            this.Keybinds = new WeakMap()
        /**@type {Element} */
            this.root = this.runtime.dom.body
        this.emit('r').map((...r) => r.forEach(r => this.restore(r))) ('un').map((ev, n) => this.unlisten(ev, n)) ('ln').map((ev, n, ...f) => this.listen(ev, n, ...f))
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    #unbubble = new Set(['mouseenter', 'mouseleave', 'blur', 'focus', 'pointerenter', 'pointerleave'])

    /**
     * Adds global delegated listener to all matching selectors for each given handler
     * @param {string} ev @param {Node} node  @param {...(e: Event)} handlers
     */
    listen(ev, node, ...handlers) {
        /**@type {{}[]} */
        const existing = this.ActiveListeners.get(ev)

        if (!existing) this.ActiveListeners.write([{node: node, fn: [...handlers]}], ev)
        else {
            let n = existing.find(o => o.node === node)
            handlers.forEach(handler => {
                if (!n.fn.includes(handler)) n.fn.push(handler)
            })
        }

        this.BacklogListeners.splice(0, this.BacklogListeners.size, this.BacklogListeners.filter(o => o.node !== node))

        if (!this.ActiveGlobals.has(ev)) {
            this.ActiveGlobals.add(ev)
            if (this.#unbubble.has(ev)) {
                handlers.forEach(handler => node.addEventListener(ev, e => handler.call(node, e)))
            }
            else {
                const delegatedListener = e => {
                    const o = this.ActiveListeners.get(ev).find(o => o.node === node)
                    if (o.node.contains(e.target)) o.fn.forEach(fn => fn.call(o.node, e))
                    console.log(this.ActiveListeners, this.BacklogListeners)
                }
                this.root.addEventListener(ev, delegatedListener)
                this.GlobalDelegates.set(ev, delegatedListener)
            }
        }
    }

    /**
     * Removes registered event listeners from targets.
     * @param {string} ev @param {string|Node} target
     */
    unlisten(target, ev = '') {
        const nodes = isString(target) ? this.runtime.dom.find(target) : [target]
        let fn = n => {
            const existing = this.ActiveListeners.get(ev), o = existing.find(o => o.node === n)
            if (!existing || !o) return;

            // Remove direct listeners for non-bubbling events
                if (o) {
                    const e = find(n);
                    if (e) o.fn.forEach(fn => e.removeEventListener(ev, fn));
                }
            if (!o.fn.length) existing.splice(0, existing.length, existing.filter(o => o !== existing))
            this.BacklogListeners.write({node: n, fn: existing.fn, ev: ev})

            this.ActiveListeners.splice(0, this.ActiveListeners.size, this.ActiveListeners.filter(o => o.node !== n))
        }
        nodes.forEach(n => fn(n))
    }

    /**
     * Restore all listeners from backlog for nodes matching target.
     * @param {string|Node} target 
     */
    restore(target) {
        const h = this.runtime.dom.query(target).first(), toRestore = this.BacklogListeners.filter(o => o.node === h);
        toRestore.forEach(o => {
            o.fn.forEach(fn => this.listen(o.ev, o.node, fn))
            if (!this.ActiveListeners.includesValue(o)) this.ActiveListeners.write(o)
        })
        this.BacklogListeners.splice(0, this.BacklogListeners.size, this.BacklogListeners.filter(o => o.node !== h))
    }

    /**
     * @param {("ctrl"|"alt"|"meta"|"shift")[]} keys @param {cell|block|comp} node @param {()} handler 
     */
    keybind(keys, node, handler) {
        if (typeof handler !== 'function' || struct(node?.node) === undefined) return;
        else this.Keybinds.has(node.node) ? this.Keybinds.get(node.node).push([keys, handler]) : this.Keybinds.set(node.node, [[keys, handler]])
        return this.keycall
    }

    /**
     * @param {cell|block|comp} node 
     */
    keycall(node) {
        if (!this.Keybinds.has(node.node)) return;
        let k = (c, e) => {
            const map = {ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey}
            for (const k of c) {
                if (map[k] === !1) return !1
                if (!map[k] && e.key.toLowerCase() !== k) return !1
            }
            return !0
        }
        const o = this.Keybinds.get(node.node)
        const listener = (/**@type {KeyboardEvent}*/ e) => {
            o.forEach(([ks, h]) => {
                if (k(ks, e)) {
                    e.preventDefault()
                    h.call(node.node, e)
                }
            })
        }
        node.focus(0)
        this.listen('keydown', this.root, listener)
    }
}