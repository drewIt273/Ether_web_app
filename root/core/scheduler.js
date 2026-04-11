/**
 * Instance by DrewIt
 */

import {DModule} from "./module";

export class Scheduler extends DModule {

    constructor(runtime) {
        super(runtime)
        this.microQueue = new Map
        this.frameQueue = new Map
        this.microPending = !1
        this.framePending = !1
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    /**
     * @param {UINode} node
     * @param {()} job
     */
    schedule(node, job) {
        this.microQueue.set(node, job)
        if (!this.microPending) {
            this.microPending = !0
            queueMicrotask(() => this.flushMicro())
        }
    }

    flushMicro() {
        for (const [node, job] of this.microQueue) this.frameQueue.set(node, job)
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
        for (const job of this.frameQueue.values()) job()
        this.frameQueue.clear()
        this.framePending = !1
    }
}
