/**
 * Instance by DrewIt
 */

import {DModule} from "./module.js"

export class Reconciler extends DModule {

    constructor(runtime) {
        super(runtime)
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }
}