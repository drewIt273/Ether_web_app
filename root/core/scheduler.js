/**
 * Instance by DrewIt
 */

import {DModule} from "./module";

export class Scheduler extends DModule {

    constructor(runtime) {
        this.runtime = runtime
        this.queue = new Set
        this.pending = !1
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }
}