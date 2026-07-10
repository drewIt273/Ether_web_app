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
    interface Node extends NodeMetaData {
        rune: {
            id: string
            isRuneRoot: boolean
        }
    }
    interface NodeMetaData {
        $: {
            mounted: boolean
            readonly tag: UINodeType
            readonly uinode: UICell | UIBlock | UIComponent | null
        }
    }
}

type UINodeType = 'uicell' | 'uiblock' | 'uicomp' | 'node'