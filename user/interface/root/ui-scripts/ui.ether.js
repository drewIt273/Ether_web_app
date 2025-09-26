/**
 * Instance by DrewIt
 * 
 * ui.ether.js
 */

import {isNode, isString, create} from "../../../../nodes/scripts/utilities/any.js";
import {div} from "../../../../nodes/scripts/nodecreator.js";

class UIComponent {

    /**
     * @param {Node|string} node 
     * @param {HTMLElement[]} append 
     */
    constructor(node, append) {
        this.Node = isString(node) ? create(node) : isNode(node) ? node : new div
    }
}