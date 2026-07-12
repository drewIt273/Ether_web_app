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
    interface NodeMetaData {
        tag: NodeMetaTag
        readonly mounted: boolean
        uikey: string
        belongsTo: DOMInterface
        prevstate?: string
        currentstate?: string
        onevent: Map<keyof GlobalEvents, ((ev?: Event) => void)[]>
        prop: Record<string, any>
        readonly uinode: UINode
    }
    type NodeMetaTag = 'uicell' | 'uiblock' | 'uicomp' | 'node'
    type NodeUpdateType = 'textcontent' | 'state' | 'any'
    type FiberDepRecord = Record<string, {type: NodeUpdateType, value: any}>
}
