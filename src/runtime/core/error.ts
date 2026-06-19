/**
 * Instance by DrewIt
 */
//

import {ArrayLogLock} from "@assets/registry"

export type ErrorCode = 'RUNTIME' | 'NODE_HIERARCHY' | 'DOM_INTERFACE_OBJECT' | 'CACHE_OBJECT'

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
}

export const ErrorLog: ErrorLog = {
    DOMInterface: new ArrayLogLock,
    NodeHierarchy: new ArrayLogLock,
    Cache: new ArrayLogLock
}

class GlobalError extends Error {

    code: ErrorCode
    constructor(msg: string) {
        super(`${GlobalError.name}: ${msg}`)
        Object.setPrototypeOf(this, new.target.prototype)
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        }
        this.code = 'RUNTIME'
    }
    toJSON() {
        return {name: this.name, cause: this.cause, message: this.message, stack: this.stack};
    }
}

export class DOMInterfaceError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        this.code = 'DOM_INTERFACE_OBJECT'
    }
}

export class NodeHierarchyError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        this.code = 'NODE_HIERARCHY'
    }
}

export class CacheError extends GlobalError {
    constructor(msg: string) {
        super(msg)
        this.code = 'CACHE_OBJECT'
    }
}