/**
 * Instance by DrewIt
 * 
 * module.js
 */

export class KModule {
    constructor(/**@type {Kernel}*/ runtime) {
        this.runtime = runtime
    }
}
export const isModule = v => v instanceof KModule