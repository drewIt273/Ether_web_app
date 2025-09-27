/**
 * Instance by DrewIt
 * 
 * ui.ether.js
 */

import {isNode, isString, create, find} from "../../../../nodes/scripts/utilities/any.js";
import {div} from "../../../../nodes/scripts/nodecreator.js";

class UIComponent {

    /**
     * @param {string|Element} node 
     * @param {HTMLElement[]} append 
     */
    constructor(node, append = []) {
        this.node = isString(node) ? create(node) : isNode(node) ? node : new div
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
     * @param {Function} callback 
     */
    forEach(callback) {
        this.children.forEach(callback)
        return this
    }

    /**
     * @param {string} s 
     */
    find(s) {
        return isString(s) ? this.node.querySelector(s) : null
    }

    mount(parent) {
        (find(parent) || document.body).appendChild(this.node)
        return this
    }
}