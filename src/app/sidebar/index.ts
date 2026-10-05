/**
 * Instance by DrewIt
 */

import {ui} from "../module"

function $() {
    const o = {
        states: {
            active: () => {}, inactive: () => {}
        },
        class: 'tab'
    }
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
                                    jsx('div', {append: [vector.i.sq2x2], $uig: '', ...o}),
                                    jsx('div', {append: [vector.i.cubetr], $uig: '', ...o}),
                                    jsx('div', {append: [vector.i.cube], $uig: '', onclick: () => ui.load('projects'), ...o}),
                                    jsx('div', {append: [vector.viewfinder], $uig: 'issues', onclick: () => ui.load('issues'), ...o}),
                                    jsx('div', {append: [vector.calenderDays], $uig: '', ...o}),
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
                        a.forEach(n => {if (n !== e) n.$.setState('inactive')})
                        e.$.setState('active')
                    }
                })
            }
        }
    })
}

export const module: UiModulesInterfaceMap['sidebar'] = ui.define('sidebar', {root: $(), imports: ['sheet'], type: 'constructed'})