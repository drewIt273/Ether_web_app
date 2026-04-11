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
        this.emit('sch').map(f => this.schedule(f))
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    /**
     * @param {()} job
     */
    schedule(job) {
        this.microQueue.add(job)
        if (!this.microPending) {
            this.microPending = !0
            queueMicrotask(() => this.flushMicro())
        }
    }

    flushMicro() {
        for (const job of this.microQueue) this.frameQueue.add(job)
        this.microQueue.clear()
        this.microPending = !1
        this.scheduleFrame()
    }

    scheduleFrame() {
        if (this.framePending) return;
        this.framePending = !0
        requestAnimationFrame(() => this.flushFrame())
    }

    flushFrame() {
        for (const job of this.frameQueue) job()
        this.frameQueue.clear()
        this.framePending = !1
    }
}
