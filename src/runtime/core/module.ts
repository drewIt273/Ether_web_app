/**
 * Instance by DrewIt
 */

interface ModuleMessageResolver {
    resolve<K extends keyof ModulesMappedData>(sender: Module, receiver: Module, data: K, args: ModulesMappedData[K]): any
    subscribe(n: Module, key: any, fn: Handler): void
    unsubscribe(n: Module, key: any): void
}

const IMC: ModuleMessageResolver = {
    resolve(sender, receiver, data, args) {
        const fn = receiver.IMC.mappedData.get(data); let k;
        if (fn) k = fn.apply(receiver, args)
        sender.IMC.emittedData = receiver.IMC.receivedData = data
        return k
    },

    subscribe(n, key, fn) {
        n.IMC.mappedData.set(key, fn)
    },

    unsubscribe(n, key) {
        if (n.IMC.mappedData.has(key)) n.IMC.mappedData.delete(key)
    }
}

interface MsgResolverUnit {
    emittedData: any
    receivedData: any
    mappedData: Map<any, Handler>
    map: (data: any, fn: Handler) => MsgResolverUnit
    unmap: (data: any) => MsgResolverUnit
    emit<K extends keyof ModulesMappedData> (data: K, to: Module, args: ModulesMappedData[K]): any
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
            map: (data, fn: Handler) => {
                IMC.subscribe(this, data, fn)
                return this.IMC
            },
            unmap: (data) => {
                IMC.unsubscribe(this, data)
                return this.IMC
            },
            emit: (data, to: Module, args) => {
                return IMC.resolve(this, to, data, args)
            }
        }
    }

    async onInit(): Promise<any> {
        this.init = !0
    }

    async onReady(): Promise<any> {
        this.init = !0
    }
}

interface EventsModuleData {
    'ln': [keyof GlobalEvents, Node, ...((ev: Event) => void)[]]
    'un': [Node, keyof GlobalEvents | null]
    'kc': [string[], Node, Handler]
    'ku': [Node]
    're': [Node]
}

interface StatesModuleData {
    'df': [Node, string, Handler]
    'dc': [Node, string, Handler]
    'set': [Node, string, {schedule: boolean}]
}

interface MotionModuleData {
    'anim': [Node, MotionFrame[] | null, UiMotionOptions]
}

type ModulesMappedData = EventsModuleData & StatesModuleData & MotionModuleData