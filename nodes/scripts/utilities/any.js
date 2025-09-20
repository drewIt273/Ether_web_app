/**
 * Instance by DrewIt
 * 
 * any.js
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

/** @param {string} v */
export const isString = v => typeof v === "string"

/**
 * @param {Element} e @param {string} a
 */
export const hasAttr = (e, a) => e.hasAttribute(a)

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
export const dataset = (e, a, v) => e.setAttribute(`data-${a}`, v)

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

/**
 * Adds event listeners to all matching selectors for each given handler and registers their listeners into the listenerRegister
 * @param {string} ev @param {Function[]} handlers @param {string} selector 
 */
export function on(ev, selector, ...handlers) {
    findAll(selector).forEach(node => {

        // Check if this node+event already exists in activeListeners
            let existing = activeListeners.find(o => o.node === node && o.ev === ev);
        
        if (existing) {
            // Only add handlers that aren’t already registered
                handlers.forEach(handler => {
                    if (!existing.fn.includes(handler)) {
                        node.addEventListener(ev, handler);
                        existing.fn.push(handler)
                    }
                })
        }
        else {
            // New entry
                handlers.forEach(handler => {node.addEventListener(ev, handler)});
                activeListeners.push({node, ev, fn: [...handlers], in: 'active'})
        }

        // Ensure this node isn't still in backlog
            backlogListeners = backlogListeners.filter(b => b.node !== node);
    })
    
}

/**
 * Removes all event listeners from matching selectors
 * @param {string} selector 
 */
export function off(selector) {
    findAll(selector).forEach(node => {
        const toRemove = activeListeners.filter(o => o.node === node);

        toRemove.forEach(o => {
            o.fn.forEach(f => node.removeEventListener(o.ev, f));
            if (!backlogListeners.includes(o)) backlogListeners.push(o);
            o.in = 'backlog'
        })

        // Filter out removed objects from activeListeners
            activeListeners = activeListeners.filter(o => o.node !== node);
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
            backlogListeners = backlogListeners.filter(o => o.node !== node);
    })
}