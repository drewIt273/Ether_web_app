/**
 * Instance by DrewIt
 */

import {Module} from "@core/module";
import {UINodeMap, UICell, UIBlock, UIComponent} from "./ui-root";
import {DOMInterfaceError, NodeHierarchyError} from "@core/error";

interface NodeMessageResolver {
    resolve(sender: CellOrBlock, receiver: CellOrBlock, data: any, ...args: any[]): void
    subscribe(node: CellOrBlock, key: any, ...fn: HandlerList): void
    unsubscribe(node: CellOrBlock, key: any, fn?: Handler|null): void
}

export class DOMInterface extends Module {

    observer: MutationObserver
    nodeMsg: NodeMessageResolver
    nodelist: Node[]
    root: HTMLElement
    rune: Rune
    constructor(r: Rune) {
        super(r)
        this.rune = r
        this.observer = new MutationObserver(muts => {
            for (const mut of muts) {
                if (mut.addedNodes) for (const added of mut.addedNodes) {
                    if (!UINodeMap.has(added)) this.nodelist.push(added)
                    else {}
                }
                if (mut.removedNodes) for (const removed of mut.removedNodes) {}
            }
        })
        this.nodelist = []
        this.root = document.querySelector(`[${this.rune.config.approot}]`) ?? document.body
        this.observer.observe(document, {childList: true, subtree: true})
        this.nodeMsg = {
            resolve: (sender: CellOrBlock, receiver: CellOrBlock, data: any, ...args: any[]) => {
                let o = receiver.meta.belongsTo
                if (o && o === this) {
                    const hs = receiver.mappedData.get(data)
                    if (hs) for (const fn of hs) fn.apply(receiver, args)
                    sender.emittedData = data
                }
            },
            subscribe: (node: CellOrBlock, key: any, ...fn: Handler[]) => {
                if (node.meta?.belongsTo === this) {
                    const existing = node.mappedData.get(key)
                    if (!existing) node.mappedData.set(key, [...fn])
                    else existing.push(...fn)
                }
                else throw new DOMInterfaceError(`UINode ${node.ID} out of reach`)
            },
            unsubscribe: (node: CellOrBlock, key: any, fn: Handler|null = null) => {
                if (node.meta?.belongsTo === this) {
                    const hs = node.mappedData.get(key)
                    if (hs)
                        if (fn) {
                            node.mappedData.set(key, hs.filter(h => h !== fn))
                        }
                        else node.mappedData.delete(key)
                }
                else throw new DOMInterfaceError(`UINode ${node.ID} out of reach`)
            },
        }
    }

    async onInit() {
        if (typeof window === 'undefined') return '[DOM] not running in browser environment'  
        else this.init = !0
    }

    async onReady() {
        this.ready = !1
    }

    append(node: Node, into: Node = this.root) {
        if (this.root.contains(into)) {
            const e = NodeHierarchyCheck(node), n = UINodeMap.get(into), k = UINodeMap.get(node)
            if (e) throw e
            if (n && k) 
                if ((hierOrder(n) > hierOrder(k))) {
                    into.appendChild(node)
                    k.meta.belongsTo = this
                }
                else throw new NodeHierarchyError(`${r(n)} cannot mount ${r(k)}`)
        }
        else throw new DOMInterfaceError(`Node ${into} out of reach`)
    }

    onEvent(ev: keyof DocumentEventMap, node: Node, ...handlers: ((ev: Event) => void)[]) {
        if (this.root.contains(node)) this.rune.events.listen(ev, node, ...handlers)
        else {
            const o = UINodeMap.get(node), r = o?.meta.belongsTo?.rune
            if (r) {
                const o = this.rune.proxyInterface.send({type: 'uiEvent', msg: node}, r)
                if (o) o.then(v => {
                    if (v?.type === 'rejected') throw OutOfReachError(node)
                })
            }
            else throw OutOfReachError(node)
        }
    }

    unEvent(node: Node, ev: keyof DocumentEventMap) {
        if (this.root.contains(node)) this.rune.events.unlisten(node, ev)
        else {
            const o = UINodeMap.get(node), r = o?.meta.belongsTo?.rune
            if (r) {
                const o = this.rune.proxyInterface.send({type: 'uiEvent', msg: node}, r)
                if (o) o.then(v => {
                    if (v?.type === 'rejected') throw OutOfReachError(node)
                })
            }
            else throw OutOfReachError(node)
        }
    }
}

function OutOfReachError(n: Node) {
    return new DOMInterfaceError(`Node ${n} out of reach`)
}

function NodeHierarchyCheck(n: Node) {
    const o = UINodeMap.get(n), p = n.parentElement; let h;
    if (p) h = UINodeMap.get(p)
    if (o && p && h) {
        const i = hierOrder(o), c = hierOrder(h)
        if (n.childNodes.length) {
            n.childNodes.forEach(k => {
                let e = NodeHierarchyCheck(k)
                if (e) throw e
            })
        }
        if (i > c) {
            p?.removeChild(n)
            return new NodeHierarchyError(`${r(o)} cannot mount ${r(h)}`)
        }
    }
    else return;
}

function r(n: UINode) {
    if (n instanceof UIComponent) return 'UIComponent'
    else if (n instanceof UIBlock) return 'UIBlock'
    else return 'UICell'
}

function hierOrder(n: UINode) {
    if (n instanceof UICell) return 1
    else if (n instanceof UIBlock) return 2
    else if (n instanceof UIComponent) return 3
    else return 0
}
