/**
 * Instance by DrewIt
 */

export class Scheduler {

    microQueue: Set<Handler>
    frameQueue: Set<Handler>
    microPending: boolean
    framePending: boolean
    isFlushing: boolean
    constructor() {
        this.microQueue = new Set()
        this.frameQueue = new Set()
        this.microPending = !1
        this.framePending = !1
        this.isFlushing = !1
    }

    schedule(job: Handler) {
        this.microQueue.add(job)
        if (this.isFlushing) return;
        if (!this.microPending) {
            this.microPending = !0
            queueMicrotask(() => this.flushMicro())
        }
    }

    flushMicro() {
        for (const job of this.microQueue.values()) this.frameQueue.add(job)
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
        this.isFlushing = !0
        for (const job of this.frameQueue.values()) job()
        this.frameQueue.clear()
        this.isFlushing = !1
        this.framePending = !1
    }
}