/**
 * Instance by DrewIt
 * 
 * state.js
 */

import {DModule} from "./module.js"

export class StateManager extends DModule {

    constructor(runtime) {
        super(runtime)
        this.init = !1
        this.ready = !1
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }
}
