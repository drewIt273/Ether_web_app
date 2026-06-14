/**
 * Instance by DrewIt
 */

import {Registry} from "@assets/registry";
import {toKebab} from "@assets/any";

export const UIReg = new Registry;

export class UINode {

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
