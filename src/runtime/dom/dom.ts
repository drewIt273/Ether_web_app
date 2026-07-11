/**
 * Instance by DrewIt
 */

import {Module} from "@core/module";
import {EventMap, NodeMetaDataInit} from "./ui-root";
import {DOMInterfaceError, NodeHierarchyError} from "@core/error";
import {storageapi} from "@assets/storageapi";
import {stylesheet} from "@assets/stylesheet";

interface NodeMessageResolver {
    resolve(sender: CellOrBlock, receiver: CellOrBlock, data: any, ...args: any[]): void
    subscribe(node: CellOrBlock, key: any, ...fn: HandlerList): void
    unsubscribe(node: CellOrBlock, key: any, fn?: Handler|null): void
}

interface UiEventsInterface {
    onEvent(ev: keyof GlobalEvents, node: Node, ...handlers: ((ev: Event) => void)[]): void
    unEvent(node: Node, ev?: keyof GlobalEvents | null): void
    keyEvent(node: Node, keys: string[], handler: ((ev: Event) => void)): void
    unKey(node: Node): void
}

interface UiStatesInterface {
    setState(node: Node, state: string, opts?: {schedule: boolean}): void
    defineState(node: Node, state: string, call: Handler): void
    defineCompute(node: Node, state: string, call: Handler): void
    hasState(node: Node, state: string): boolean
}

export class DOMInterface extends Module {

    observer: MutationObserver
    nodeMsg: NodeMessageResolver
    root: HTMLElement
    rune: Rune
    constructor(r: Rune) {
        super(r)
        this.rune = r
        this.observer = new MutationObserver(muts => {
            const rn = (n: Node) => {
                n.rune = {
                    id: this.rune.ID,
                    isRuneRoot: false
                }
            }
            for (const mut of muts) {
                if (mut.addedNodes) for (const added of mut.addedNodes) {
                    rn(added), added.childNodes.forEach(c => rn(c));
                    (added as Element).setAttribute('_hide_', '')
                    const call = (n: Node) => {
                        if (EventMap.has(n)) { const k = EventMap.get(n)
                            if (k) this.GlobalEvents.onEvent(k.ev, n, k.fn)
                        }
                        n.$.belongsTo = this
                        n.$.onevent.forEach((v, k) => {
                            if (k === 'append') v.forEach(h => h())
                            else this.GlobalEvents.onEvent(k, n, ...v)
                        }), n.$.onevent.clear()
                        if (n.$.uikey) {
                            const a = storageapi.o.get('uistates')?.[n.$.uikey]
                            if (a) this.GlobalStates.setState(n, a)
                        }
                        n.childNodes.forEach(a => call(a));
                    }
                    call(added),
                    (added as Element).removeAttribute('_hide_')
                }
                if (mut.removedNodes) for (const removed of mut.removedNodes) {
                    const call = (n: Node) => {
                        this.GlobalEvents.unEvent(n)
                        if (n.$.uikey) storageapi.o.set('uistates')?.(n.$.uikey, n.$.currentstate)
                        n.childNodes.forEach(n => call(n))
                    }
                    call(removed)
                }
            }
        })
        this.root = document.querySelector(`[${this.rune.config.approot}]`) ?? document.body
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
                else throw new DOMInterfaceError(`UINode ${node.ID} is out of reach`)
            },
        }
        this.root.rune = {
            id: this.rune.ID,
            isRuneRoot: true
        }
    }

    async onInit() {
        if (typeof window === 'undefined') return new Error('[DOM] not running in browser environment')
        else {
            NodeMetaDataInit()
            this.init = !0
        }
    }

    async onReady() {
        const s = new stylesheet(); s.id = '_rune-injected-styles_'; s.append()
        s.CSS = {
            '*[_hide_]': {display: 'none'}
        }
        this.observer.observe(this.root, {childList: true, subtree: true})
        this.ready = !0
    }

    append(node: Node, into: Node = this.root) {
        if (this.root.contains(into)) {
            const e = NodeHierarchyCheck(node)
            if (e) throw e
            if ((h$(into) > h$(node))) into.appendChild(node)
            else throw new NodeHierarchyError(`${into.$.tag} cannot mount ${node.$.tag}`)
        }
        else throw new DOMInterfaceError(`Node ${into} is out of reach`)
        return (node: Node, into: Node = this.root) => this.append(node, into)
    }

    query(s: string) {
        return Array.from(this.root.querySelectorAll(s))
    }

    GlobalEvents: UiEventsInterface = {
        onEvent: (ev: keyof GlobalEvents, node: Node, ...handlers: ((ev: Event) => void)[]) => {
            this.#ne(node, () => this.IMC.emit('ln', this.rune.events, [ev, node, ...handlers]))
        },

        unEvent: (node: Node, ev: keyof GlobalEvents | null = null) => {
            this.#ne(node, () => this.IMC.emit('un', this.rune.events, [node, ev]))
        },

        keyEvent: (node: Node, keys: string[], handler: ((ev: Event) => void)) => {
            this.#ne(node, () => this.IMC.emit('kc', this.rune.events, [keys, node, handler]))
        },

        unKey: (node: Node) => {
            this.#ne(node, () => this.IMC.emit('ku', this.rune.events, [node]))
        }
    }

    GlobalStates: UiStatesInterface = {
        setState: (node, state, opts = {schedule: false}) => {
            this.#se(node, () => this.IMC.emit('set', this.rune.states, [node, state, opts]))
        },

        defineState: (node, state, call) => {
            this.#se(node, () => this.IMC.emit('df', this.rune.states, [node, state, call]))
        },

        defineCompute: (node, state, call) => {
            this.#se(node, () => this.IMC.emit('dc', this.rune.states, [node, state, call]))
        },

        hasState: (node, state) => {
            const o = this.rune.states.reg.get(node)
            if (o) return Object.hasOwn(o, state)
            else return false
        },
    }

    #ne(node: Node, emit: Handler) {
        if (this.root.contains(node)) emit()
        else {
            const r = node.$.belongsTo?.rune
            if (r) {
                const o = this.rune.proxy.send({type: 'uiEvent', msg: node}, r)
                o.then(v => {
                    if (v?.type === 'rejected') throw OutOfReachError(node)
                    else emit()
                })
            }
            else throw OutOfReachError(node)
        }
    }

    #se(node: Node, emit: Handler) {
        if (this.root.contains(node)) emit()
        else {
            const r = node.$.belongsTo?.rune
            if (r) {
                const o = this.rune.proxy.send({type: 'uiState', msg: node}, r)
                o?.then(v => {
                    if (v?.type === 'rejected') throw OutOfReachError(node)
                    else emit()
                })
            }
            else throw OutOfReachError(node)
        }
    }
}

function OutOfReachError(n: Node) {
    return new DOMInterfaceError(`Node ${n} is out of reach`)
}

function NodeHierarchyCheck(n: Node) {
    const p = n.parentElement
    if (p) if (h$(n) > h$(p)) return new NodeHierarchyError(`${n.$.tag} cannot mount ${p.$.tag}`)
    if (n.childNodes.length) {
        n.childNodes.forEach(k => {
            let e = NodeHierarchyCheck(k)
            if (e) throw e
        })
    }
}

function h$(n: Node) {
    const t = n.$.tag
    if (t === 'uicell') return 1
    else if (t === 'uiblock') return 2
    else if (t === 'uicomp') return 3
    else return 0
}
