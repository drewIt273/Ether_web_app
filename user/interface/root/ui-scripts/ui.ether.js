/**
 * Instance by DrewIt
 * 
 * ui.ether.js
 */

import {isNode, isString, create, find, findAll, toKebab, setAttr, hasAttr, removeAttr, dataset, on, off, ranstring, strictObject, removeNode} from "../../../../nodes/scripts/utilities/any.js";
import {div} from "../../../../nodes/scripts/nodecreator.js";

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
        return this 
    }

    /**
     * Removes this node if no value is set to n. Otherwise, removes all descendants of this node which matches selector n.
     * @param {string} n 
     */
    remove(n = '') {
        if (n === "" || undefined) {
            removeNode(this.node)
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
        return (this.node.contains(find(s))) ? find(s) : null
    }

    /**
     * Returns true if other is a descendent of this.
     * @param {Node|string} other 
     */
    contains(other) {
        return isNode(other) ? this.node.contains(other) : this.node.querySelector(other) ? !0 : !1
    }

    /**
     * @param {string|Node} parent 
     */
    mount(parent) {
        (find(parent) || document.body).appendChild(this.node)
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
    class(action, ...tokens) {
        tokens.forEach(token => {
            switch (action) {
                case 'add': this.node.classList.add(token); break;
                case 'remove': this.node.classList.remove(token); break;
                case 'toggle': this.node.classList.toggle(token); break;
            }
        })
        return this
    }

    /**
     * @param {string} ev @param {string|Node} target @param {Function} handler 
     */
    delegate(ev, target, handler) {
        on(ev, target, handler)
        return this
    }

    on(ev, handler) {
        on(ev, this.node, handler)
        return this
    }
}