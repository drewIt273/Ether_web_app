/**
 * Instance by DrewIt
 */

import {Registry} from "@assets/registry";
import {ranstring, toKebab} from "@assets/any";

export const UIReg = new Registry;
export const UINodeMap = new WeakMap<HTMLElement, UICell|UIBlock|UIComponent>

class UINode {

    node: HTMLElement
    parent: ParentNode | null
    childNodes: ChildNode[]
    constructor(n: string|HTMLElement = 'div') {
        this.node = n instanceof HTMLElement ? n : document.createElement(n)
        this.parent = this.node.parentNode
        this.childNodes = Array.from(this.node.childNodes)
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

    dataset(o: Record<string, string>) {
        for (const [k, v] of Object.entries(o)) this.node.setAttribute(toKebab(`data-${k}`), v)
        return this
    }

    style(o: Record<string, any>) {
        for (const [k, v] of Object.entries(o)) Object.assign(this.node.style, {[toKebab(k)]: v})
        return this
    }

    find(n: (HTMLElement | string)) {
        if (n instanceof HTMLElement && this.node.contains(n)) return n
        else if (typeof n === 'string') return Array.from(document.querySelectorAll(n))
    }
}

export class UICell extends UINode {

    ID: string
    emittedData: any
    mappedData: Map<any, () => any>
    constructor(n: string|HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(4, 1)
        this.attrs({'ui-cell-id': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
    }

    append(...n: Node[]) {
        this.node.append(...n)
    }
}

export class UIBlock extends UINode {

    ID: string
    emittedData: any
    mappedData: Map<any, () => any>
    constructor(n: string|HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(3, 1)
        this.attrs({'ui-block-id': this.ID})
        this.mappedData = new Map
        UINodeMap.set(this.node, this)
    }
}

export class UIComponent extends UINode {

    ID: string
    constructor(n: string|HTMLElement = 'div') {
        super(n)
        this.ID = ranstring(4, 1)
        UINodeMap.set(this.node, this)
    }
}