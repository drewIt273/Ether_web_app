/**
 * Instance by DrewIt
 */
//

import {ArrayLogLock} from "@assets/registry"

export type ErrorCode = 'RUNTIME' | 'NODE_HIERARCHY' | 'DOM_INTERFACE_OBJECT' | 'CACHE_OBJECT' | 'RUNTIME_PROXY'

export {}

interface ErrorLog {
    readonly Runtime: ArrayLogLock<RuntimeError>
    readonly DOMInterface: ArrayLogLock<DOMInterfaceError>
    readonly NodeHierarchy: ArrayLogLock<NodeHierarchyError>
    readonly Cache: ArrayLogLock<CacheError>
    readonly RuntimeProxy: ArrayLogLock<RuntimeProxyError>
}

export const ErrorLog: ErrorLog = {
    Runtime: new ArrayLogLock,
    DOMInterface: new ArrayLogLock,
    NodeHierarchy: new ArrayLogLock,
    Cache: new ArrayLogLock,
    RuntimeProxy: new ArrayLogLock
}

class GlobalError extends Error {

    constructor(msg: string) {
        super(`${msg}`)
        Object.setPrototypeOf(this, new.target.prototype)
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    toJSON() {
        return {name: this.name, cause: this.cause, message: this.message, stack: this.stack};
    }
}

export class RuntimeError extends GlobalError {
    readonly code: ErrorCode
    constructor(msg: string) {
        super(msg)
        this.code = 'RUNTIME'
        ErrorLog.Runtime.log(this)
    }
}

export class DOMInterfaceError extends GlobalError {
    readonly code: ErrorCode
    constructor(msg: string) {
        super(msg)
        this.code = 'DOM_INTERFACE_OBJECT'
        ErrorLog.DOMInterface.log(this)
    }
}

export class NodeHierarchyError extends GlobalError {
    readonly code: ErrorCode
    constructor(msg: string) {
        super(msg)
        this.code = 'NODE_HIERARCHY'
        ErrorLog.NodeHierarchy.log(this)
    }
}

export class CacheError extends GlobalError {
    readonly code: ErrorCode
    constructor(msg: string) {
        super(msg)
        this.code = 'CACHE_OBJECT'
        ErrorLog.Cache.log(this)
    }
}

export class RuntimeProxyError extends GlobalError {
    readonly code: ErrorCode
    constructor(msg: string) {
        super(msg)
        this.code = 'RUNTIME_PROXY'
        ErrorLog.RuntimeProxy.log(this)
    }
}