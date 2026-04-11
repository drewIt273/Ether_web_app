/**
 * Instance by DrewIt
 */

import {DModule} from "./module";

export class Scheduler extends DModule {

    constructor(runtime) {
        this.runtime = runtime
        this.microQueue = new Set
        this.frameQueue = new Set
        this.microPending = !1
        this.framePending = !1
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }
}