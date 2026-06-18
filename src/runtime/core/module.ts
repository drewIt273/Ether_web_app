/**
 * Instance by DrewIt
 */

interface ModuleMessageResolver {
    resolve(sender: Module, receiver: Module, data: any, ...args: any[]): void
    subscribe(n: Module, key: any, ...fn: Handler[]): void
    unsubscribe(n: Module, key: any, fn?: Handler|null): void
}

function call(n: Module, h: HandlerList, ...args: any[]) {
    for (const fn of h) fn.apply(n, args)
}

const IMC: ModuleMessageResolver = {
    resolve(sender: Module, receiver: Module, data: any, ...args: any[]) {
        const hs = receiver.mappedData.get(data)
        if (hs) call(receiver, hs, ...args)
        sender.emittedData = data
    },
    subscribe(n: Module, key: any, ...fn: Handler[]) {
        const existing = n.mappedData.get(key)
        if (!existing) n.mappedData.set(key, [...fn])
        else existing.push(...fn)
    },
    unsubscribe(n: Module, key: any, fn: Handler|null = null) {
        const hs = n.mappedData.get(key)
        if (hs)
            if (fn) {
                n.mappedData.set(key, hs.filter(h => h !== fn))
            }
            else n.mappedData.delete(key)
    }
}

export class Module {

    init: boolean
    ready: boolean
    sentData: any
    receivedData: any
    emittedData: any
    mappedData: Map<any, HandlerList>
    rune: Rune
    constructor(r: Rune) {
        this.rune = r
        this.init = !1
        this.ready = !1
        this.mappedData = new Map
    }

    emit(data: any) {
        const o = {
            to: (n: Module) => {
                IMC.resolve(this, n, data)
                return o
            },
            /**
             * Returns emit.map for continues mapping
             */
            map: (...fn: HandlerList) => {
                IMC.subscribe(this, data, ...fn)
                return o.map
            },
            unmap: (fn: Handler|null) => {
                IMC.unsubscribe(this, data, fn)
                return o
            }
        }
        return o
    }
}