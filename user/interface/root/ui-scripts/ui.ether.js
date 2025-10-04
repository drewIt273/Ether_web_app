/**
 * Instance by DrewIt
 * 
 * ui.ether.js
 */

import {isNode, isString, create, find, toKebab, setAttr, hasAttr, removeAttr, dataset, on, ranstring} from "../../../../nodes/scripts/utilities/any.js";
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
     * @param {...Node} nodes
     */
    append(...nodes) {
        nodes.forEach(n => {
            if (n instanceof Node) this.node.appendChild(n)
        })
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
     * @param {string} ev @param {string} selector @param {Function} handler 
     */
    delegate(ev, selector, handler) {
        on(ev, this.find(selector), handler)
        return this
    }
}