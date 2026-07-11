/**
 * Instance by DrewIt
 */

import {UICell as C, UIBlock as B, UIComponent as K, U} from "@dom/ui-root"
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
    interface Node {
        rune: {
            id: string
            isRuneRoot: boolean
        }
        $: NodeMetaData
    }
    interface NodeMetaData {
        readonly ID: string
        readonly tag: NodeMetaTag
        readonly mounted: boolean
        readonly uikey: string | undefined
        belongsTo: DOMInterface
        prevstate?: string
        currentstate?: string
        onevent: Map<keyof GlobalEvents, ((ev?: Event) => void)[]>
        childCells: Node[]
        childBlocks: Node[]
    }
}

type NodeMetaTag = 'uicell' | 'uiblock' | 'uicomp' | 'node'