/**
 * Instance by DrewIt
 */

function strictObject(o: any): o is Record<string, any> {
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

/**
 * Javascript compare objects by reference using '===' or '=='. This function can be used to compare 2 objects which have exact the same keys and exact the same values, returning false otherwise.
 */
function deepEqual(a: any, b: any): boolean {
    // Handle primitives and nulls
    if (a === b) return true
    if (a === null || b === null) return false
    if (typeof a !== 'object' || typeof b !== 'object') return false
    
    // Check if both are strict objects
    if (!strictObject(a) || !strictObject(b)) return false
    
    // Check same keys
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    
    // Recursively compare values
    for (const key of keysA) {
        if (!keysB.includes(key)) return false
        if (!deepEqual(a[key], b[key])) return false
    }
    
    return true
}

const ranstring = (length: number, count: number, end = '') => {
    const chars = 'abcdefd', vchars = chars + '1234567890';
    let f = (s: string, c: number) => Array.from({length: c}, () => s[Math.floor(Math.random() * s.length)]).join(''), key = f(chars, 1);
    key += Array.from({length: count}, () => f(vchars, length)).join('-')
    return (end.length) ? key += `${end}` : key
}

export {strictObject, isValidJSONString, toKebab, safeParse, ranstring}