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
                constructor: true,
                class: 'h-full',
            })
        ]
    })
}

export const module: UiModulesInterfaceMap['mainLayoutConstructive'] = ui.define('mainLayoutConstructive', {root: main$()})

function f$() {
    return module.root.node.querySelector('[constructor]')
}
function fo() {
    const r: UiModule[] = [], k = f$();
    if (k) for (const a of Array.from(k.childNodes)) if (a.$.module) r.push(a.$.module)
    return r
}
function fd() {
    const e = f$()
    if (e) for (const c of Array.from(e.childNodes)) if (c.$.module?.type === 'constructed') return c.$.module
}
function fx(n: UiModule) {
    const k = f$()
    if (k) k.append(n.root.node)
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

ui.defineProperty('mainLayoutConstructive', 'modules', fo)('mount', fx)('unmount', fe)('constructed', fd)('hasModule', fc)

declare global {
    interface mainLayoutConstructiveModule {
        modules(): UiModule[]
        constructed(): UiModule | undefined
        mount(n: UiModule): void
        unmount(n: UiModule): void
        hasModule(): boolean
    }
}