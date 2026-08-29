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
                id: 'moduleContainer',
                class: 'h-full',
            })
        ]
    })
}

export const module: UiModulesInterfaceMap['mainLayoutConstructive'] = ui.define('mainLayoutConstructive', {root: main$()})

function f$() {
    return module.root.node.querySelector('main#moduleContainer')
}
function fo() {
    const r: UiModule[] = []
    for (const a of Array.from(module.root.node.childNodes)) if (a.$.module !== undefined) r.push(a.$.module)
    return r
}
function fd() {
    const e = f$()
    if (e) {
        for (const c of Array.from(e.childNodes)) if (c.$.module) return c.$.module
    }
}
function fx(n: UiModule) {
    f$()?.append(n.root.node)
}
function fe(n: UiModule) {
    const e = f$()
    if (e) {
        for (const c of Array.from(e.childNodes)) if (c.$.module && c.$.module === n) {
            n.root.unmount()
            return;
        }
    }
}

ui.defineProperty('mainLayoutConstructive', 'modules', fo)('mount', fx)('unmount', fe)('active', fd)

declare global {
    interface mainLayoutConstructiveModule {
        modules(): UiModule[]
        active(): UiModule | undefined
        mount(n: UiModule): void
        unmount(n: UiModule): void
    }
}