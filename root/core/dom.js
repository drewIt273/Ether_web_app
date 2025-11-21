/**
 * Instance by DrewIt
 * 
 * dom.js
 */

import {jsx} from "../../nodes/scripts/nodecreator.js";

class dom_module {

    /**@param {Kernel} runtime */
    constructor(runtime) {
        /** Reference to the kernel for hooks, module communication, etc. */
            this.runtime = runtime;
        this.newnode = jsx;
        this.init = !1;
        this.ready = !1;
        this.nodes = new Map();
        this.root = null
    }
}

export const dom = dom_module;