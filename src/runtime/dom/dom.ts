/**
 * Instance by DrewIt
 */

import {Module} from "@core/module";
import {UINodeMap, UICell, UIBlock, UIComponent} from "./ui-root";

class NodeMessageResolver {

    #call = (n: CellOrBlock, h: HandlerList, ...args: any[]) => {
        for (const fn of h) fn.apply(n, args)
    }

    resolve(sender: CellOrBlock, receiver: CellOrBlock, data: any, ...args: any[]) {
        const hs = receiver.mappedData.get(data)
        if (hs) this.#call(receiver, hs, ...args)
        sender.emittedData = data
    }

    subscribe(node: CellOrBlock, key: any, ...fn: Handler[]) {
        const existing = node.mappedData.get(key)
        if (!existing) node.mappedData.set(key, [...fn])
    }

    unsubscribe(node: CellOrBlock, key: any, fn: Handler|null = null) {
        const hs = node.mappedData.get(key)
        if (hs)
            if (fn) {
                node.mappedData.set(key, hs.filter(h => h !== fn))
            }
            else node.mappedData.delete(key)
    }
}

export class DOMInterface extends Module {

    observer: MutationObserver
    nodeMsg: NodeMessageResolver
    nodelist: Node[]
    rune: Rune
    constructor(r: Rune) {
        super()
        this.rune = r
        this.observer = new MutationObserver(muts => {
            for (const mut of muts) {
                if (mut.addedNodes) for (const added of mut.addedNodes) {
                    if (!UINodeMap.has(added)) this.nodelist.push(added)
                    else {
                        let e = NodeHierachyCheck(added)
                    }
                }
                if (mut.removedNodes) for (const removed of mut.removedNodes) {}
            }
        })
        this.nodeMsg = new NodeMessageResolver
        this.nodelist = []
        this.observer.observe(document, {childList: true, subtree: true})
    }

    async onInit() {
        if (typeof window === 'undefined') return '[DOM] not running in browser environment'  
        else this.init = !0
    }

    async onReady() {
        this.ready = !1
    }
}

function NodeHierachyCheck(n: Node) {
    const o = UINodeMap.get(n), p = n.parentElement; let h;
    if (p) h = UINodeMap.get(p)
    if (o && p && h) {
        const i = hierOrder(o), c = hierOrder(h)
        if (n.childNodes.length) n.childNodes.forEach(k => NodeHierachyCheck(k))
        if (i > c) {
            try {
                p?.removeChild(n)
                throw new Error(`NodeHierachyError: ${r(o)} cannot mount ${r(h)}`)
            }
            finally {return n}
        }
    }
    else return;
    function hierOrder(n: UINode) {
        if (n instanceof UICell) return 1
        else if (n instanceof UIBlock) return 2
        else if (n instanceof UIComponent) return 3
        else return 0
    }
    function r(n: UINode) {
        return `a ${n.node.hasAttribute('ui-cell-id') ? 'UICell' : n.node.hasAttribute('ui-block-id') ? 'UIBlock' : 'UIComponent'}`
    }
}
