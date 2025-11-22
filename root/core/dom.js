/**
 * Instance by DrewIt
 * 
 * dom.js
 */

import {jsx} from "../../nodes/scripts/nodecreator.js";
import {query$} from "./assets/domquery.js";
import {Registry} from "../../nodes/scripts/utilities/any.js";

class dom_module {

    /**@param {Kernel} runtime */
    constructor(runtime) {
        /** Reference to the kernel for hooks, module communication, etc. */
            this.runtime = runtime;
        this.newnode = jsx;
        this.init = !1;
        this.ready = !1;
        this.nodes = this.#nodereg.reg;
        this.query = a => new query$(a);
        this.root = null
    }

    /**
     * Prepare node registry.
     * Validate browser environment.
     * Maybe pre-create internal helpers.
     */
    async onInit() {
        if (typeof window === 'undefined') throw new Error("[DOM] Not running in browser environment.");
        this.doc = window.document;
        this.init = !0
    }

    /**
     * Resolve the root element.
     * Clear or initialize it.
     * Prepare rendering surface.
     */
    async onReady() {
        const a = this.runtime?.config.root || 'lazy-app', r = this.doc.querySelector(a);
        if (!r) throw new Error(`[DOM] root '${a}' not found`)
        this.root = r
        this.#nodereg.write(r, 'root')
        this.ready = !0
    }

    #nodereg = new Registry
}

export const dom = dom_module;