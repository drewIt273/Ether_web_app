/**
 * Instance by DrewIt
 */

import {UICell as C, UIBlock as B, UIComponent as K, U, F} from "@dom/ui-root"
import {Rune as R} from "@core/rune";
import {DOMInterface as D} from "@dom/dom";
import {G} from "@core/events";

declare global {
    type UICell = C;
    type UIBlock = B;
    type UIComponent = K;
    type UINode = U;
    type CellOrBlock = C | B;
    type Handler = (...args: any[]) => any;
    type HandlerList = Handler[];
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
    }
    interface NodeMetaData extends INC {
        ID: string
        tag: NodeMetaTag
        uikey?: string
        belongsTo: DOMInterface | null
        prevstate: string | null
        currentstate: string | null
        onevent: Map<keyof GlobalEvents, ((ev?: Event) => any)[]>
        prop: Record<string, any>
        pendingStates: Map<string, {type: 'static'|'computed', fn: Handler}> & Map<string, string>
        readonly mounted: boolean
        readonly uinode?: UINode
        findAll(n: string): Element[]
        find(n: string): Element | null
        on(ev: keyof GlobalEvents, ...calls: ((ev?: Event | undefined) => void)[]): void
        off(ev?: keyof DocumentEventMap | "append" | null): void
        keycall(keys: string[], fn: (ev: Event) => void): void
        unbindkeys(): void
        defineState(state: string, call?: Handler): this['defineState']
        defineComputedState(state: string, call?: Handler): this['defineComputedState']
        setState(state: string, opts?: {schedule: boolean;}): void
        hasDefinedState(s: string): boolean
        onStateChange(fn: Handler): void
        ofn: Handler | null
    }
    interface INC {
        emittedData: null | any
        receivedData: null | any
        mappedData: Map<any, Handler[]>
        emit(data: any, to: string | Node, ...args: any[]): void
        map(data: any, ...fn: Handler[]): void
        unmap(data: any, fn?: Handler | null): void
    }
    type NodeMetaTag = 'uicell' | 'uiblock' | 'uicomp' | 'node'
    type NodeUpdateType = 'textcontent' | 'state' | 'any'
    type FiberDepRecord = Record<string, {type: NodeUpdateType, value: any}>
}
