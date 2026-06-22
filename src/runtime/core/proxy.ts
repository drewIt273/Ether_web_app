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

    #mh: Handler | null = null

    append(r: Rune) {
        if (this.shared) this.targets.push(r)
    }

    /**
     * Sets a function to be called each time the proxy is used to send messages
     */
    onMessage(fn: (msg: ProxyMessage, sender: Rune, receiver: Rune) => void) {
        this.#mh = fn
    }

    /**
     * Sends a ProxyMessage to a target runtime (receiver, param - to) and if the receiver allows communication, returns a possible answer (ProxyMessage) from the receiver
     */
    async send(msg: ProxyMessage, to: Rune, by: Rune): Promise<ProxyMessage | undefined> {
        if (this.targets.includes(to)) {
            const o = to.proxyInterface
            if (o.allowed) {
                // Executes a function to be called (if defined using onMessage) on each use of the proxy
                    this.#mh?.call(this, msg, by, to)
                // Executes handler to be called on each received message by the receiver, if defined
                    if (o.onMessage) {
                        const a = await o.onMessage.call(to, msg)
                        if (a) {
                            if (o.resolve && o.resolve(a)) fn()
                            return a
                        }
                        else fn()
                    }
                // Execute mapped handler if any and log received msg
                    else fn()
                    function fn() {
                        const p = o.mapped
                        if (p.has(msg)) p.get(msg)?.call(to)
                        o.received.push(msg)
                    }
            }
            else throw new RuntimeProxyError(`Runtime ${to.ID} did not allowed the message to be received.`)
        }
        else throw new RuntimeProxyError(`Runtime ${to.ID} is out of reach`)
    }
}
