/**
 * Instance by DrewIt
 * 
 * events.js
 */

import {find, isNode, isString, Registry} from "../../nodes/scripts/any.js"
import {UIBlock as block, UICell as cell, UIComponent as comp, UIConstructorOf as struct} from "../assets/ui-root.js"

export class events_module {
    constructor(/**@type {kernel}*/runtime) {
        /** Reference to the kernel for hooks, module communication, etc. */
            this.runtime = runtime
        /**A registry for nodes still having active listeners in the DOM */
            this.ActiveListeners = new Registry()
        /**A registry for nodes whose event listeners where removed from the DOM */
            this.BacklogListeners = new Registry()
        /**Track which global events are already delegated @type {Set<string>} */
            this.ActiveGlobals = new Set()
        /**Stores references to global delegated listeners so they can be removed later @type {Map<string, ()>} */
            this.GlobalDelegates = new Map()
        /**@type {WeakMap<(cell|block|comp), [string[], ()][]>} */
            this.Keybinds = new WeakMap()
        /**@type {Element} */
            this.root = runtime.dom.find('#mainLayoutContainer')
    }

    #unbubble = new Set(['mouseenter', 'mouseleave', 'blur', 'focus', 'pointerenter', 'pointerleave'])

    /**
     * Adds global delegated listener to all matching selectors for each given handler
     * @param {string} ev @param {string|Node} target  @param {...(e: Event)} handlers
     */
    listen(ev, target, ...handlers) {
        const a = this.ActiveListeners, b = this.BacklogListeners
        const nodes = isString(target) ? runtime.dom.find(target) : [target]
    
        nodes.forEach(node => {
            let existing = a.find(o => o.node === node && o.ev === ev)

            if (existing) {
                // Only add handlers that aren’t already registered
                    handlers.forEach(handler => {
                        if (!existing.fn.includes(handler)) existing.fn.push(handler)
                    })
            }
            else {
                // New entry
                    if (!this.#unbubble.has(ev)) a.write({node, ev, fn: [...handlers], in: 'active'})
            }
            // Ensure this node isn't still in backlog
                b.splice(0, b.size, b.filter(o => o.node !== node))
        })

        if (!this.ActiveGlobals.has(ev)) {
            this.ActiveGlobals.add(ev)
            if (this.#unbubble.has(ev)) {
                nodes.forEach(n => {
                    const node = find(n)
                    handlers.forEach(handler => node.addEventListener(ev, e => handler.call(node, e)))
                })
            }
            else {
                const delegatedListener = e => {
                    a.filter(o => o.ev === ev).forEach(o => {
                        if (isString(o.node)) {
                            const matched = e.target.closest(o.node);
                            if (matched && this.root.contains(matched)) o.fn.forEach(fn => fn.call(matched, e));
                        }
                        else if (isNode(o.node)) if (o.node.contains(e.target)) o.fn.forEach(fn => fn.call(o.node, e));
                    })
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
    unlisten(ev, target) {
        const a = this.ActiveListeners
        const nodes = isString(target) ? runtime.dom.find(target) : [target]

        nodes.forEach(node => {
            const existing = a.find(o => o.node === node && o.ev === ev)
            if (!existing) return;

            // Remove direct listeners for non-bubbling events
                if (this.#unbubble.has(ev)) {
                    const e = find(node);
                    if (e) existing.fn.forEach(fn => e.removeEventListener(ev, fn));
                }

            // If no handlers left, remove from ActiveListeners
                if (!existing.fn.length) a.splice(0, a.size, a.filter(o => o !== existing))
        })
    }

    /**
     * @param {("ctrl"|"alt"|"meta"|"shift")[]} keys @param {cell|block|comp} node @param {()} handler 
     */
    keybind(keys, node, handler) {
        if (typeof handler !== 'function' || struct(node?.node) === undefined) return;
        else this.Keybinds.has(node.node) ? this.Keybinds.get(node.node).push([keys, handler]) : this.Keybinds.set(node.node, [[keys, handler]])
    }
}