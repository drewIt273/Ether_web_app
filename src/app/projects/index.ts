/**
 * Instance by DrewIt
 */

import {ui} from "../module"

function fb() {
    let s = 'A project is a container for related tasks, deadlines, files, and collaborators that organizes work toward a specific goal, using milestones, priorities, and progress tracking to coordinate effort and measure completion.'
    return jsx('div', {
        class: 'd-flex justify-center h-full',
        append: [
            jsx('div', {
                class: 'items-center gap-xl h-full',
                append: [
                    jsx('div', {
                        append: [
                            jsx('div', {class: 'app-vector', append: [vector.app.blocks]}),
                            jsx('span', {class: 'h4', append: ["Projects"]}),
                            jsx('span', {style: {maxWidth: '30em', paddingBottom: '1em'}, append: [s]}),
                            jsx('div', {class: 'primary-tab', append: ["Create new project"], onclick: () => {module.opensui?.()}}),
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

const o = {
    fb: fb(),
    sui: sui(),
}

function ah(n: HTMLElement) {
    const o = getNodeByUIKey('popup-layer'), a = Array.from(o.childNodes), k = a.find(g => (g as Element).hasAttribute('popup'))
    if (k) {
        if (k !== n) k.remove()
        else return;
    }
    if (n.hasAttribute('popup')) o.appendChild(n)
}

function th() {
    const o = storageapi.o.get('projects')
    return o ? document.createElement('div') : o.fb
}

function Projects$() {
    return jsx('div', {
        class: 'h-full',
        append: [o.fb]
    })
}

export const module: UiModulesInterfaceMap['projects'] = ui.define('projects', {root: Projects$(), onMount: () => module.root.node.append(th()), type: 'constructed'})
// @ts-expect-error
ui.defineProperty('projects', 'fbui', o.fb)('sui', o.sui)('opensui', () => ah(module.sui))('closesui', () => module.sui.setState('inactive'))
