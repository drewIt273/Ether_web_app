/**
 * Instance by DrewIt
 */

import {Module} from "@core/module";

class NodeMessageResolver {

    #call = (n: CellOrBlock, h: HandlerList, ...args: any[]) => {
        for (const fn of h) fn.apply(n, args)
    }

    resolve(sender: CellOrBlock, receiver: CellOrBlock, data: any, ...args: any[]) {
        const hs = receiver.mappedData.get(data)
        if (hs) this.#call(receiver, hs, args)
        sender.emittedData = data
    }

    subscribe(node: CellOrBlock, key: any, ...fn: Handler[]) {
        const existing = node.mappedData.get(key)
        if (!existing) node.mappedData.set(key, [...fn])
    }

    unsubscribe(node: CellOrBlock, key: any, fn: Handler|null = null) {
        const hs = node.mappedData.get(key)
        if (hs)
            if (fn) {
                node.mappedData.set(key, hs.filter(h => h !== fn))
            }
            else node.mappedData.delete(key)
    }
}

export class DOMInterface extends Module {

    constructor() {
        super()
    }
}
