/**
 * Instance by DrewIt
 */

import {U, F} from "@dom/ui-root"; import {Rune as R} from "@core/rune"; import {D} from "@dom/dom"; import {G} from "@core/events"; import {vector as v} from "@dom/vectors"; import {storageapi as O} from "@assets/storageapi";

declare global {
    type UINode = U;
    type Handler = (...args: any[]) => any;
    type Rune = R
    type DOMInterface = D
    type GlobalEvents = G
    type Fiber = F
    interface Node {
        rune: {
            id: string
            isRuneRoot: boolean
        }
        $: NodeMetaData
        jsx: (o: Fiber) => this
    }
    interface NodeMetaData extends NodeMsgResolverUnit, UiNodeDependency {
        tag: NodeMetaTag
        uikey?: string
        belongsTo: DOMInterface | null
        prevstate: string | null
        currentstate: string | null
        onevent: Map<keyof GlobalEvents, ((ev?: Event) => any)[]>
        prop: FiberDepRecord
        pendingStates: Map<string, {type: 'static'|'computed', fn: Handler}> & Map<string, string>
        readonly ID: NodeID
        readonly mounted: boolean
        readonly node: Node
        findAll(n: string): Element[]
        find(n: string): Element | null
        on(ev: keyof GlobalEvents, ...calls: ((ev?: Event | undefined) => void)[]): void
        off(ev?: keyof GlobalEvents | null): void
        keycall(keys: string[], fn: (ev: Event) => void): void
        unbindkeys(): void
        defineState(state: string, call?: Handler): this['defineState']
        defineComputedState(state: string, call?: Handler): this['defineComputedState']
        setState(state: string, opts?: {schedule: boolean;}): void
        hasDefinedState(s: string): boolean
        onStateChange(fn: Handler): void
        ofn: Handler | null
    }
    interface NodeMsgResolverUnit {
        emittedData: null | any
        receivedData: null | any
        mappedData: Map<any, Handler[]>
        emit(data: any, to: string | Node, ...args: any[]): void
        map(data: any, ...fn: Handler[]): void
        unmap(data: any, fn?: Handler | null): void
    }
    interface UiNodeDependency {
        dependsOn(sourceNode: Node, fn: (changeData: any) => any): void
    }
    type NodeMetaTag = 'uicell' | 'uiblock' | 'uicomp' | 'node'
    type UiElementInterfaceMap = HTMLElementTagNameMap & SVGElementTagNameMap
    type HTMLTagName = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap
    type FiberDepRecord = Record<string, any>
    type NodeID = string
    const jsx: <K extends HTMLTagName>(n: K, o: Fiber) => UiElementInterfaceMap[K]
    const vector = v
    const storageapi = O
}
