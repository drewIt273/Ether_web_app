/**
 * Instance by DrewIt
 */

import {DModule} from "./module.js"
import {useStorage} from "../assets/storageapi.js"
import {UINodeMap} from "../assets/ui-root.js"

export class Reconciler extends DModule {

    constructor(runtime) {
        super(runtime)
        this.backend = useStorage(localStorage)
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    async conjugate() {
        const v = await this.backend.get('uistates')
        for (const [p, n] of Object.entries(v)) {
            const node = this.runtime.dom.find(p), inst = node ? UINodeMap.get(node) : undefined
            if (inst) inst.setState(n)
        }
    }
}