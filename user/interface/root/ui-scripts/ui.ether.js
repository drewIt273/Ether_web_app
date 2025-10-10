/**
 * Instance by DrewIt
 * 
 * ui.ether.js
 */

import {isNode, isString, create, find, findAll, toKebab, setAttr, hasAttr, removeAttr, dataset, on, off, ranstring, strictObject, removeNode, setStyle, Registry} from "../../../../nodes/scripts/utilities/any.js";
import {div} from "../../../../nodes/scripts/nodecreator.js";

export const ActiveUIComponents = new Registry;

class UIComponent {

    /**
     * @param {string|HTMLElement} node @param {HTMLElement[]} append 
     */
    constructor(node, append = []) {
        this.node = isString(node) ? create(node) : isNode(node) ? node : new div
        this.ID = ranstring(1)
        this.innerHTML = this.node.innerHTML
        for (const e of append) {
            this.node.appendChild(e)
        }
    }

    #registered0

    #write = () => {
        const O = {node: this.node, this: this}
        if (this.node && !ActiveUIComponents.includesValue(O)) this.registeredKey = ActiveUIComponents.write(O)
        this.#registered0 = O;
    }

    get children() {
        return Array.from(this.node.childNodes)
    }

    /**
     * Returns this node as a selector string that can be used later in searching this node using find, findAll, etc.
     */
    selector() {
        let s = '', n = this.node, c = n.classList
        if (n.id.length > 0) s += `#${n.id}`
        if (c.length > 0) {
            for (let i = 0; i < c.length; i++) {
                s += `.${c.item(i)}`
            }
        }

        return `${this.node.tagName.toLowerCase()}${s}`
    }

    /**
     * @param {...Node} nodes
     */
    append(...nodes) {
        nodes.forEach(n => {
            if (n instanceof Node) this.node.appendChild(n)
        })
        return this
    }

    /**
     * Removes this node from it's parent and appends it into target as a new child of target.
     * @param {Node | string} target 
     */
    appendTo(target) {
        this.node.parentElement?.removeChild(this.node);
        find(target)?.appendChild(this.node)
        this.#write()

        return this 
    }

    /**
     * Removes this node if no value is set to n. Otherwise, removes all descendants of this node which matches selector n.
     * @param {string} n 
     */
    remove(n = '') {
        if (n === "" || undefined) {
            removeNode(this.node)
            ActiveUIComponents.remove(this.registeredKey)
        }
        else if (typeof n === "string") {
            findAll(`${this.selector()} ${n}`).forEach(e => {
                removeNode(e)
            })
        }
        return this
    }

    empty() {
        this.children.forEach(c => removeNode(c))
        return this
    }

    /**
     * @param {(value: ChildNode, index: number, array: ChildNode[]) => void} callback 
     */
    forEach(callback) {
        this.children.forEach(callback)
        return this
    }

    /**
     * @param {string} s 
     * @returns {Node|null}
     */
    find(s) {
        return find(`${this.selector()} ${s}`)
    }

    /**
     * 
     * @param {string} s 
     */
    findAll(s) {
        return findAll(`${this.selector()} ${s}`)
    }

    /**
     * Returns true if other is a descendent of this.
     * @param {Node|string} other 
     */
    contains(other) {
        return isNode(other) ? this.node.contains(other) : this.node.querySelector(other) ? !0 : !1
    }

    /**
     * 
     * @param {string|{}} styleObjOrProp 
     */
    css(styleObjOrProp) {
        const e = this.node
        if (typeof styleObjOrProp === "string") {
            return getComputedStyle(e).getPropertyValue(styleObjOrProp)
        }

        for (const key in styleObjOrProp) {
            const v = styleObjOrProp[key];
            if (strictObject(v)) {
                const targets = document.querySelectorAll(`${this.selector()} ${key}`);
                targets.forEach(target => {
                    Object.assign(target.style, v)
                })
            }
            else if (typeof v !== 'object') {
                this.node.style[toKebab(key)] = v
            }
        }

        return this
    }

    attrs(obj = {}) {
        for (const [prop, val] of Object.entries(obj)) {
            setAttr(this.node, toKebab(prop), val)
        }
        return this
    } 

    /**
     * @param {string} attr 
     */
    getAttr(attr) {
        return this.node.getAttribute(attr)
    }

    /**
     * @param {string} a 
     */
    hasAttr(a) {
        return hasAttr(this.node, a)
    }

    /**
     * @param {string} a 
     */
    removeAttr(a) {
        removeAttr(this.node, a)
        return this
    }

    /**
     * @param {string} attr @param {string} val 
     */
    dataset(attr, val) {
        dataset(this.node, attr, val)
        return this
    }

    /**
     * @param {"add"|"remove"|"toggle"} action 
     * @param {...string} tokens 
     */
    classList(action, ...tokens) {
        for (const token of tokens) {
            this.node.classList[action]?.(token)
        }
        return this
    }

    /**
     * Hides this node after a given timeout by setting a hidden attribute.
     * @param {number} timeout 
     */
    hide(timeout = 0) {
        setTimeout(() => setAttr(this.node, 'hidden', ''), timeout)
        return this
    }

    /**
     * Displays back this node if initially hidden.
     * @param {number} timeout 
     */
    display(timeout = 0) {
        if (hasAttr(this.node, 'hidden')) setTimeout(() => removeAttr(this.node, 'hidden'), timeout)
        return this
    }

    /**
     * Sets the pointer-events CSS property as an attribute to this node.
     * @param {"all"|"none"} v 
     */
    pointerEvents(v) {
        let a = (v === "all") ? 'all' : 'none'
        setAttr(this.node, 'pointer-events', a)
        return this
    }

    /**
     * Executes a callback after a given timeout ones the DOM has fully loaded.
     * @param {()} callback 
     * @param {number} timeout 
     */
    DOMLoaded(callback, timeout = 0) {
        on("DOMContentLoaded", document, () => {setTimeout(callback, timeout)})
        return this
    }

    /**
     * @param {string} ev @param {string|Node} target @param {...Function} handlers 
     */
    delegate(ev, target, ...handlers) {
        handlers.forEach(handler => {
            on(ev, target, handler)
        }) 
        return this
    }

    /**
     * Add event listeners to this node and writes them into the activeListeners registry.
     * @param {string} ev @param  {...Function} handlers 
     */
    on(ev, ...handlers) {
        handlers.forEach(handler => {
            on(ev, this.node, handler)
        }) 
        return this
    }

    /**
     * Removes event listeners from this node if no selector is given and writes them into the backlogListeners registry. Does same for all descendants matching selector if selector is given.
     * @param {string} s selector
     */
    off(s = '') {
        if (s === '' || undefined) off(this.node)
        else if (typeof s === 'string') {
            findAll(`${this.selector()} ${s}`).forEach(n => off(n))
        }
        return this
    }

    /**
     * 
     * @param {Function} callback @param {number} duration 
     */
    fadeIn(callback, duration = 400) {
        const computed = getComputedStyle(this.node);
        if (computed.display !== "none" || computed.opacity === 1) {
            if (callback) callback.call(this.node);
            return;
        }
        if (!this.node._fadeOriginalDisplay)
            this.node._fadeOriginalDisplay = computed.display === "none" ? "block" : computed.display

        setStyle(this.node, 'opacity', 0); setStyle(this.node, 'display', this.node._fadeOriginalDisplay); setStyle(this.node, 'transition', `opacity ${duration}ms ease`);

        this.node.offsetWidth;

        const handler = () => {
            this.node.style.transition = '';
            this.node.removeEventListener("transitionend", handler)
            if (callback) callback.call(this.node)
        }

        this.node.addEventListener("transitionend", handler)

        return this
    }

    /**
     * 
     * @param {Function} callback @param {number} duration 
     */
    fadeOut(callback, duration = 400) {
        const computed = getComputedStyle(this.node);
        if (computed.display === 'none') {
            if (callback) callback.call(this.node)
            return;
        }

        setStyle(this.node, 'transition', `opacity ${duration}ms ease`); setStyle(this.node, 'opacity', 1);

        this.node.offsetWidth; this.node.style.opacity = 0;

        const handler = (e) => {
            if (e.propertyName !== 'opacity') return;
            this.node.style.transition = ''; this.node.style.display = 'none';
            this.node.removeEventListener('transitionend', handler);
            if (callback) callback.call(this.node)
        }

        this.node.addEventListener('transitionend', handler)

        return this
    }

    /**
     * 
     * @param {Function} callback @param {number} duration 
     */
    fadeToggle(callback, duration = 400) {
        const computed = getComputedStyle(this.node);
        if (computed.display === 'none' || computed.opacity === 0) {
            this.fadeIn.call({node: this.node}, callback, duration)
        } else {
            this.fadeOut.call({node: this.node}, callback, duration)
        }

        return this
    }
}
