/**
 * Instance by DrewIt
 * 
 * dom.js
 */

import {jsx} from "../assets/nodecreator.js";
import {query$} from "../assets/domquery.js";
import {isString, Registry} from "../../nodes/scripts/any.js";
import {UICell as cell, UIBlock as block, UIComponent as comp, UIConstructorOf as fu} from "../assets/ui-root.js";

const doc = window.document;

export class dom_module {

    constructor(/**@type {kernel}*/ runtime) {
        /** Reference to the kernel for hooks, module communication, etc. */
            this.runtime = runtime;
        /** A registry for created nodes. */
            this.nodereg = new Registry;
        this.init = !1;
        this.ready = !1;
        this.nodes = this.nodereg.values;
        this.query = /**@param {string} a*/ a => new query$(a);
        this.root = this.query('#lazy-app').nodes[0]
        this.body = doc.body
        this.find = /**@param {string} s*/ s => {const h = this.query(s); return h.count() === 1 ? h.first() : h.nodes}
        this.has = /**@param {Node} v*/ v => v instanceof Node && doc.contains(v)
        this.observer = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.addedNodes) for (const added of m.addedNodes) if (!this.nodereg.includesValue(added) && !(added instanceof SVGElement)) this.nodereg.write(added)
                if (m.removedNodes) for (const removed of m.removedNodes) this.nodereg.remove(this.nodereg.keyOf(removed))
            }
        })
        this.observer.observe(doc.body, {childList: true, subtree: true})
        this.interface = {
            emit: (data) => {
                return {
                    /**
                     * @param {cell|block|string} target 
                     * @param {(target: cell|block, data?: *)} callback
                     */
                    to: (target, callback = () => {}) => {
                        const f = isString(target) ? fu(target) : target, t = f.hasAttr('ui-cell-id') || f.hasAttr('ui-block-id')
                        if (t) {
                            if (typeof callback === 'function') try {if (f.mappedData.has(data)) {f.mappedData.get(data).call(f, f, data)}; callback.call(f, f, data); f.receivedData = data} catch(err) {console.error(`Error during emit callback for target ${f.ID}:`, err);}
                        }
                        else throw new TypeError('target must be a UICell or UIBlock')
                    }
                }
            }
        }
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
    jsx(tag, props = {}, type = 'ui-cell') {
        const node = jsx(tag, props)
        return type === 'ui-block' ? new block(node) : type === 'ui-comp' ? new comp(node) : new cell(node)
    }
}
