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
}