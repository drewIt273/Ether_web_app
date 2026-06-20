/**
 * Instance by DrewIt
 */

import { ArrayLogLock } from "@assets/registry";
import { RuntimeProxyError } from "./error";

type ProxyMessageType = 'request' | 'nodeMsg' | 'rejected' | undefined

export type MessageHandler = (msg: ProxyMessage) => null | Promise<ProxyMessage>

export interface ProxyMessage {
    type: ProxyMessageType
    msg: any
}

export const RuneProxies: ArrayLogLock<RuntimeProxy> = new ArrayLogLock()

export class RuntimeProxy {

    targets: Rune[]
    shared: boolean
    constructor(...targets: Rune[]) {
        this.targets = targets
        this.shared = targets.length > 2 ? true : false
    }

    #mh: MessageHandler | null = null

    push(r: Rune) {
        if (!this.targets.includes(r)) this.targets.push(r)
    }

    append(r: Rune) {
        if (this.shared) this.targets.push(r)
    }

    /**
     * Sets a function to be called each time the proxy is used to send messages
     */
    onMessage(fn: MessageHandler) {
        this.#mh = fn
    }

    send(msg: ProxyMessage) {
        const o = this.target.proxyInterface
        if (o.allowed) {
            // Executes a function to be called (if defined using onMessage) on each use of the proxy
                if (this.#mh) this.#mh.call(this.target, msg)
            const p = o.mappedBehavior
            if (o.onMessage) o.onMessage.call(this.target, msg)
            if (p.has(msg)) p.get(msg)?.call(this.target)
            o.received.push(msg)
        }
        else throw new RuntimeProxyError(`${this.target} did not allowed the message to be received.`)
    }
}
