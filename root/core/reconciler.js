/**
 * Instance by DrewIt
 */

import {DModule} from "./module.js"
import {storageapi} from "../assets/storageapi.js"
import {UINodeMap} from "../assets/ui-root.js"

export class Reconciler extends DModule {

    constructor(runtime) {
        super(runtime)
        this.backend = storageapi.o
        this.hooks = [] // Post-hydration hooks
        this.batchMode = true // Optional batching
        this.unFindNodes = []
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    /**
     * Register a hook to run after a component's state is applied
     * @param {(o: Object)} fn 
     */
    registerHook(fn) {
        if (typeof fn === 'function') this.hooks.push(fn)
    }

    async conjugate() {
        let persisted;
        try {
            persisted = await this.backend.get('uistates') || {}
        } catch(e) {
            console.warn('could not read persisted uistates', e)
            return;
        }
        const updates = []
        for (const [id, state] of Object.entries(persisted)) {
            const node = this.emit('fd').to('dom', `[ui-data-key="${id}"]`), inst = node ? UINodeMap.get(node) : undefined
            if (!inst) {
                this.unFindNodes.push(id)
                continue
            }
            if (this.batchMode) updates.push({inst, state})
            else {
                inst.setState(state)
                this.hooks.forEach(fn => fn.call(inst, inst))
            }
        }

        // Apply batch update if batching is enabled
        if (this.batchMode) for (const {inst, state} of updates) {
            inst.setState(state)
            this.hooks.forEach(fn => fn.call(inst, inst))
        }
        if (this.unFindNodes.length > 0) console.log('unfind nodes: ', this.unFindNodes);
    }
}