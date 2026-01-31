/**
 * Instance by DrewIt
 * 
 * store.js
 */

function safeParse(v, f) {
    try {
        return JSON.parse(v)
    }
    catch {return f}
}
