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

    target: Rune
    constructor(target: Rune) {
        this.target = target
        this.target.proxies.push(this)
        RuneProxies.log(this)
    }

    #mh: MessageHandler | null = null

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
