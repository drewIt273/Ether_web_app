/**
 * Instance by DrewIt
 */

import {onResizeX, toggleNodeState} from "./ui";

function sn() {
    let o = jsx('div', {
        style: {width: '35px', height: '35px', borderRadius: '14px', position: 'absolute', transition: '.3s ease-in-out'}
    }), i = (s: string) => jsx('div', {
        style: {
            padding: '8px', display: 'flex', alignItems: 'center', borderRadius: '14px', transition: 'all.3s ease-in-out', zIndex: 1
        },
        icon: '', states: {open: (n) => {o.style.background = `var(--${s})`; o.style.transform = `translateX(${n.getBoundingClientRect().left - 32}px)`}, close: () => {}}, onclick(n) {let a = (n.parentElement as HTMLElement).querySelectorAll('[icon]'); a.forEach(i => {i.$.setState('close'), f(i as HTMLElement, 'currentColor')}); n.$.setState('open');}, onmouseenter(n) {f(n, `var(--${s})`)}, onmouseleave(n) {f(n, 'currentColor')}
    }), c = (n: Node) => (n as Element).getAttribute('fill') !== 'none' ? 'fill' : 'stroke', f = (n: HTMLElement | SVGElement, s: string) => {let o = n.querySelector('svg'); if (n.$.currentstate !== 'open') o?.setAttribute(c(o), s)}
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
                                class: 'items-center w-full gap-md',
                                append: [
                                    i('cr-lightslategrey').jsx({append: [vector.rect.group]}),
                                    i('cr-blue').jsx({append: [vector.i.cube]}),
                                    i('cr-cadetblue').jsx({append: [vector.i.cubetr]}), o
                                ],
                                style : {paddingInline: '15px'}
                            })
                        ],
                        style: {paddingTop: '1em', paddingInline: '1em'}
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