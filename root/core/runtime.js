/**
 * Instance by DrewIt
 * 
 * runtime.js
 * co-built with GPT-5
 */

import {dom} from './dom.js'

class Kernel {
    constructor() {
        /**Returns the modules constructors */
        this.modules = {dom};
        this.dom = new dom(this);
    }

    async boot() {
        await this.#runstartupHooks()
    }

    #runstartupHooks() {
        // Will call lifecycle hooks.
    }
}

export const runtime = new Kernel;