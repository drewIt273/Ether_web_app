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
        this.dom = new dom;
    }
}

export const runtime = new Kernel;