/**
 * Instance by DrewIt
 * 
 * ui.root.js
 */

import {isNode, isString, find, toKebab, setAttr, hasAttr, removeAttr, ranstring, Registry, isArray} from "../../nodes/scripts/any.js"
import {stylesheet} from "../../nodes/scripts/stylesheet.js"
import {dom, GlobalEvents, GlobalStates} from "../core/runtime.js"

export const UIreg = new Registry;

/**@type {WeakMap<Node, UICell|UIBlock|UIComponent>}*/
export const UINodeMap = new WeakMap()

export class UINode {

    /**
     * @param {string|Element} node 
     */
    constructor(node) {
        this.node = dom.newnode(node)
        this.classList = this.node.classList
        this.className = this.node.className
        this.innerHTML = this.node.innerHTML
        this.childNodes = Array.from(this.node.childNodes)
        this.parent = this.node.parentNode
    }

    #s = null
    #cs = null
    #ofn = null
    #fnc = null

    /**
     * Returns true if this is still mounted
     * @returns {boolean}
     */
    get mounted() {
        return UIreg.get(this.registeredKey)?.mounted ?? false
    }

    /**
     * Returns the ui-data-key of this UINode.
     */
    get key() {
        return this.node.getAttribute('ui-data-key')
    }

    /**
     * Returns the previous data state of this UINode.
     * @returns {string|null}
     */
    get prevState() {
        return this.#s
    }

    get currentstate() {
        return this.#cs
    }

    /**
     * Returns this node as a selector string that can be used later in searching this node using find, findAll, etc.
     */
    get selector() {
        let s = '', n = this.node, c = n.classList
        if (n.id.length) s += `#${n.id}`
        if (c.length) for (let i = 0; i < c.length; i++) s += `.${c.item(i)}`
        return `${this.node.tagName.toLowerCase()}${s}`
    }

    /**
     * Sets attributes by an object o.
     * @param {{}} o 
     */
    attrs(o) {
        for (const [k, v] of Object.entries(o)) this.node.setAttribute(toKebab(k), String(v))
        return this
    }

    /**
     * Returns true if other is a descendent of this node.
     * @param {Node|string} other 
     */
    contains = other => isNode(other) ? this.node.contains(other) : (isString(other), this.node.querySelector(other)) ? !0 : !1

    empty() {
        this.childNodes.forEach(c => c.remove())
        return this
    }

    /**
     * Sets styles by an object o.
     * @param {{}} o 
     */
    style(o) {
        for (const [p, v] of Object.entries(o)) this.node.style[toKebab(p)] = v
        return this
    }

    /**
     * Returns the first element that is a descendant of node that matches selectors.
     * @param {string} s 
     */
    find = s => this.node.querySelector(s)

    /**
     * Returns all element descendants of node that match selectors.
     * @param {string} s 
     */
    findAll = s => Array.from(this.node.querySelectorAll(s))

    /**
     * 
     * @param {(this: Node)} callback @param {number} duration 
     */
    fadeIn(callback, duration = 400) {
        const computed = getComputedStyle(this.node);
        if (computed.display !== "none" || computed.opacity === 1) {
            if (callback) callback.call(this, this.node);
            return;
        }
        if (!this.node._fadeOriginalDisplay) this.node._fadeOriginalDisplay = computed.display === "none" ? "block" : computed.display

        this.style({
            opacity: 0,
            display: this.node._fadeOriginalDisplay,
            transition: `opacity ${duration}ms ease`
        })

        this.node.offsetWidth;
        const handler = e => {
            this.style({transition: ''});
            GlobalEvents.unlisten('transitionend', this.node)
            if (callback) callback.call(this, this.node)
        }
        GlobalEvents.listen('transitionend', this.node, handler)
        return this
    }

    /**
     * 
     * @param {(this: Node)} callback @param {number} duration 
     */
    fadeOut(callback, duration = 400) {
        const computed = getComputedStyle(this.node);
        if (computed.display === 'none') {
            if (callback) callback.call(this, this.node)
            return;
        }

        this.style({
            transition: `opacity ${duration}ms ease`,
            opacity: 1
        })

        this.node.offsetWidth; this.node.style.opacity = 0;
        const handler = (e) => {
            if (e.propertyName !== 'opacity') return;
            this.node.style.transition = ''; this.node.style.display = 'none';
            GlobalEvents.unlisten('transitionend', this.node, handler)
            if (callback) callback.call(this, this.node)
        }
        GlobalEvents.listen('transitionend', this.node, handler)
        return this
    }

    /**
     * 
     * @param {(this: Node)} callback @param {number} duration 
     */
    fadeToggle(callback, duration = 400) {
        const computed = getComputedStyle(this.node);
        if (computed.display === 'none' || computed.opacity === 0) this.fadeIn.call({node: this.node}, () => callback.call(this, this.node), duration)
        else this.fadeOut.call({node: this.node}, () => callback.call(this, this.node), duration)
        return this
    }

    /**
     * @param {("ctrl" | "alt" | "meta" | "shift")[]} keys The keys to be pressed.
     * @param {()} handler The Function to be fired.
     */
    keybind(keys, handler) {
        GlobalEvents.keybind(keys, this, handler)(this)
        return this
    }

    unbindkeys() {
        GlobalEvents.Keybinds.delete(this.node)
        return this
    }

    /**
     * Define a new state and its behavior.
     * @param {'active'|'inactive'|'enable'|'disable'} state 
     * @param {(t: this)} handler
     */
    defineState(state, handler) {
        GlobalStates.define(this, state, handler)
        this.#fnc = handler
        return this
    }

    /**
     * Defines a computed state and its behavior
     * @param {string} state 
     * @param {()} fn 
     */
    defineComputedState(state, fn) {
        GlobalStates.defineComputed(this, state, fn)
        return this
    }

    /**
     * Set (or trigger) a defined state.
     * @param {'active'|'inactive'|'enable'|'disable'} state 
     */
    setState(state, o = {schedule: !1}) {
        this.#s = this.getAttr('data-state')
        if (this.#s !== state) {
            GlobalStates.set(this, state, o)
            this.#cs = state
            this.#ofn?.call(this)
        }
        return this
    }

    /**
     * Returns true if s was defined as a state of this UINode.
     * @param {string} s 
     */
    hasDefinedState = s => Object.hasOwn(GlobalStates.reg.get(this.node), s)

    /**
     * Sets a function which runs each time this UINode's state changes.
     * @param {()} fn 
     */
    onStateChange(fn) {
        this.#ofn = fn
    }

    applyChange() {
        this.#fnc.call(this)
    }

    /**
     * @param {string} attr 
     */
    getAttr = attr => this.node.getAttribute(attr)

    /**
     * @param {string} a 
     */
    hasAttr = a => hasAttr(this.node, a)

    /**
     * @param {string} a 
     */
    removeAttr(a) {
        removeAttr(this.node, a)
        return this
    }

    /**
     * Set the ui-data-key of this UINode.
     * @param {string} k 
     */
    UIKey(k) {
        this.attrs({'ui-data-key': `${k}`})
        return this
    }

    /**
     * Sets data attributes.
     * @param {{}} attrs
     */
    dataset(attrs) {
        for (const [k, v] of Object.entries(attrs)) setAttr(this.node, `data-${toKebab(k)}`, String(v))
        return this
    }

    /**
     * Set aria attributes for accessibility.
     * @param {{}} attrs 
     */
    ariaset(attrs) {
        for (const [k, v] of Object.entries(attrs)) setAttr(this.node, `aria-${k}`, String(v))
        return this
    }

    /**
     * @param {"add"|"remove"|"toggle"} action @param {...string} tokens 
     */
    classSet(action, ...tokens) {
        for (const token of tokens) this.node.classList[action]?.(token)
        return this
    }

    /**@param {-1|0} n The value of the tabindex */
    focus(n) {
        this.node.tabIndex = n
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
        this.attrs({pointerEvents: a})
        return this
    }

    /**
     * Add event listeners to this node.
     * @param {string} ev @param  {...(n: Node, e: Event)} handlers 
     */
    on(ev, ...handlers) {
        if (this.mounted) handlers.forEach(handler => GlobalEvents.listen(ev, this.node, e => handler.call(this, this.node, e)));
        else GlobalEvents.BacklogListeners.write({node: this.node, ev: ev, fn: handlers, in: 'backlog'})
        return this
    }

    /**
     * Removes event listeners from this node.
     * @param {string} ev
     */
    off(ev) {
        if (this.mounted) GlobalEvents.unlisten(ev, this.node)
        return this
    }
}

export class UICell extends UINode {

    /**
     * @param {Element|string} node 
     */
    constructor(node) {
        super(node)
        this.ID = ranstring(4, 1)
        this.emittedData = null
        this.receivedData = null
        this.registeredKey = UIreg.write({node: this.node, id: this.ID, type: 'cell', mounted: false})
        this.attrs({'ui-cell-id': this.ID})
        /**@type {Map<any, ()>}> */
            this.mappedData = new Map()
        UINodeMap.set(this.node, this)
    }

    /**
     * 
     * @param  {...Node} nodes 
     */
    append(...nodes) {
        for (const n of nodes) this.node.appendChild(n)
        return this
    }

    /**
     * @param {Node} node @param {Node|null} child 
     */
    insertBefore(node, child) {
        return this.node.insertBefore(node, child)
    }

    /**
     * @param {Node|UIBlock} target 
     */
    mount(target) {
        if (!this.mounted) {
            find(target)?.appendChild(this.node)
            UIreg.get(this.registeredKey).mounted = !0
        }
        return this
    }

    unmount() {
        if (this.mounted) {
            removeNode(this.node)
            UIreg.get(this.registeredKey).mounted = !1
        }
        return this
    }

    /**
     * Emits data to another UICell or Block.
     * @param {*} data 
     */
    emit(data) {
        const P = {
            /**
             * @param {UICell|UIBlock|(UIBlock|UICell)[]|string} targets 
             */
            to: (targets, ...args) => {
                this.emittedData = data
                const T = isArray(targets) ? targets : [targets];
                for (const target of T) dom.interface.emit(data).to(target, ...args)
                return P
            },
            /**
             * @param {(...args)} c 
             */
            map: (c) => {
                this.mappedData.set(data, c)
            }
        }
        return P
    }

    /**Use only for permanently removing the UICell */
    destroy() {
        UINodeMap.delete(this.node)
        this.unmount().off().node = null
        UIreg.remove(this.registeredKey)
    }
}

export class UIBlock extends UINode {

    /**
     * @param {HTMLElement|string} node 
     */
    constructor(node) {
        super(node)
        this.ID = ranstring(3, 1)
        this.emittedData = null
        this.receivedData = null
        this.registeredKey = UIreg.write({node: this.node, id: this.ID, type: 'block', mounted: false})
        this.attrs({'ui-block-id': this.ID})
        /**@type {Map<any, ()>}> */
            this.mappedData = new Map()
        UINodeMap.set(this.node, this)
    }

    /**
     * Appends multiple nodes, UICells and UIBlocks into this UIBlock.
     * @param {(Node|UICell|UIBlock)[]} o  
     */
    set append(o) {
        for (const h of o) {
            isNode(h) ? this.node.appendChild(h) : (cellOrBlock(h), h.mount(this))
        }
    }

    /**
     * Mounts this block to a node or UIComponent or to another UIBlock.
     * @param {Node|UIBlock|UIComponent} target 
     */
    mount(target) {
        if (target instanceof UICell || find(target)?.hasAttribute('ui-cell-id') || find(target)?.parentElement.hasAttribute('ui-cell-id')) throw new Error('A block cannot mount a cell')
        else if (isNode(target)) find(target)?.appendChild(this.node)
        UIreg.get(this.registeredKey).mounted = !0
        return this
    }

    unmount() {
        if (this.mounted) {
            removeNode(this.node)
            UIreg.get(this.registeredKey).mounted = !1
        }
        return this
    }

    /**
     * Emits data to another UICell or Block.
     * @param {*} data 
     */
    emit(data) {
        const P = {
            /**
             * @param {UICell|UIBlock|(UIBlock|UICell)[]|string} targets 
             */
            to: (targets, ...args) => {
                this.emittedData = data
                const T = isArray(targets) ? targets : [targets];
                for (const target of T) dom.interface.emit(data).to(target, ...args)
                return P
            },
            /**
             * @param {(...args)} c 
             */
            map: (c) => {
                this.mappedData.set(data, c)
            }
        }
        return P
    }

    /**Use only for permanently removing the UIBlock */
    destroy() {
        UINodeMap.delete(this.node)
        this.unmount().off().node = null
        UIreg.remove(this.registeredKey)
    }
}

export class UIComponent extends UINode {

    /**
     * @param {string|HTMLElement} node @param {HTMLElement[]} append 
     */
    constructor(node, ...append) {
        super(node)
        this.ID = ranstring(4, 1)
        for (const e of append) this.node.appendChild(e)
        this.node.setAttribute('ui-comp-id', this.ID)
        this.#sheet.base = `[ui-comp-id="${this.ID}"]`
        this.#sheet.id = this.ID
        this.registeredKey = UIreg.write({node: this.node, id: this.ID, type: 'comp', mounted: false})
        UINodeMap.set(this.node, this)
    }

    #sheet = new stylesheet

    get children() {
        return Array.from(this.node.childNodes)
    }

    /**
     * @param {{}} o 
     */
    set CSS(o) {
        this.#sheet.CSS = o
        this.#sheet.append()
    }

    /**
     * Appends multiple nodes, UICells, UIBlocks and UIComponents into this UIComponent.
     * @param {(Node|UICell|UIBlock|UIComponent)[]} o 
     */
    set append(o) {
        for (const h of o) isNode(h) ? this.node.appendChild(h) : (h instanceof UINode ? h.mount(this) : null)
    }

    /**
     * Mounts this UIComponent on to a node or to another UIComponent.
     * @param {Node|UIComponent} target 
     */
    mount(target) {
        if (cellOrBlock(target)) throw new Error(`A UIComponent cannot mount ${target}`)
        else if (target instanceof UIComponent) target.node.append(this.node)
        if (isNode(target)) find(target)?.appendChild(this.node)
        UIreg.get(this.registeredKey).mounted = !0
        return this
    }

    /**
     * Unmounts this component by removing it from the DOM and from the ActiveUIComponents registry.
     */
    unmount() {
        if (this.mounted) {
            removeNode(this.node)
            UIreg.get(this.registeredKey).mounted = !1
        }
        return this
    }

    /**
     * Removes all descendants of this node which matches n.
     * @param {string|Node} n 
     */
    remove(n) {
        if (this.contains(n)) if (isString(n)) this.findAll(n).forEach(n => this.node.removeChild(n)); else if (isNode(n)) this.node.removeChild(n)
        return this
    }

    /**
     * Updates the content of one or more descendant nodes of this UIComponent.
     * @param {"&"|string|Node} target Can be a node or a string. Can take a special character, '&' which refers to this UIComponent's root node.
     * @param {{append?: Node|Node[], content?: string, replace?: Node|Node[], render?: Boolean|[Boolean, Function]}} options 
     */
    update(target, options) {
        let nodes;
        if (target === '&') nodes = [this.node]
        else if (isNode(target)) {
            if (!this.node.contains(target)) return undefined
            else nodes = [target]
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
                    nodes.forEach(n => isArray(value) ? value.forEach(v => n.appendChild(v)) : n.appendChild(value))
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
                        else shouldRender = Boolean(value)

                        if (shouldRender) {
                            if (!parent.contains(n)) parent.appendChild(n)
                            if (callback) callback()
                        }
                        else if (parent.contains(n)) parent.removeChild(n)
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
        this.children.forEach(c => callback.call(this, c, this.children.indexOf(c), this.children))
        return this
    }

    /**
     * @param {string} ev @param {string|Node} target @param {...()} handlers 
     */
    delegate(ev, target, ...handlers) {
        if (this.contains(target)) handlers.forEach(handle => GlobalEvents.listen(ev, target, handle)) 
        return this
    }

    /**Use only for permanently removing the UIComponent. */
    destroy() {
        UINodeMap.delete(this.node)
        this.unmount().off().node = null
        this.#sheet.remove()
        UIreg.remove(this.registeredKey)
    }
}

/**
 * Returns the UI instance associated with a node or selector.
 * @param {string|Node} target 
 */
export const UIConstructorOf = target => UINodeMap.get(find(target))

/**
 * @param {UICell|UIBlock} n 
 */
export const cellOrBlock = n => (n instanceof UICell) ? !0 : (n instanceof UIBlock) ? !0 : !1

// testing
let h = new UICell('span-e');
h.style({backgroundColor: '#f9f9f9', width: '90px', height: '80px', position: 'absolute', top: '10px', left: '50%'});
h.mount(dom.body);
h.defineState('active', (a) => {a.style({backgroundColor: '#3b5998'}); console.log('hey')});
h.defineState('disable', (a) => {a.style({backgroundColor: 'pink'})})
h.on('click', () => {h.setState('active'); setTimeout(() => h.setState('disable'), 1200); console.log('blue')});