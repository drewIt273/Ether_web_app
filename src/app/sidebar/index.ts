/**
 * Instance by DrewIt
 */

import {ui} from "../module"

function $() {
    return jsx('aside', {
        uikey: 'sidebar',
        class: 'relative top-0 left-0',
        append: [
            jsx('div', {
                class: 'd-flex flex-column h-full',
                append: [
                    jsx('div', {
                        class: 'd-flex flex-column h-full bar',
                        append: [
                            jsx('div', {
                                class: 'items-center gap-sm flex-column p-sm py-xl',
                                append: [
                                    jsx('div', {class: 'tab', append: [vector.i.sq2x2], $uig: ''}),
                                    jsx('div', {class: 'tab', append: [vector.i.cubetr], $uig: ''}),
                                    jsx('div', {class: 'tab', append: [vector.i.cube], $uig: ''}),
                                    jsx('div', {class: 'tab', append: [vector.viewfinder], $uig: 'issues'}),
                                    jsx('div', {class: 'tab', append: [vector.calenderDays], $uig: ''}),
                                ]
                            }),
                            jsx('div', {
                                class: 'fixed bottom-0 p-sm items-center flex-column gap-sm',
                                append: []
                            })
                        ]
                    })
                ]
            })
        ],
        onclick: ($, ev) => {
            const o = Array.from($.querySelectorAll('.tab'));
            if (ev && ev.target) {
                let g = ev.target as Element
                o.forEach((e, i, a) => {
                    if ((e === g) || e.contains(g)) {
                        a.forEach(n => {if (n !== e) n.removeAttribute('active')})
                        e.setAttribute('active', '')
                    }
                })
            }
        }
    })
}

export const module: UiModulesInterfaceMap['sidebar'] = ui.define('sidebar', {root: $(), imports: ['sheet']})