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
                id: 'main',
                class: 'h-full',
            })
        ]
    })
}

export const module: UiModulesInterfaceMap['mainLayoutConstructive'] = ui.define('mainLayoutConstructive', {root: main$()})

function fo() {
    for (const a of Array.from(module.root.node.childNodes)) if (a.$.module !== undefined) return a.$.module
}
function fx(n: UiModule) {
    module.root.node.querySelector('main')?.append(n.root.node)
}

ui.defineProperty('mainLayoutConstructive', 'active', fo)('mount', fx)

declare global {
    interface mainLayoutConstructiveModule {
        active(): UiModule | undefined
        mount(n: UiModule): void
    }
}