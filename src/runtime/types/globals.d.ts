/**
 * Instance by DrewIt
 */

import {UICell as C, UIBlock as B, UIComponent as K, UINode as U} from "@dom/ui-root"
import {Rune as R} from "@core/runtime";
import {DOMInterface as D} from "@dom/dom";

declare global {
    type UINode = U;
    type UICell = C;
    type UIBlock = B;
    type UIComponent = K;
    type CellOrBlock = C | B;
    type Handler = (...args: any[]) => any;
    type HandlerList = Handler[];
    type Rune = R
    type DOMInterface = D
}