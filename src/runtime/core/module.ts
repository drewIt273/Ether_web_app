/**
 * Instance by DrewIt
 */

interface ModuleMessageResolver {
    resolve<K extends keyof ModulesMappedData>(sender: Module, receiver: Module, data: K, args: ModulesMappedData[K]): void
    subscribe(n: Module, key: any, ...fn: Handler[]): void
    unsubscribe(n: Module, key: any, fn?: Handler|null): void
}

const IMC: ModuleMessageResolver = {
    resolve(sender, receiver, data, args) {
        const hs = receiver.IMC.mappedData.get(data)
        if (hs) for (const fn of hs) fn.apply(receiver, args)
        sender.IMC.emittedData = receiver.IMC.receivedData = data
    },

    subscribe(n, key, ...fn) {
        const existing = n.IMC.mappedData.get(key)
        if (!existing) n.IMC.mappedData.set(key, [...fn])
        else existing.push(...fn)
    },

    unsubscribe(n, key, fn: Handler|null = null) {
        const hs = n.IMC.mappedData.get(key)
        if (hs)
            if (fn) {
                n.IMC.mappedData.set(key, hs.filter(h => h !== fn))
            }
            else n.IMC.mappedData.delete(key)
    }
}

interface MsgResolverUnit {
    emittedData: any
    receivedData: any
    mappedData: Map<any, HandlerList>
    map: (data: any, ...fn: HandlerList) => MsgResolverUnit
    unmap: (data: any, fn?: Handler | null) => MsgResolverUnit
    emit<K extends keyof ModulesMappedData> (data: K, to: Module, args: ModulesMappedData[K]): MsgResolverUnit
}

export class Module {

    readonly IMC: MsgResolverUnit
    init: boolean
    ready: boolean
    rune: Rune
    constructor(r: Rune) {
        this.rune = r
        this.init = !1
        this.ready = !1
        this.IMC = {
            mappedData: new Map(),
            receivedData: null,
            emittedData: null,
            map: (data, ...fn: Handler[]) => {
                IMC.subscribe(this, data, ...fn)
                return this.IMC
            },
            unmap: (data, fn: Handler | null = null) => {
                IMC.unsubscribe(this, data, fn)
                return this.IMC
            },
            emit: (data, to: Module, args) => {
                IMC.resolve(this, to, data, args)
                return this.IMC
            }
        }
    }
}

interface EventsModuleData {
    'ln': [keyof DocumentEventMap, Node, ((ev: Event) => void)[]]
    'un': [Node, keyof DocumentEventMap | null]
    'kc': [string[], Node, Handler]
}

type ModulesMappedData = EventsModuleData