/**
 * Instance by DrewIt
 * 
 * ui.ether.js
 */

import {isNode} from "../../../../nodes/scripts/utilities/any.js";
import {div} from "../../../../nodes/scripts/nodecreator.js";

class AppUIBlock {

    /**
     * @param {ParentNode} append 
     */
    constructor (append) {
        this.Node = isNode(append) ? append : new div
    }
}
