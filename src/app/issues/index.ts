/**
 * Instance by DrewIt
 */

import {ui} from "../module"

function fb() {
    let s = 'An issue is a bug, task, question, or enhancement tracked with a title, description, priority, assignee, status, and comments so teams can capture context, coordinate fixes or work, and measure progress toward resolution.'
    return jsx('div', {
        class: 'd-flex justify-center h-full',
        append: [
            jsx('div', {
                class: 'items-center gap-xl h-full',
                append: [
                    jsx('div', {
                        append: [
                            jsx('div', {class: 'app-vector', append: [vector.app.cards]}),
                            jsx('span', {class: 'h4', append: ["Issues"]}),
                            jsx('span', {style: {maxWidth: '30em', paddingBottom: '1em'}, append: [s]}),
                            jsx('div', {class: 'primary-tab', append: ["Create new issue"], onclick: () => {module.opensui?.()}}),
                        ],
                        class: 'd-flex flex-column gap-lg'
                    })
                ]
            })
        ]
    })
}

function sui() {
    return jsx('div', {
        popup: true,
        class: 'd-flex items-center h-full w-full',
        onappend: (n) => {
            n.$.setState('active')
        },
        states: {
            active: () => {
                getNodeByUIKey('main').$.attrs({fade: ''})
                getNodeByUIKey('popup-layer').$.attrs({active: ''})
            },
            inactive: () => {
                (getNodeByUIKey('main') as Element).removeAttribute('fade');
                (getNodeByUIKey('popup-layer') as Element).removeAttribute('active')
            }
        },
        onclick: (n, e) => {
            n.$.setState('inactive'), n.remove()
        }
    })
}

function ah(n: HTMLElement) {
    const o = getNodeByUIKey('popup-layer'), a = Array.from(o.childNodes), k = a.find(g => (g as Element).hasAttribute('popup'))
    if (k) {
        if (k !== n) k.remove()
        else return;
    }
    if (n.hasAttribute('popup')) o.appendChild(n)
}

const o = {
    fb: fb(),
    sui: sui(),
}

export const module: UiModulesInterfaceMap['issues'] = ui.define('issues', {root: Issues$(), onMount: () => module.root.node.append(th()), type: 'constructed', imports: ['sheet']})
// @ts-expect-error
ui.defineProperty('issues', 'fbui', o.fb)('sui', o.sui)('opensui', () => ah(module.sui))('closesui', () => module.sui.setState('inactive'))

function th() {
    const o = storageapi.o.get('issues')
    return o ? document.createElement('div') : o.fb
}

function Issues$() {
    return jsx('div', {
        uikey: 'issues',
        class: 'h-full',
        append: [o.fb]
    })
}
