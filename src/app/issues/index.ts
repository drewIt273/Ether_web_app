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
        class: 'd-flex justify-center h-full w-full',
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
            if (!n.querySelector('[modal]')?.contains(e?.target as Element)) n.$.setState('inactive'), n.remove()
        }
    })
}

function pl(s: string) {
    return `<span placeholder style="opacity: .6; position: absolute;">${s}</span>`
}

function cr() {
    return jsx('div', {
        modal: true,
        class: 'relative rounded-lg h-fit shadow-1',
        style: {
            background: '#262424',
            width: '630px',
            top: '8em',
            border: '1px solid var(--bg-border-color)',
        },
        append: [
            jsx('div', {
                class: 'd-flex'
            }),
            jsx('div', {
                editableContent: true,
                append: [
                    jsx('div', {
                        contenteditable: true,
                        placeholder: 'Issue title',
                        class: 'pb-md mt-xs',
                        style: {
                            fontSize: 'var(--size-lg)',
                            color: 'var(--cr-white)'
                        },
                        oninput: (n) => {
                            if (n.textContent.length !== 0) n.removeAttribute('placeholder')
                            else n.jsx({placeholder: 'Issue title'}), n.textContent = ''
                        }
                    }),
                    jsx('div', {
                        contenteditable: true,
                        placeholder: 'Add description...',
                        class: 'pb-md',
                        style: {
                            fontSize: 'var(--size-md)',
                            color: 'var(--cr-lightgrey)',
                            minHeight: '50px'
                        },
                        oninput: (n) => {
                            if (n.textContent.length !== 0) n.removeAttribute('placeholder')
                            else n.jsx({placeholder: 'Add description...'}), n.textContent = ''
                        }
                    }),
                ],
                style: {
                    padding: '10px 20px'
                }
            }),
            jsx('div', {
                class: 'd-flex items-center gap-xs p-sm',
                append: [
                    jsx('div', {
                        class: 'secondrary-tab',
                        append: [jsx('span', {class: 'h-center', append: [vector.i.cube.jsx({class: 'size-2'})]}), 'Project']
                    }),
                    jsx('div', {
                        class: 'secondrary-tab',
                        append: [jsx('span', {class: 'h-center', append: [vector.ellipsis.horizontal]})]
                    })
                ]
            }),
            jsx('div', {
                class: 'd-flex justify-between items-center',
                style: {
                    borderTop: '1px solid var(--bg-border-color)',
                    padding: '10px 20px'
                },
                append: [
                    jsx('div', {}),
                    jsx('div', {
                        class: "primary-tab",
                        append: ['Create Issue']
                    })
                ]
            })
        ]
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
    cr: cr()
}

export const module: UiModulesInterfaceMap['issues'] = ui.define('issues', {root: Issues$(), onMount: () => module.root.node.append(th()), type: 'constructed', imports: ['sheet']})
// @ts-expect-error
ui.defineProperty('issues', 'fbui', o.fb)('sui', o.sui)('opensui', () => ah(module.sui?.jsx({append: [o.cr]})))('closesui', () => module.sui.setState('inactive'))

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
