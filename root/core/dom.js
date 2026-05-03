/**
 * Instance by DrewIt
 * 
 * dom.js
 */

import {query$} from "../assets/domquery.js";
import {Registry} from "../../nodes/scripts/any.js";
import {UICell, UIBlock, UIConstructorOf as fu} from "../assets/ui-root.js";
import {DModule} from "./module.js";
import {storageapi} from "../assets/storageapi.js";

const doc = window.document;

export class DOMInterface extends DModule {

    constructor(runtime) {
        super(runtime)
        /**A registry for created nodes. */
            this.nodereg = new Registry;
        this.init = !1;
        this.ready = !1;
        this.nodes = this.nodereg.values;
        this.query = /**@param {string} a*/ a => new query$(a);
        this.root = null
        this.body = doc.body
        this.find = /**@param {string} s*/ s => this.query(s).nodes
        this.has = /**@param {Node} v*/ v => v instanceof Node && doc.contains(v)
        this.observer = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.addedNodes) for (const added of m.addedNodes) {
                    if (!this.nodereg.includesValue(added) && !(added instanceof SVGElement)) this.emit('wr').to('dom', added)
                    this.emit('r').to('events', added)
                }
                if (m.removedNodes) for (const removed of m.removedNodes) {
                    const r = this.runtime.events.ActiveListeners.find(o => o.node === removed)
                    if (r) this.emit('un').to('events', r.ev, r.node)
                    this.emit('nwr').to('dom', removed)
                }
            }
        })
        this.observer.observe(doc.body, {childList: true, subtree: true})
        this.interface = {
            emit: (data) => {
                return {
                    /**
                     * @param {UICell|UIBlock|Node|string} target 
                     */
                    to: (target, ...args) => {
                        const f = (typeof target === 'string' || target instanceof Node) ? fu(target) : target, t = f.hasAttr('ui-cell-id') || f.hasAttr('ui-block-id')
                        if (t) try {
                            f.receivedData = data
                            if (f.mappedData.has(data)) f.mappedData.get(data).call(f, ...args)
                        } catch(e) { throw new Error(`Error during emit callback for target ${f.ID}:`, e)}
                        else throw new TypeError('target must be a UICell or UIBlock')
                    },
                }
            }
        }
        this.doc = doc;
        this.emit('wr').map((...a) => a.forEach(a => this.nodereg.write(a))) ('nwr').map((...a) => a.forEach(a => this.nodereg.remove(this.nodereg.keyOf(a)))) ('fd').map(n => this.find(n))
    }

    /**
     * Prepare node registry.
     * Validate browser environment.
     * Maybe pre-create internal helpers.
     */
    async onInit() {
        if (typeof window === 'undefined') return '[DOM] not running in browser environment'  
        else this.init = !0
    }

    /**
     * Resolve the root element.
     * Clear or initialize it.
     * Prepare rendering surface.
     */
    async onReady() {
        if (!storageapi.o.has('prenodes')) storageapi.o.set('prenodes', {})
        const a = this.runtime.config.approot, r = this.doc.querySelector(a);
        if (!r) return this.ready = !1, `[DOM] root '${a}' not found`
        this.root = r
        this.nodereg.write(r, 'root')
        this.ready = !0
    }

    /**
     * Executes a callback after a given timeout ones the DOM has fully loaded.
     * @param {()} callback 
     */
    DOMLoaded(callback, timeout = 0) {
        let f = () => setTimeout(callback, timeout); (this.doc.readyState === "complete") ? f() : this.emit('ln').to('events', 'DOMContentLoaded', this.doc, f);
        return this
    }

    /**
     * @param {string} tag 
     */
    newnode(tag) {
        return tag instanceof Node ? tag : doc.createElement(tag)
    }
}
