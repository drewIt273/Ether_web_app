/**
 * Instance by DrewIt
 * 
 * dom.js
 */

import {jsx} from "./assets/nodecreator.js";
import {query$} from "./assets/domquery.js";
import {Registry} from "../../nodes/scripts/utilities/any.js";
import {UICell as cell, UIBlock as block, UIComponent as comp} from "./assets/ui-root.js";

const doc = window.document;

class dom_module {

    constructor(/**@type {kernel}*/ runtime) {
        /** Reference to the kernel for hooks, module communication, etc. */
            this.runtime = runtime;
        /** A registry for created nodes. */
            this.nodereg = new Registry;
        this.init = !1;
        this.ready = !1;
        this.nodes = this.nodereg.reg;
        this.query = /**@param {string} a*/ a  => new query$(a);
        this.root = doc
        this.find = /**@param {string} s*/ s => this.query(s).first()
        this.findAll = /**@param {string} s*/ s => this.query(s).nodes
        this.has = /**@param {Node} v*/ v => v instanceof Node && doc.contains(v)
    }

    /**
     * Prepare node registry.
     * Validate browser environment.
     * Maybe pre-create internal helpers.
     */
    async onInit() {
        if (typeof window === 'undefined') throw new Error("[DOM] Not running in browser environment.");
        this.doc = doc;
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
        this.nodereg.write(r, 'root')
        this.ready = !0
    }

    /**
     * @param {string} tag 
     * @param {{class: string; id: string; style: {} | string; innerHTML: string; textContent: string; append: Node[]; on: (e: Node) => any; attrs: {};}} props 
     * @param {"ui-cell"|"ui-block"|"ui-comp"} type 
     */
    jsx(tag, props, type) {
        const node = jsx(tag, props)
        this.nodereg.write(node)
        return type === 'ui-block' ? new block(node) : type === 'ui-comp' ? new comp(node) : new cell(node)
    }
}

export const dom = dom_module;