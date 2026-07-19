/**
 * Instance by DrewIt
 */

import {onResizeX, toggleNodeState} from "./ui";

function sn() {
    return jsx('aside', {
        type: 'uicomp',
        expand: '',
        append: [
            jsx('div', {
                class: 'relative h-full',
                append: [
                    jsx('div', {
                        class: 'h-center p-sm',
                        append: [
                            jsx('div', {
                                type: 'uiblock',
                                class: 'items-center gap-xs',
                                append: [
                                    jsx('div', {
                                        type: 'uicell',
                                        id: 'ico',
                                        append: [jsx('div', {class: 'ico-d center'})]
                                    }),
                                ]
                            }),
                            jsx('div', {
                                class: 'd-flex gap-md',
                                append: [
                                    jsx('div', {
                                        id: 'nav-controls',
                                        append: [
                                            jsx('div', {
                                                type: 'uicell',
                                                id: 'go-left',
                                                class: 'i-tab bg-hover',
                                                append: [vector.arrow.left]
                                            }),
                                            jsx('div', {
                                                type: 'uicell',
                                                id: 'go-right',
                                                class: 'i-tab bg-hover',
                                                append: [vector.arrow.right]
                                            }),
                                        ]
                                    }),
                                    jsx('div', {
                                        id: 'tab-write-actions',
                                        class: 'i-tab bg-hover',
                                        append: [vector.document.note]
                                    })
                                ]
                            })
                        ]
                    }),
                    jsx('div', {
                        append: [
                            jsx('div', {
                                append: [
                                    jsx('div', {
                                        class: 'relative',
                                        append: [jsx('div', {class: 'items-center', style: {position: 'absolute', top: 0, left: 0},})]
                                    }),
                                    jsx('div', {
                                        class: 'h-xxs',
                                        style: {backgroundColor: 'var(--cr-blueviolet)'}
                                    })
                                ]
                            })
                        ],
                        style: {paddingTop: '3em'}
                    }),
                ]
            }),
            jsx('div', {class: 'col-resizer right-side'})
        ],
        uikey: 'sidebar',
        states: {
            absolute: () => {},
            relative: () => {},
        }
    })
}

function Sidebar$() {
    return jsx('div', {
        class: 'sidebar-con',
        append: [sn()]
    })
}

/**
o.on('append', () => {
    const dom = o.meta.belongsTo
    o.defineState('absolute', () => {d.setAttribute('collapse', ''); dom.GlobalEvents.onEvent('mouseenter', d, () => o.style({left: '10px'})); dom.GlobalEvents.onEvent('mouseleave', d, () => o.style({left: '-380px'}))})('relative', () => {d.removeAttribute('collapse'); dom.GlobalEvents.unEvent(d, 'mouseenter'); dom.GlobalEvents.unEvent(d, 'mouseleave'); o.style({left: 0})})
    o.setState('relative')
    let r = o.find('.col-resizer.right-side'), m = o.find('#tab-write-actions')
    o.delegate(r, 'pointerdown', onResizeX(r, o.node, {max: 370, min: 300}) as () => void)
    dom.GlobalEvents.onEvent('click', r, () => toggleUINodeState(o, 'absolute', 'relative'))
})
*/

export {Sidebar$}