/**
 * Instance by DrewIt
 */

import {Registry} from "@assets/registry";
import {ranstring, toKebab} from "@assets/any";

export const UIReg = new Registry;
export const UINodeMap = new WeakMap<Node, UINode>

export class UINode {

    node: HTMLElement
    parent: ParentNode|null
    childNodes: ChildNode[]
    mounted: boolean
    constructor(n: string|HTMLElement = 'div') {
        this.node = n instanceof HTMLElement ? n : document.createElement(n)
        this.parent = this.node.parentElement
        this.childNodes = Array.from(this.node.childNodes)
        this.mounted = !1
    }

    get key() {
        return this.node?.getAttribute('ui-data-key')
    }

    set UIKey(s: string) {
        this.attrs({'ui-data-key': s})
    }

    attrs(o: Record<string, string>) {
        for (const [k, v] of Object.entries(o)) this.node.setAttribute(toKebab(k), v)
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
        this.mounted = !1
    }
}

export class UICell extends UINode {

    ID: string
    emittedData: any
    receivedData: any
    mappedData: Map<any, HandlerList>
    constructor(n: string|HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-cell-id': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
    }

    mount(n: Node|UIBlock|UIComponent) {
        n instanceof Node ? n.appendChild(this.node) : n.node.append(this.node)
        this.mounted = !0
    }
}

export class UIBlock extends UINode {

    ID: string
    emittedData: any
    receivedData: any
    mappedData: Map<any, HandlerList>
    constructor(n: string|HTMLElement = 'div') {
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
        this.mounted = !0
    }
}

export class UIComponent extends UINode {

    ID: string
    constructor(n: string|HTMLElement = 'div') {
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
        this.mounted = !0
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