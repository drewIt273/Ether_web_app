/**
 * Instance by DrewIt
 */

import {onResizeX, toggleStateOf} from "./ui";

function sn() {
    let v = () => {
        return {
            open: (n: HTMLElement | SVGElement) => {},
            close: (n: HTMLElement | SVGElement) => {}
        }
    }, e = () => {
        return {
            expanded: (n: HNode) => n.parentElement?.querySelector('#eobj')?.setAttribute('open', 'true'),
            close: (n: HNode) => n.parentElement?.querySelector('#eobj')?.setAttribute('open', 'false')
        }
    }, b = {states: v(), abcon: ''}, se = (n: Node, s: string) => n.$.setState(s)
    const k = jsx('div', {
        append: [
            jsx('div', {
                style: {display: 'flex', flexDirection: 'column', gap: '5px', paddingInline: '5px'},
                append: [
                    jsx('div', {
                        class: 'htab',
                        append: [
                            jsx('div', {
                                append: [jsx('span', {append: [vector.viewfinder.jsx({width: 16, height: 16, strokeWidth: 3})], i: true}), jsx('span', {append: ["Issues"]})],
                                hasIcon: true
                            }),
                            jsx('div', {
                                append: [jsx('span', {append: [vector.ellipsis.horizontal], class: 'center opts no-trans'})]
                            })
                        ]
                    }),
                    jsx('div', {
                        class: 'htab',
                        append: [
                            jsx('div', {
                                append: [jsx('span', {append: [vector.i.cube.jsx({width: 16, height: 16})], i: true}), jsx('span', {append: ["Projects"]})],
                                hasIcon: true
                            }),
                            jsx('div', {
                                append: [jsx('span', {append: [vector.ellipsis.horizontal], class: 'center opts no-trans'})]
                            })
                        ]
                    }),
                    jsx('div', {
                        class: 'htab',
                        append: [
                            jsx('div', {
                                append: [jsx('span', {append: [vector.calender.jsx({wdith: 16, height: 16})], i: true}), jsx('span', {append: ["Schedule"]})],
                                hasIcon: true
                            }),
                            jsx('div', {
                                append: [jsx('span', {append: [vector.ellipsis.horizontal], class: 'center opts no-trans'})]
                            })
                        ]
                    }),
                ]
            }),
            jsx('div', {style: {paddingBlock: '1em'}}),
            jsx('div', {
                append: [
                    jsx('div', {
                        uikey: 'a-workspace-expander--1', class: 'expander items-center justify-between pt-md',
                        states: e(),
                        onclick: (n) => toggleStateOf(n, 'expanded', 'close'),
                        append: ["documents", jsx('span', {append: [vector.chevron.right.jsx({width: 16, height: 16})], dataSlot: 'icon'})]
                    }),
                    jsx('div', {
                        id: 'eobj',
                        append: [function() {
                            const o = storageapi.o.get('userdocs'), n = jsx('div', {})
                            if (o && Object.entries(o).length) {
                                for (const k of Object.entries(o)) {
                                    n.jsx({append: [jsx('div', {append: [k[0]]})]})
                                }
                            }
                            else n.jsx({class: 'center pb-xl pt-xl flex-column gap-sm', append: [jsx('span', {append: [vector.document.text]}), "no documents available", jsx('div', {class: 'primary-tab', append: ["Create"]})]})
                            return n
                        }]
                    })
                ],
                style: {paddingInline: '20px'}
            }),
            jsx('div', {
                append: [
                    jsx('div', {
                        uikey: 'a-tasks-expander--1', class: 'expander items-center justify-between pt-md',
                        states: e(),
                        onclick: (n) => toggleStateOf(n, 'expanded', 'close'),
                        append: ["tasks", jsx('span', {append: [vector.chevron.right.jsx({width: 16, height: 16})], dataSlot: 'icon'})]
                    }),
                    jsx('div', {
                        id: 'eobj',
                        append: [jsx('div', {
                            class: 'd-flex flex-column gap-md px-sm py-md',
                            append: [
                                jsx('div', {class: 'd-flex gap-xs', append: [jsx('span', {class: 'items-center gap-xs', append: [vector.bell, "Current"]})]}),
                                jsx('div', {class: 'd-flex gap-xs', append: [jsx('span', {class: 'items-center gap-xs', append: [vector.clock, "Upcoming"]})]})
                            ]
                        })]
                    })
                ],
                style: {paddingInline: '20px'}
            })
        ],
        ...b
    }), l = jsx('div', {
        ...b
    }), m = jsx('div', {
        ...b
    }), p = [k, l, m];
    let o = jsx('div', {style: {width: '35px', height: '35px', borderRadius: '14px', position: 'absolute', transition: '.3s ease-in-out'}}),
    i = (s: string, x: HTMLElement) => jsx('div', {
        style: {
            padding: '8px', display: 'flex', alignItems: 'center', borderRadius: '14px', transition: 'all.3s ease-in-out', zIndex: 1
        }, icon: true, states: {
            open: (n) => {o.style.background = `var(--${s})`, o.style.transform = `translateX(${n.getBoundingClientRect().left - 10}px)`, p.forEach(e => {if (e !== x) se(e, 'close')}), se(x, 'open')},
            close: () => {}
        }, onclick(n) {let a = (n.parentElement as HTMLElement).querySelectorAll('[icon]'); a.forEach(i => {se(i, 'close'), f(i as HTMLElement, 'currentColor')}); se(n, 'open');}, onmouseenter(n) {f(n, `var(--${s})`)}, onmouseleave(n) {f(n, 'currentColor')}
    }), c = (n: Node) => (n as Element).getAttribute('fill') !== 'none' ? 'fill' : 'stroke', f = (n: HTMLElement | SVGElement, s: string) => {let o = n.querySelector('svg'); if (n.$.currentstate !== 'open') o?.setAttribute(c(o), s)};

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
                                        class: 'i-tab bg-hover',
                                        append: [vector.rect.group]
                                    }),
                                    jsx('div', {
                                        id: 'nav-controls',
                                        append: [
                                            jsx('div', {
                                                type: 'uicell',
                                                id: 'go-left',
                                                class: 'i-tab bg-hover center',
                                                append: [vector.chevron.left.jsx({width: 16, height: 16})]
                                            }),
                                            jsx('div', {
                                                type: 'uicell',
                                                id: 'go-right',
                                                class: 'i-tab bg-hover center',
                                                append: [vector.chevron.right.jsx({width: 16, height: 16})]
                                            }),
                                        ]
                                    }),
                                ]
                            }),
                            jsx('div', {
                                class: 'd-flex gap-md',
                                append: [
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
                                    i('cr-lightslategrey', k).jsx({append: [vector.rect.group], uikey: 'a-workspace-b'}),
                                    i('cr-blue', l).jsx({append: [vector.i.cube], uikey: 'a-projects-b'}),
                                    i('cr-cadetblue', m).jsx({append: [vector.i.cubetr], uikey: 'a-spaces-b'}), o
                                ],
                            })
                        ],
                        style: {paddingBlock: '1em', paddingInline: 'var(--space-xs)'}
                    }),
                    jsx('div', {
                        type: 'uicomp',
                        id: 'asideContent',
                        class: 'pt-md pl-sm pr-sm pb-sm',
                        append: p
                    })
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