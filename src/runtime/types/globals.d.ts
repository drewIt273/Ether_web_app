/**
 * Instance by DrewIt
 */

import {UICell as cell, UIBlock as block, UIComponent as comp, UINode as U} from "@dom/ui-root"

declare global {
    type UINode = U;
    type UICell = cell;
    type UIBlock = block;
    type UIComponent = comp;
    type CellOrBlock = cell | block;
    type Handler = (...args: any[]) => any;
    type HandlerList = Handler[];
}