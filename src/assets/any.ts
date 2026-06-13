/**
 * Instance by DrewIt
 */

function strictObject(o: any): boolean {
    return o !== null && typeof o === 'object' && o?.constructor === Object
}

function isValidJSONString(s: unknown, opts?: {requireObjectOrArray: boolean}): boolean {
    if (typeof s !== 'string') return !1
    const str = s.trim()
    if (str === '') return !1
    try {
        const v = JSON.parse(str)
        if (opts?.requireObjectOrArray) {
            return v !== null && typeof v === 'object'
        }
        return true
    }
    catch {
        return false
    }
}

function toKebab(s: string): string {
    return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function safeParse(v: any) {
    try {
        return JSON.parse(v)
    }
    catch {
        return v
    }
}

export {strictObject, isValidJSONString, toKebab, safeParse}