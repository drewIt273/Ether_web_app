/**
 * Instance by DrewIt
 */

export class Scheduler {

    constructor() {
        this.microQueue = new Map
        this.frameQueue = new Map
        this.microPending = !1
        this.framePending = !1
        this.isFlushing = !1
    }

    /**
     * @param {UINode} node
     * @param {()} job
     */
    schedule(node, job) {
        if (this.isFlushing) {
            this.microQueue.set(node, job)
            return
        }
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
        this.isFlushing = !0
        for (const job of this.frameQueue.values()) job()
        this.frameQueue.clear()
        this.isFlushing = !1
        this.framePending = !1
    }
}
