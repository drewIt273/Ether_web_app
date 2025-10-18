/**
 * Instance by DrewIt
 * 
 * ui.root.js
 */

import {isNode, isString, create, find, findAll, toKebab, setAttr, hasAttr, removeAttr, dataset, on, off, ranstring, strictObject, removeNode, setStyle, Registry, isArray} from "../../../../nodes/scripts/utilities/any.js";
import {div} from "../../../../nodes/scripts/nodecreator.js";
import {stylesheet} from "../../../../nodes/scripts/stylesheet.js";

export const ActiveUIComponents = new Registry;

export class UIComponent {

    /**
     * @param {string|HTMLElement} node @param {HTMLElement[]} append 
     */
    constructor(node, ...append) {
        this.node = isString(node) ? create(node) : isNode(node) ? node : new div
        this.ID = ranstring(4, 1)
        this.innerHTML = this.node.innerHTML
        for (const e of append) {
            this.node.appendChild(e)
        }
        this.node.setAttribute('ui-component-id', this.ID)
        this.#sheet.base = `[ui-component-id="${this.ID}"]`
    }

    #registered0
    #onstatechange
    #states = {}
    #currentstate = null
    #children = []
    #sheet = new stylesheet

    #write = () => {
        const O = {node: this.node, this: this}
        if (!ActiveUIComponents.values.some(v => v.node ===  this.node)) this.registeredKey = ActiveUIComponents.write(O)
        this.#registered0 = O;
    }

    get children() {
        return Array.from(this.node.childNodes)
    }

    /**
     * Returns this node as a selector string that can be used later in searching this node using find, findAll, etc.
     */
    get selector() {
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
     * Get the currently active state name.
     * @returns {string|null}
     */
    get state() {
        return this.#currentstate
    }

    /**
     * @param {{}} o 
     */
    set CSS(o) {
        this.#sheet.CSS = o
        this.#sheet.append()
    }

    /**
     * @param {...Node|UIComponent} nodes
     */
    append(...nodes) {
        nodes.forEach(n => {
            isNode(n) ? this.node.appendChild(n) : n instanceof UIComponent ? this.node.appendChild(n.node) : this.append(new div)
        })
        return this
    }

    /**
     * Removes this node from it's parent and appends it into target as a new child of target.
     * @param {Node | string} target 
     */
    appendTo(target) {
        this.node.parentElement?.removeChild(this.node);
        this.mount(target)

        return this 
    }

    /**
     * Mounts this by appending it into target and registering it into ActiveUIComponents.
     * @param {Node | string} target 
     */
    mount(target) {
        find(target)?.appendChild(this.node)
        this.#write()
        this.#children.forEach(c => c.mount(this.node));
        if (typeof this.init === 'function') this.init()
        return this
    }

    /**
     * Unmounts this by removing it from the DOM and from the ActiveUIComponents registry.
     */
    unmount() {
        this.#children.forEach(c => c.unmount());
        removeNode(this.node)
        ActiveUIComponents.remove(this.registeredKey)
        return this
    }

    /**
     * Appends one or more child UIComponents.
     * @param  {...UIComponent} comps 
     */
    compose(...comps) {
        comps.forEach(c => {
            if (c instanceof UIComponent) {
                this.#children.push(c)
                this.node.appendChild(c.node)
            }
        })
        return this
    }

    /**
     * Removes all descendants of this node which matches n.
     * @param {string|Node} n 
     */
    remove(n) {
        if (isString(n)) removeNode(`${this.selector} ${n}`)
        else if (isNode(n)) removeNode(n)
        return this
    }

    empty() {
        this.children.forEach(c => removeNode(c))
        return this
    }

    /**
     * Define a new state and its behavior.
     * @param {'active'|'inactive'|'enable'|'disable'} state 
     * @param {(this: Node)} handler 
     */
    defineState(state, handler) {
        if (!isString(state) || typeof handler !== 'function') return this
        this.#states[state] = handler
        return this
    }

    /**
     * Set (or trigger) a defined state.
     * @param {'active'|'inactive'|'enable'|'disable'} state 
     */
    setState(state) {
        if (!(state in this.#states)) {
            console.warn(`State "${state}" not defined for component`, this);
            return this
        }
        this.#currentstate = state
        this.#states[state].call(this, this.node)

        if (this.#onstatechange) this.#onstatechange.call(this, state, this.node)

        return this
    }

    /**
     * Returns true if s was defined as a state of this UIComponent.
     * @param {string} s 
     */
    hasState(s) {
        return s in this.#states
    }

    /**
     * Register a callback for when the component's state changes.
     * @param {(state: string, this: Node) => void} callback 
     */
    onStateChange(callback) {
        (typeof callback === 'function') ? this.#onstatechange = callback : console.warn('onStateChange expects a function callback.')
        return this
    }

    /**
     * Updates the content of one or more descendant nodes of this UIComponent.
     * @param {string|Node} target Can be a node or a string. Can take a special character, '$' which refers to this UIComponent's root node.
     * @param {{append?: Node|Node[], content?: string, replace?: Node|Node[], render?: Boolean|[Boolean, Function]}} options 
     */
    update(target, options) {
        let nodes;
        if (target === '$') nodes = [this.node]
        else if (isNode(target)) {
            if (!this.node.contains(target)) return undefined
            nodes = [target]
        }
        else if (isString(target)) {
            nodes = this.findAll(target)
            if (!nodes.length) return undefined
        }
        else return undefined

        const allowed = ['append', 'content', 'replace', 'render'];

        for (const key of allowed) {

            if (!(key in options)) continue;
            const value = options[key];

            switch (key) {
                case allowed[0]:
                    nodes.forEach(n => {
                        isArray(value) ? value.forEach(v => n.appendChild(v)) : n.appendChild(value)
                    })
                    break;

                case allowed[1]:
                    nodes.forEach(n => n.textContent = String(value))
                    break;

                case allowed[2]:
                    nodes.forEach(n => {
                        const parent = n.parentNode;
                        if (!parent) return;
                        isArray(value) ? value.forEach(v => parent.insertBefore(v, n)) : parent.insertBefore(value, n)
                        parent.removeChild(n)
                    })
                    break;
                
                case allowed[3]:
                    nodes.forEach(n => {
                        const parent = n.parentNode;
                        if (!parent) return;

                        let shouldRender, callback;
                        if (isArray(value)) {
                            shouldRender = Boolean(value[0]);
                            callback = typeof value[1] === 'function' ? value[1] : null
                        }
                        else {
                            shouldRender = Boolean(value)
                        }

                        if (shouldRender) {
                            if (!parent.contains(n)) parent.appendChild(n)
                            if (callback) callback()
                        }
                        else {
                            if (parent.contains(n)) parent.removeChild(n)
                        }
                    })
                    break;
            }
        }

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
        return find(`${this.selector} ${s}`)
    }

    /**
     * 
     * @param {string} s 
     */
    findAll(s) {
        return findAll(`${this.selector} ${s}`)
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
                const targets = document.querySelectorAll(`${this.selector} ${key}`);
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
     * Set aria attributes for accessibility.
     * @param {{}} attrs 
     */
    ariaset(attrs) {
        for (const [key, val] of Object.entries(attrs)) {
            setAttr(this.node, `aria-${key}`, String(v))
        }
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

    focus() {
        this.node.focus()
        return this
    }

    blur() {
        this.node.blur()
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
        (document.readyState === "complete") ? setTimeout(callback, timeout) : on("DOMContentLoaded", document, () => {setTimeout(callback, timeout)})
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
        if (!s) off(this.node)
        else if (typeof s === 'string') {
            findAll(`${this.selector} ${s}`).forEach(n => off(n))
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

    /**
     * Caution. Use only for permanently removing the UIComponent.
     */
    destroy() {
        this.unmount().off().node = null
        this.#states = {}
        this.#onstatechange = null
        this.#children.forEach(c => c.destroy())
        return this
    }
}
