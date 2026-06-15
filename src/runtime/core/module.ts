/**
 * Instance by DrewIt
 */

export class Module {

    init: boolean
    ready: boolean
    sentData: any
    receivedData: any
    mappedData: Map<any, (...args: any[]) => any>
    constructor() {
        this.init = !1
        this.ready = !1
        this.mappedData = new Map
    }
}