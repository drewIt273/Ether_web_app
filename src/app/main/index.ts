/**
 * Instance by DrewIt
 */

import {ui} from "../module"

function main$() {
    return jsx('div', {
        type: 'uicomp',
        uikey: 'mainLayoutConstructive',
        append: [
            jsx('main', {
                Constructor: true,
                class: 'h-full',
            })
        ]
    })
}

export const module: UiModulesInterfaceMap['mainLayoutConstructive'] = ui.define('mainLayoutConstructive', {root: main$()})

function f$() {
    return module.root.node.querySelector('[Constructor]')
}
function fo() {
    const r: UiModule[] = []
    for (const a of Array.from(module.root.node.childNodes)) if (a.$.module instanceof ui.UiModule) r.push(a.$.module)
    return r
}
function fd() {
    const e = f$()
    if (e) for (const c of Array.from(e.childNodes)) if (c.$.module?.type === 'constructed') return c.$.module
}
function fx(n: UiModule) {
    const k = f$();
    if (k) fd()?.unMount(), n.root.mount(k as HTMLElement)
}
function fc() {
    const k = f$()
    if (k) return Array.from(k.childNodes).some(v => ui.getModule(v))
    else return !1
}
function fe(n: UiModule) {
    const e = f$()
    if (e) {
        for (const c of Array.from(e.childNodes)) if (c.$.module && c.$.module === n) {
            n.unMount()
            return;
        }
    }
}

ui.defineProperty('mainLayoutConstructive', 'modules', {get: fo})('mount', {value: fx})('unmount', {value: fe})('constructed', {get: fd})('hasModule', {get: fc})

declare global {
    interface mainLayoutConstructiveModule {
        readonly modules: UiModule[]
        readonly constructed: UiModule | undefined
        mount(n: UiModule): void
        unmount(n: UiModule): void
        readonly hasModule: boolean
    }
}