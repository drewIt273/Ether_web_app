/**
 * Instance by DrewIt
 * 
 * any.js
 * co-built with GPT-5
 */

/**
 * Converts camelCase or pascalCase to kebab-case: myAttrName -> my-attr-name
 * @param {string} s 
 */
export function toKebab(s) {
    return String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export const isNode = v => v instanceof Node

/** @param {Node} v */
export const hasNode = v => isNode(v) && document.contains(v)

export const isArray = a => Array.isArray(a)

/** @param {string} v */
export const isString = v => typeof v === "string"

/**
 * @param {Element} e @param {string} a
 */
export const hasAttr = (e, a) => e.hasAttribute(a)

/**
 * Returns true if o is an object and not an array
 * @param {any} o 
 */
export const strictObject = o => !Array.isArray(o) && o instanceof Object

/**
 * Returns the computed style property of an element
 * @param {Element} e @param {string} p 
 */
export const getStyle = (e, p) => getComputedStyle(e)?.[p]

/**
 * Set an inline property style of an element
 * @param {Element} e Element @param {String} p CSSProperty @param {String} v CSSValue
 */
export const setStyle = (e, p, v) => e.style.setProperty(p, v)

export class Registry {
    constructor(src = []) {
        this.register = strictObject(src) ? Array.from(src) : src
    }

    add(...items) {
        items.forEach(item => {
            this.register.push(item)
        })
        return this
    }

    /**
     * @param {(Value: any, index: number, obj: [])} predicate 
     */
    find(predicate) {
        return this.register.find(predicate)
    }
}

/**
 * @param {Node} s 
 */
export const find = s => isString(s) ? document.querySelector(s) : hasNode(s) ? s : null

/**
 * @param {Element} s 
 */
export const findAll = s => isString(s) ? Array.from(document.querySelectorAll(s)) : null

/**
 * @param {string} e 
 */
export const create = e => document.createElement(e)

/**
 * @param {Element} e @param {string} a @param {string} v 
 */
export const dataset = (e, a, v) => e.setAttribute(`data-${toKebab(a)}`, v)

/**
 * @param {Element} e @param {string} a @param {string} v 
 */
export const setAttr = (e, a, v) => e.setAttribute(a, v)

/**
 * @param {Element} e @param {string} a 
 */
export const removeAttr = (e, a) => hasAttr(e, a) ? e.removeAttribute(a) : null

export const web_app = find('web-app')

/**
 * Removes event listeners from nodes in the DOM
 * @param {NodeListOf<Node>} nodes should be a query result @param {string} ev @param {Function} handler 
 */
export const removeListeners = (nodes, ev, handler) => Array.from(nodes).forEach(node => {node.removeEventListener(ev, handler)})

export const activeListeners = []

export const backlogListeners = []

export const backlogNodes = []

/**
 * Adds event listeners to all matching selectors for each given handler and registers their listeners into the listenerRegister
 * @param {string} ev @param {Function[]} handlers @param {string|Node} target 
 */
export function on(ev, target, ...handlers) {
    const nodes = typeof target === 'string' ? findAll(target) : [target]
    
    nodes.forEach(node => {
        let existing = activeListeners.find(o => o.node === node && o.ev === ev)

        if (existing) {
            // Only add handlers that aren’t already registered
                handlers.forEach(handler => {
                    if (!existing.fn.includes(handler)) {
                        node.addEventListener(ev, handler)
                        existing.fn.push(handler)
                    }
                })
        }
        else {
            // New entry
                handlers.forEach(handler => node.addEventListener(ev, handler))
                activeListeners.push({node, ev, fn: [...handlers], in: 'active'})
        }

        // Ensure this node isn't still in backlog
            backlogListeners.splice(0, backlogListeners.length, ...backlogListeners.filter(o => o.node !== node))
    })
}

/**
 * Removes all event listeners from matching selectors
 * @param {string|Node} target 
 */
export function off(target) {
    const nodes = typeof target === 'string' ? findAll(target) : [target]

    nodes.forEach(node => {
        const toRemove = activeListeners.filter(o => o.node === node)

        toRemove.forEach(o => {
            o.fn.forEach(f => o.node.removeEventListener(o.ev, f))
            if (!backlogListeners.includes(o)) backlogListeners.push(o)
            o.in = 'backlog'
        })

        // Mutate activeListeners in place
            activeListeners.splice(0, activeListeners.length, ...activeListeners.filter(o => o.node !== node))
    })
}

/**
 * Restores all event listeners from backlog for matching selectors
 * @param {string} selector 
 */
export function restore(selector) {
    findAll(selector).forEach(node => {
        const toRestore = backlogListeners.filter(o => o.node === node);

        toRestore.forEach(o => {
            o.fn.forEach(f => node.addEventListener(o.ev, f));
            if (!activeListeners.includes(o)) activeListeners.push(o);
            o.in = 'active'
        })

        // Filter out restored objects from backlogListeners
            backlogListeners.splice(0, backlogListeners.length, ...backlogListeners.filter(o => o.node !== node))
    })
}

/**
 * Removes nodes from the DOM along with their listeners.
 * @param {string|Node} target
 */
export function remove(target, log = false) {
    const nodes = typeof target === 'string' ? findAll(target) : [target]

    nodes.forEach(node => {
        // Remove all listeners first
            off(node)

        // Remove from DOM if still attached
            if (node.parentNode) node.parentNode.removeChild(node)

        // Optionally log removed node
            if (log) backlogNodes.push({node, in: 'backlog'})
    })
}