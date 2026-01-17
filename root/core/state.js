/**
 * Instance by DrewIt
 * 
 * state.js
 */

import {UINode} from "../assets/ui-root.js"
import {DModule} from "./module.js"

export class StateManager extends DModule {

    constructor(runtime) {
        super(runtime)
        this.init = !1
        this.ready = !1
        /**@type {WeakMap<Node, {}>} */
        this.reg = new WeakMap()
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }
}
