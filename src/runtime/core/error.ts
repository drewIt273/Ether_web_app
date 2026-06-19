/**
 * Instance by DrewIt
 */
//

import {ArrayLogLock} from "@assets/registry"

export type ErrorCode = 'RUNTIME' | 'NODE_HIERARCHY' | 'DOM_INTERFACE_OBJECT' | 'CACHE_OBJECT' | 'RUNTIME_PROXY'

declare global {
    interface ErrorConstructor {
        captureStackTrace?: (target: any, constructorOpt?: Function) => void
    }
}

export {}

interface ErrorLog {
    readonly DOMInterface: ArrayLogLock<DOMInterfaceError>
    readonly NodeHierarchy: ArrayLogLock<NodeHierarchyError>
    readonly Cache: ArrayLogLock<CacheError>
    readonly RuntimeProxy: ArrayLogLock<RuntimeProxyError>
}

export const ErrorLog: ErrorLog = {
    DOMInterface: new ArrayLogLock,
    NodeHierarchy: new ArrayLogLock,
    Cache: new ArrayLogLock,
    RuntimeProxy: new ArrayLogLock
}

class GlobalError extends Error {

    constructor(msg: string) {
        super(`${GlobalError.name}: ${msg}`)
        Object.setPrototypeOf(this, new.target.prototype)
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    toJSON() {
        return {name: this.name, cause: this.cause, message: this.message, stack: this.stack};
    }
}

export class DOMInterfaceError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        ErrorLog.DOMInterface.log(this)
    }

    #e: ErrorCode = 'DOM_INTERFACE_OBJECT'

    get code() {
        return this.#e
    }
}

export class NodeHierarchyError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        ErrorLog.NodeHierarchy.log(this)
    }

    #e: ErrorCode = 'NODE_HIERARCHY'

    get code() {
        return this.#e
    }
}

export class CacheError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        ErrorLog.Cache.log(this)
    }

    #e: ErrorCode = 'CACHE_OBJECT'

    get code() {
        return this.#e
    }
}

export class RuntimeProxyError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        ErrorLog.RuntimeProxy.log(this)
    }

    #e: ErrorCode = 'RUNTIME_PROXY'

    get code() {
        return this.#e
    }
}