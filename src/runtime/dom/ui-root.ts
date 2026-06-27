/**
 * Instance by DrewIt
 */

import {Registry} from "@assets/registry";
import {ranstring, toKebab} from "@assets/any";

export const UIReg = new Registry;
export const UINodeMap = new WeakMap<Node, UINode>

interface NodeMetaData {
    belongsTo?: DOMInterface
}

export class UINode {

    readonly node: HTMLElement
    meta: NodeMetaData
    constructor(n: keyof HTMLElementTagNameMap | HTMLElement = 'div') {
        this.node = n instanceof HTMLElement ? n : document.createElement(n)
        this.meta = {}
    }

    get key() {
        return this.node?.getAttribute('ui-data-key')
    }

    set UIKey(s: string) {
        this.attrs({'ui-data-key': s})
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

    on(ev: keyof DocumentEventMap, ...calls: ((ev: Event) => void)[]) {
        this.meta.belongsTo?.onEvent(ev, this.node, ...calls)
    }

    off(ev: keyof DocumentEventMap) {
        this.meta.belongsTo?.unEvent(this.node, ev)
    }
}

export class UICell extends UINode {

    readonly ID: string
    emittedData: any
    receivedData: any
    mappedData: Map<any, HandlerList>
    constructor(n: keyof HTMLElementTagNameMap | HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-cell-id': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
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
    constructor(n: keyof HTMLElementTagNameMap | HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(3, 1)
        this.attrs({'ui-block-id': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
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
    constructor(n: keyof HTMLElementTagNameMap | HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-comp-id': this.ID})
        UINodeMap.set(this.node, this)
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