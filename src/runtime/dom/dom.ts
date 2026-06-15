/**
 * Instance by DrewIt
 */

import {Module} from "@core/module";

export class DOMInterface extends Module {

    constructor() {
        super()
    }
}

interface Sender {
    emittedData?: any
}
interface Receiver {
    mappedData: Map<any, HandlerList>
}

function NodeMessageResolver(sender: CellOrBlock, receiver: CellOrBlock) {
    const call = (h: HandlerList, ...args: any[]) => {
        for (const fn of h) fn.apply(receiver, args)
    }
    return {
        resolve: (data: any, ...args: any[]) => {
            const hs = receiver.mappedData.get(data)
            if (hs) call(hs, args);
            sender.emittedData = data;
        },
        subscribe: (key: any, fn: Handler) => {
            const existing = receiver.mappedData.get(key)
            if (!existing) receiver.mappedData.set(key, [fn])
        },
        unsubscribe: (key: any, fn: Handler|null = null) => {
            const hs = receiver.mappedData.get(key)
            if (hs)
                if (fn) {
                    receiver.mappedData.set(key, hs.filter(h => h !== fn))
                }
                else receiver.mappedData.delete(key)
        }
    }
}
