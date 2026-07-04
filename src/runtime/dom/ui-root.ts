/**
 * Instance by DrewIt
 */

import {ranstring, toKebab} from "@assets/any";
import {storageapi} from "@assets/storageapi";
import {RuneInstancesLog} from "@core/rune";

export const UINodeMap = new WeakMap<Node, UINode>
export const NodeKeys: Set<string> = new Set()

interface NodeMetaData {
    belongsTo?: DOMInterface
    onEventMap: Map<keyof GlobalEvents, ((ev?: Event) => void)[]>
    unEventSet: Set<keyof GlobalEvents>
    backStates: Map<string, {type: 'static' | 'computed', fn: Handler}>
}

interface NodeJSX<K extends unknown> {
    tag?: keyof HTMLElementTagNameMap
    attrs?: Record<string, unknown>
    className?: string
    textContent?: string
    style?: Partial<Record<keyof CSSStyleProperties, any>>
    append?: K[]
    UIKey?: string
    on?: [keyof DocumentEventMap, ...Handler[]]
}

type nodefn<K extends unknown> = ($: HTMLElement) => K

interface CellJSX extends NodeJSX<Node | nodefn<Node>> {}
interface BlockJSX extends NodeJSX<Node | UICell | nodefn<Node | UICell>> {}
interface ComponentJSX extends NodeJSX<Node | UICell | UIBlock | nodefn<Node | UICell | UIBlock>> {}

class UINode {

    readonly node: HTMLElement
    meta: NodeMetaData
    constructor(o: NodeJSX<Node | unknown>) {
        this.node = o.tag ? document.createElement(o.tag) : document.createElement('div')
        this.meta = {
            onEventMap: new Map(),
            unEventSet: new Set(),
            backStates: new Map()
        }
        this.node.rune = {
            id: '',
            isRuneRoot: false
        }
    }

    get key() {
        return this.node.getAttribute('node-key')
    }

    set UIKey(s: string) {
        if (!NodeKeys.has(s)) this.attrs({'node-key': s}), NodeKeys.add(s)
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

    unmount() {
        if (this.mounted) this.node.parentElement?.removeChild(this.node)
    }

    on(ev: keyof GlobalEvents, ...calls: ((ev?: Event) => void)[]) {
        const o = this.meta
        if (o.belongsTo) o.belongsTo.GlobalEvents.onEvent(ev, this.node, ...calls)
        else o.onEventMap.set(ev, calls)
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
            if (v && v.type === 'static') o.GlobalStates.defineState(this, state, () => {v.fn.apply(this), call.apply(this)}), a.delete(state)
            else o.GlobalStates.defineState(this, state, call)
        }
        else a.set(state, {type: 'static', fn: call})
        return (state: string, call: Handler = () => {}) => this.defineState.call(this, state, call)
    }

    defineComputedState(state: string, call: Handler = () => {}) {
        const o = this.meta.belongsTo, a = this.meta.backStates, v = a.get(state)
        if (o) {
            if (v && v.type === 'computed') o.GlobalStates.defineState(this, state, () => {v.fn.apply(this), call.apply(this)}), a.delete(state)
            else o.GlobalStates.defineState(this, state, call)
        }
        else a.set(state, {type: 'computed', fn: call})
        return this.defineComputedState
    }

    setState(state: string, opts = {schedule: false}) {
        const o = this.meta
        this.#p.prev = this.node.getAttribute('data-state') ?? ''
        if (o.belongsTo) {
            o.belongsTo.GlobalStates.setState(this, state, opts)
            this.#p.curr = state
            this.#p.ofn?.call(this)
            if (this.key) storageapi.o.set('uistates')?.(this.key, state)
        }
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
    constructor(o: CellJSX) {
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
    constructor(o: BlockJSX) {
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
    constructor(o: ComponentJSX) {
        super(o)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-comp': this.ID})
        UINodeMap.set(this.node, this)
        jsx(o, this.node)
    }

    get childBlocks() {
        return childBlocks(this)
    }

    get childCells() {
        return childCells(this)
    }

    mount(n: Node) {
        n.appendChild(this.node)
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
        if (key === 'style') {
            Object.assign(n.style, value)
            continue;
        }
        if (key === 'textContent') {
            n.textContent = value
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