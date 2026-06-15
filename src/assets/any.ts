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

const ranstring = (length: number, count: number, end = '') => {
    const chars = 'abcdefd', vchars = chars + '1234567890';
    let f = (s: string, c: number) => Array.from({length: c}, () => s[Math.floor(Math.random() * s.length)]).join(''), key = f(chars, 1);
    key += Array.from({length: count}, () => f(vchars, length)).join('-')
    return (end.length) ? key += `${end}` : key
}

export {strictObject, isValidJSONString, toKebab, safeParse, ranstring}