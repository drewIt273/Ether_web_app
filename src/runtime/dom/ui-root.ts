/**
 * Instance by DrewIt
 */

import {ranstring, toKebab} from "@assets/any";
import {DOMInterfaceError} from "@core/error";
import {RuneInstancesLog} from "@core/rune";

export const UINodeMap = new WeakMap<Node, UINode>()
export const NodeKeys = new Set<string>()
export const EventMap = new WeakMap<Node, {ev: keyof GlobalEvents, fn: Handler}>()
export const StatesMap = new WeakMap<Node, string>()

interface NodeMeta {
    belongsTo: DOMInterface
    onEventMap: Map<keyof GlobalEvents, ((ev?: Event) => void)[]>
    unEventSet: Set<keyof GlobalEvents>
    backStates: Map<string, {type: 'static' | 'computed', fn: Handler}>
    readonly This: UINode
}

interface NodeJSX<K extends unknown> {
    tag?: keyof HTMLElementTagNameMap
    id?: string
    attrs?: Record<string, unknown>
    className?: string
    textContent?: string
    style?: Partial<Record<keyof CSSStyleProperties, any>>
    append?: K[]
    UIKey?: string
    on?: [keyof DocumentEventMap, ...Handler[]]
    innerHTML?: string
}

type nodefn<K extends unknown> = ($: HTMLElement) => K

interface Fiber {
    tag: keyof HTMLElementTagNameMap
    type?: NodeMetaTag
    id?: string
    uikey?: string
    style?: Partial<Record<keyof CSSStyleProperties, any>>
    className?: string
    append?: (nodefn<Node | UINode>)[]
    [x: string]: any
}

const META = Symbol('NodeMeta')

export function NodeMetaDataInit() {
    Object.defineProperty(Node.prototype, '$', {
        get() {
            if (!this[META]) {
                this[META] = {tag: 'node', uikey: 'node', prop: {}}
            }
            return this[META];
        },
        set(v) {
            if (typeof v === 'object' && v !== null) {
                this[META] = v;
            }
        },
        configurable: true,
        enumerable: false
    })
}

var jsxs = (o: Fiber) => {
    return o.type === 'uicell' ? new UICell(o) : o.type === 'uiblock' ? new UIBlock(o) : o.type === 'uicomp' ? new UIComponent(o) : new UINode(o)
}

class UINode {

    readonly node: HTMLElement
    meta: NodeMeta
    constructor(o: Fiber) {
        this.node = o.tag ? document.createElement(o.tag) : document.createElement('div')
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
        const p = new Set(['tag', 'type', 'uikey'])
        for (const [k, v] of Object.entries(o)) {
            if (k === 'className') this.node.className = v
            else if (k.startsWith('$')) this.node.$.prop[k.replace('$', '')] = v
            else if (casiveAttrs.has(k)) this.node.setAttribute(k, v)
            else if (!p.has(k)) this.node.setAttribute(toKebab(k), v)
        }
    }

    get key() {
        return this.node.$.uikey
    }

    set UIKey(s: string) {
        if (!NodeKeys.has(s)) this.node.$.uikey = s, NodeKeys.add(s)
        else throw new Error(`An existing node already have the node-key ${s}`)
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

export class UICell extends UINode {

    readonly ID: string
    emittedData: any
    receivedData: any
    mappedData: Map<any, HandlerList>
    constructor(o: Fiber) {
        super(o)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-cell': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
        jsx(o, this.node)
    }

    mount(n: Node|UIBlock|UIComponent) {
        n instanceof Node ? n.appendChild(this.node) : n.node.append(this.node)
    }
    
    emit(data: any) {
        const k = this.meta.belongsTo
        return {
            to: (target: CellOrBlock, ...args: any[]) => {
                if (k) k.nodeMsg.resolve(this, target, data, ...args)
            },
            map: (...fn: Handler[]) => {
                if (k) k.nodeMsg.subscribe(this, data, ...fn)
            },
            unmap: (fn: Handler) => {
                if (k) k.nodeMsg.unsubscribe(this, data, fn)
            }
        }
    }
}

export class UIBlock extends UINode {

    readonly ID: string
    emittedData: any
    receivedData: any
    mappedData: Map<any, HandlerList>
    constructor(o: Fiber) {
        super(o)
        this.ID = ranstring(3, 1)
        this.attrs({'ui-block': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
        jsx(o, this.node)
    }

    get childCells() {
        return childCells(this)
    }

    mount(n: UIComponent|Node) {
        n instanceof Node ? n.appendChild(this.node) : n.node.append(this.node)
    }

    emit(data: any) {
        const k = this.meta.belongsTo
        return {
            to: (target: CellOrBlock, ...args: any[]) => {
                if (k) k.nodeMsg.resolve(this, target, data, ...args)
            },
            map: (...fn: Handler[]) => {
                if (k) k.nodeMsg.subscribe(this, data, ...fn)
            },
            unmap: (fn: Handler) => {
                if (k) k.nodeMsg.unsubscribe(this, data, fn)
            }
        }
    }
}

export class UIComponent extends UINode {

    readonly ID: string
    constructor(o: Fiber) {
        super(o)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-comp': this.ID})
        UINodeMap.set(this.node, this)
        this.node.rune = {id: 'node', isRuneRoot: false}, console.log(this.node.rune)
        this.#o = () => jsx(o, this.node)
    }

    #o;

    get childBlocks() {
        return childBlocks(this)
    }

    get childCells() {
        return childCells(this)
    }

    mount(n: Node) {
        n.appendChild(this.node)
    }

    init() {
        this.#o()
    }
}

function childCells(n: UINode) {
    const k: UICell[] = []
    n.childNodes.forEach(n => {
        const o = UINodeMap.get(n)
        if (o && o instanceof UICell) k.push(o)
    })
    return k
}

function childBlocks(n: UINode) {
    const k: UIBlock[] = []
    n.childNodes.forEach(n => {
        const o = UINodeMap.get(n)
        if (o && o instanceof UIBlock) k.push(o)
    })
    return k
}

const casiveAttrs = new Set(['viewBox'])

function jsx(o: NodeJSX<unknown>, n: HTMLElement) {

    const u = UINodeMap.get(n)
    for (const [key, value] of Object.entries(o)) {
        if (key === 'UIKey') {
            if (u) u.UIKey = value
            continue;
        }
        if (key === 'className') {
            n.className = value
            continue;
        }
        if (key === 'id') {
            n.id = value
            continue;
        }
        if (key === 'style') {
            Object.assign(n.style, value)
            continue;
        }
        if (key === 'textContent') {
            n.textContent = value
            continue;
        }
        if (key === 'innerHTML') {
            n.innerHTML = value
            continue;
        }
        if (key === 'attrs') {
            for (const [k, v] of Object.entries(value)) {
                if (casiveAttrs.has(k)) n.setAttribute(k, String(v))
                else n.setAttribute(toKebab(k), String(v))
            }
            continue;
        }
        if (key === 'on' && Array.isArray(value)) {
            const o = RuneInstancesLog.find(v => v.ID === n.rune.id)
            if (o) o.dom.GlobalEvents.onEvent(value[0], n, value[1])
            else EventMap.set(n, {ev: value[0], fn: value[1]})
            continue;
        }
        if (key === 'append') {
            value.forEach((v: Node | UINode | nodefn<Node | UINode>) => {
                let a; v instanceof Node ? n.append(v) : v instanceof UINode ? n.append(v.node) : (a = v(n), a instanceof Node ? n.append(a) : n.append(a.node))
            })
            continue;
        }
    }
    return n
}

export function newnode(n: keyof HTMLElementTagNameMap, o: NodeJSX<Node | UINode | nodefn<Node | UINode>> = {}) {
    return jsx(o, document.createElement(n))
}

export type U = UINode