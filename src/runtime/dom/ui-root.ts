/**
 * Instance by DrewIt
 */

import {ranstring, toKebab} from "@assets/any"; import {DOMInterfaceError} from "@core/error";

export const NodeKeys = new Set<string>()
export const EventMap = new WeakMap<Node, {ev: keyof GlobalEvents, fn: Handler}>()
export const StatesMap = new WeakMap<Node, string>()
export const UiDependencyMap = new WeakMap<Node, Array<{node: Node, fn: (data: any) => any}>>()

interface NodeMeta {
    belongsTo: DOMInterface
    onEventMap: Map<keyof GlobalEvents, ((ev?: Event) => void)[]>
    unEventSet: Set<keyof GlobalEvents>
    backStates: Map<string, {type: 'static' | 'computed', fn: Handler}>
    readonly This: UINode
}

type nodefn<K extends unknown> = ($: HTMLElement) => K

type FiberHandlers = {
    [K in keyof GlobalEvents as `on${string & K}`]?: (node: Node, event?: GlobalEvents[K]) => void
}

interface Fiber extends FiberHandlers {
    type?: NodeMetaTag
    id?: string
    uikey?: string
    style?: Partial<Record<keyof CSSStyleProperties, any>>
    class?: string
    innerHTML?: string
    append?: (nodefn<Node> | string | Node)[]
    states?: Record<string, Handler>
    [x: string]: any
}

const DepObject = {
    notifyDependents(node: Node, data: any) {
        UiDependencyMap.get(node)?.forEach(o => {
            o.fn.call(node, data)
        })
    },
    define(node: Node) {
        UiDependencyMap.set(node, [])
    },
    has(node: Node) {
        return UiDependencyMap.has(node)
    },
    get(node: Node) {
        return UiDependencyMap.get(node)
    },
    add(target: Node, o: {node: Node, fn: (data: any) => any}) {
        this.get(target)?.push(o)
    },
    remove(node: Node) {
        UiDependencyMap.delete(node)
    }
}

const META = Symbol('NodeMeta'), RUNE = Symbol('Rune')

export async function NodeMetaDataInit() {
    Object.defineProperty(Node.prototype, '$', {
        get() {
            if (!this[META]) {
                const o = nm.apply(this, this)
                this[META] = o // @ts-expect-error
                o.node = this
            }
            return this[META];
        },
        configurable: true,
        enumerable: false
    })
    Object.defineProperty(Node.prototype, 'rune', {
        get() {
            if (!this[RUNE]) {
                this[RUNE] = {
                    id: '',
                    isRuneRoot: false
                }
            }
            return this[RUNE]
        },
        configurable: true,
        enumerable: false
    }),
    Object.defineProperty(window, 'jsx', {
        get() {
            return jsx
        },
        configurable: false,
        enumerable: false,
    })
}

function nm(o: HTMLElement): NodeMetaData {
    const SRC = Symbol('src'), c: NodeMetaData = {
        ID: ranstring(5, 1),
        tag: 'node',
        node: o,
        prop: {},
        ofn: null,
        onevent: new Map(),
        prevstate: null,
        currentstate: null,
        pendingStates: new Map(),
        emittedData: null,
        receivedData: null,
        mappedData: new Map(),
        get mounted() {
            return (this.node.isConnected && this.node.parentNode && this.node.$.belongsTo) ? true : false
        },
        set belongsTo(o: DOMInterface) { // @ts-expect-error
            if (!this[SRC].dom) this[SRC].dom = o
            else throw new DOMInterfaceError(`Node ${this.node} already belongs to a Rune instance and cannot be reset`)
        },
        get belongsTo() { // @ts-expect-error
            return this[SRC].dom
        },
        set onStateChange(fn: Handler) { // @ts-expect-error
            this[SRC].ofn = fn
        },
        get onStateChange() { // @ts-expect-error
            return this[SRC].ofn
        },
        map(data, ...fns) {
            this.belongsTo?.nodeMsg.subscribe(this.node, data, ...fns)
        },
        unmap(data, fn: Handler | null = null) {
            this.belongsTo?.nodeMsg.unsubscribe(this.node, data, fn)
        },
        emit(data, to, ...args: any[]) {
            const n = typeof to === 'string' ? Array.from(document.body.childNodes).find(v => v.$.uikey === to) : to
            if (n) this.belongsTo?.nodeMsg.resolve(this.node, n, data, ...args)
        },
        find(n: string) {
            return (this.node as Element).querySelector(n)
        },
        findAll(n: string) {
            return Array.from((this.node as Element).querySelectorAll(n))
        },
        dependsOn(sourceNode, fn) {
            if (!DepObject.has(sourceNode)) DepObject.define(sourceNode)
            DepObject.add(sourceNode, {node: this.node, fn: fn})
        },
        on(ev: keyof GlobalEvents, ...calls: ((ev?: Event) => any)[]) {
            if (this.belongsTo) this.belongsTo.GlobalEvents.onEvent(ev, this.node, ...calls)
            else this.onevent.has(ev) ? this.onevent.get(ev)?.push(...calls) : this.onevent.set(ev, [...calls])
        },
        off(ev: keyof GlobalEvents | null = null) {
            this.belongsTo?.GlobalEvents.unEvent(this.node, ev)
        },
        keycall(keys: string[], fn: Handler) {
            this.belongsTo?.GlobalEvents.keyEvent(this.node, keys, fn)
        },
        unbindkeys() {
            this.belongsTo?.GlobalEvents.unKey(this.node)
        },
        defineState(state: string, call: Handler = () => {}) {
            const b = this.belongsTo, a = this.pendingStates, v = a.get(state)
            if (b) {
                if (v && v.type === 'static') b.GlobalStates.defineState(this.node, state, () => {v.fn.apply(this.node), call.apply(this.node)}), a.delete(state)
                else b.GlobalStates.defineState(this.node, state, call)
            }
            else a.set(state, {type: 'static', fn: call})
            return (state: string, call: Handler = () => {}) => this.defineState.call(this.node, state, call)
        },
        defineComputedState(state: string, call: Handler = () => {}) {
            const b = this.belongsTo, a = this.pendingStates, v = a.get(state)
            if (b) {
                if (v && v.type === 'computed') b.GlobalStates.defineCompute(this.node, state, () => {v.fn.apply(this.node), call.apply(this.node)}), a.delete(state)
                else b.GlobalStates.defineCompute(this.node, state, call)
            }
            else a.set(state, {type: 'computed', fn: call})
            return (state: string, call: Handler = () => {}) => this.defineComputedState.call(this.node, state, call)
        },
        setState(state: string, opts = {schedule: false}) {
            if (this.belongsTo) {
                this.prevstate = this.node.$.currentstate as string
                this.belongsTo.GlobalStates.setState(this.node, state, opts)
                this.ofn?.call(this.node)
            }
            else this.pendingStates.set(state, state)
        },
        hasDefinedState(s) {
            return this.belongsTo?.GlobalStates.hasState(this.node, s) as boolean
        },
    } // @ts-expect-error
    c[SRC] = {}; return c
}

const SVG_NAMESPACE = `http://www.w3.org/2000/svg`;
const SVG_TAGS = new Set(["svg", "g", "rect", "path", "circle", "line", "polyline", "polygon", "ellipse", "text", "defs", "use", "mask", "clipPath", "linearGradient", "radialGradient", "stop"]);

var jsx = <K extends HTMLTagName>(n: K, o: Fiber): UiElementInterfaceMap[K] => {
    const node = SVG_TAGS.has(n) ? document.createElementNS(SVG_NAMESPACE, n) : document.createElement(n); concat(node, o)
    return node as UiElementInterfaceMap[K]
}

function concat(n: HTMLElement | SVGElement, o: Fiber) {
    const p = new Set(['tag', 'type', 'uikey']), j: Record<string, any> = {}
    for (const [k, v] of Object.entries(o)) {
        if (k === 'append') {
            v.forEach((a: Node | string | nodefn<Node>) => {
                typeof a === 'function' ? n.appendChild(a((n as HTMLElement))) : n.append(a)
            })
            continue;
        }
        if (k.startsWith('on')) { // @ts-expect-error
            n.$.on(k.slice(2), () => v.call(n, n))
            continue;
        }
        if (k === 'uikey') {
            if (!NodeKeys.has(v)) n.$.uikey = v, NodeKeys.add(v), n.setAttribute('node-key', v)
            else throw new Error(`An existing node already has the uikey ${v}`)
            continue;
        }
        if (k === 'states') {
            for (const [k, fn] of Object.entries(v)) {
                n.$.on('append', () => n.$.defineState(k, fn as Handler))
            }
            continue;
        }
        if (k === 'innerHTML') {
            n.innerHTML = v
            continue;
        }
        if (k === 'style') {
            for (const [k, a] of Object.entries(v)) { // @ts-expect-error
                n.style[k] = a
            }
            continue;
        }
        if (k.startsWith('$')) {
            let s = k.replace('$', ''), j = o[k]
            Object.defineProperty(n.$.prop, s, {
                get() {
                    return j
                },
                set(v) {
                    j = v, DepObject.notifyDependents(n, v)
                },
                configurable: true,
                enumerable: false
            })
            continue;
        }
        if (casiveAttrs.has(k)) {
            n.setAttribute(k, v)
        }
        else if (!p.has(k)) {
            n.setAttribute(toKebab(k), v)
        }
    }
}

class UINode {

    readonly node: HTMLElement
    meta: NodeMeta
    constructor(o: Fiber) {
        this.node = document.createElement(o.tag)
        this.node.$.tag = o.type ?? 'node' // @ts-expect-error
        this.node.$.uinode = this
        this.meta = {
            onEventMap: new Map(),
            unEventSet: new Set(),
            backStates: new Map(),
            set belongsTo(o: DOMInterface) {
                if (!this.This.node.$.belongsTo) this.This.node.$.belongsTo = o
                else throw new DOMInterfaceError(`UINode ${this.This.node} already belongs to a Rune instance and cannot be reset`)
            },
            get belongsTo() {
                const o = this.This.node.$.belongsTo
                if (o) return o
                else throw new DOMInterfaceError(`UINode ${this.This.node} belongs to no Rune instance`)
            },
            This: this
        }
        this.node.rune = {
            id: '',
            isRuneRoot: false
        }
        concat(this.node, o)
        if (o.uikey) this.UIKey = o.uikey
    }

    get key() {
        return this.node.$.uikey
    }

    set UIKey(s: string) {
        if (!NodeKeys.has(s)) this.node.$.uikey = s, NodeKeys.add(s)
        else throw new Error(`An existing node already have the uikey ${s}`)
    }

    get parent() {
        return this.node.parentNode
    }

    get childNodes() {
        return Array.from(this.node.childNodes)
    }

    get mounted() {
        return this.node.isConnected
    }

    #p: {
        curr?: string
        prev?: string
        ofn?: Handler
    } = {}

    get currentstate() {
        return this.#p.curr
    }

    get prevstate() {
        return this.#p.prev
    }

    attrs(o: Record<string, string>) {
        for (const [k, v] of Object.entries(o)) this.node.setAttribute(toKebab(k), String(v))
        return this
    }

    style(o: Record<string, any>) {
        for (const [k, v] of Object.entries(o)) Object.assign(this.node.style, {[toKebab(k)]: v})
        return this
    }

    findAll(n: string) {
        return Array.from(this.node.querySelectorAll(n))
    }

    find(n: string) {
        return this.node.querySelector(n) as HTMLElement
    }

    unmount() {
        if (this.mounted) this.node.parentElement?.removeChild(this.node)
    }

    on(ev: keyof GlobalEvents, ...calls: ((ev?: Event) => void)[]) {
        const o = this.meta
        if (o.belongsTo) o.belongsTo.GlobalEvents.onEvent(ev, this.node, ...calls)
        else o.onEventMap.set(ev, calls)
    }

    delegate(target: Node | string, ev: keyof GlobalEvents, ...calls: ((ev?: Event) => void)[]) {
        const n = (target instanceof Node && this.node.contains(target)) ? target : this.find(target as string)
        if (n) this.meta.belongsTo?.GlobalEvents.onEvent(ev, n, ...calls)
    }

    off(ev: keyof GlobalEvents | null = null) {
        const o = this.meta
        if (o.belongsTo) o.belongsTo.GlobalEvents.unEvent(this.node, ev)
        else if (ev) o.unEventSet.add(ev)
    }

    keycall(keys: string[], fn: (ev: Event) => void) {
        this.meta.belongsTo?.GlobalEvents.keyEvent(this.node, keys, fn)
    }

    unbindKeys() {
        this.meta.belongsTo?.GlobalEvents.unKey(this.node)
    }

    defineState(state: string, call: Handler = () => {}) {
        const o = this.meta.belongsTo, a = this.meta.backStates, v = a.get(state)
        if (o) {
            if (v && v.type === 'static') o.GlobalStates.defineState(this.node, state, () => {v.fn.apply(this), call.apply(this)}), a.delete(state)
            else o.GlobalStates.defineState(this.node, state, call)
        }
        else a.set(state, {type: 'static', fn: call})
        return (state: string, call: Handler = () => {}) => this.defineState.call(this, state, call)
    }

    defineComputedState(state: string, call: Handler = () => {}) {
        const o = this.meta.belongsTo, a = this.meta.backStates, v = a.get(state)
        if (o) {
            if (v && v.type === 'computed') o.GlobalStates.defineCompute(this.node, state, () => {v.fn.apply(this), call.apply(this)}), a.delete(state)
            else o.GlobalStates.defineCompute(this.node, state, call)
        }
        else a.set(state, {type: 'computed', fn: call})
        return this.defineComputedState
    }

    setState(state: string, opts = {schedule: false}) {
        const o = this.meta
        this.#p.prev = this.node.getAttribute('data-state') ?? ''
        if (o.belongsTo) {
            o.belongsTo.GlobalStates.setState(this.node, state, opts)
            this.#p.curr = state
            this.#p.ofn?.call(this)
        }
        else StatesMap.set(this.node, state)
    }

    hasDefinedState(state: string) {
        return this.meta.belongsTo?.GlobalStates.hasState(this.node, state)
    }

    onStateChange(fn: Handler) {
        this.#p.ofn = fn
    }
}

const casiveAttrs = new Set(['viewBox'])

export type U = UINode; export type F = Fiber; export {jsx}