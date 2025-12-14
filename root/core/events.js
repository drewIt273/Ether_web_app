/**
 * Instance by DrewIt
 * 
 * events.js
 */

import {find, findAll, isNode, isString, Registry} from "../../nodes/scripts/any.js"


export class events_module {
    constructor(/**@type {kernel}*/runtime) {
        /** Reference to the kernel for hooks, module communication, etc. */
            this.runtime = runtime
        /**A registry for nodes still having active listeners in the DOM */
            this.ActiveListeners = new Registry()
        /**A registry for nodes whose event listeners where removed from the DOM */
            this.BacklogListeners = new Registry()
        /**Track which global events are already delegated @type {Set<string>} */
            this.ActiveGlobals = new Set()
        /**Stores references to global delegated listeners so they can be removed later @type {Map<string, ()>} */
            this.GlobalDelegates = new Map()
    }

    listen(ev, target, ...handlers) {    }
}