/**
 * Instance by DrewIt
 */

import {ui} from "../module"

type ProjectRecord = Record<DBObjectProject["id"], DBObjectProject>

let Projects: ProjectRecord | null = null

async function issueInit() {
    if (!Projects) Projects = await edb.getObjectStore("projects")
}

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

function ah(n: HTMLElement) {
    const o = getNodeByUIKey('popup-layer'), m = getNodeByUIKey('main'), k = Array.from(o.childNodes).find(g => (g as Element).hasAttribute('modal') && g !== n)
    if (k) {
        if (k !== n) k.remove()
        else return;
    }
    if (n.hasAttribute('modal')) m.jsx({fade: true}), o.appendChild(n)
}

const o = {
    fb: fb(),
    cr: cr()
}

export const module: UiModulesInterfaceMap['projects'] = ui.define('projects', {root: Projects$(), onImport: async () => await issueInit(), onMount: () => module.root.node.append(th()), type: 'constructed'})

ui.defineProperty('projects', 'fbui', o.fb)('sui', o.cr)('opensui', () => {ah(module.sui as HTMLElement), module.sui?.$.motion.play('fadeIn')})('closesui', () => {module.sui?.$.motion.play('fadeOut'), getNodeByUIKey('main').jsx({fade: false})})('o', {defObject: {name: '', id: 'I0'}})

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
                        placeholder: 'Project title',
                        class: 'pb-md mt-xs',
                        style: {
                            fontSize: 'var(--size-lg)',
                            color: 'var(--cr-white)'
                        },
                        oninput: (n) => {
                            if (n.textContent.length !== 0) n.jsx({placeholder: false})
                            else n.jsx({placeholder: 'Project title'}), n.textContent = '';
                            module.o.defObject.name = n.textContent
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
                            if (n.textContent.length !== 0) n.jsx({placeholder: false})
                            else n.jsx({placeholder: 'Add description...'}), n.textContent = '';
                            module.o.defObject.desc = n.textContent
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
                        append: ['Create Project'],
                        onclick: async () => {
                            let now = new Date(), o: DBObjectProject = {createdAt: now, updatedAt: now, issues: [], ...module.o.defObject};
                            if (o.name) {
                                o.id = `P${await edb.size("issues")+1}`
                                edb.putRecord('projects', o), module.o.defObject = {name: '', id: 'P0'}
                            }
                            module.closesui()
                        }
                    })
                ]
            })
        ],
        anims: {
            "fadeIn": {
                keys: [{opacity: 0, transform: 'scale(.7)'}, {opacity: 1, transform: 'scale(1)'}],
                opts: {duration: 300, easing: 'cubic-bezier(0, 0, 0, 1.24)'}
            },
            "fadeOut": {
                keys: [{opacity: 1, transform: 'scale(1)'}, {opacity: 0, transform: 'scale(.7)'}],
                opts: {duration: 300, easing: 'cubic-bezier(0, 0, 0, 1.24)', onfinish: n => (n as ChildNode).remove()}
            }
        }
    })
}

function th() {
    const s = storageapi.o.get('projects')
    return s ? document.createElement('div') : o.fb
}

function Projects$() {
    return jsx('div', {
        class: 'h-full',
        append: [o.fb]
    })
}

declare global {
    interface projectsConstructiveModule {
        opensui: Handler
        closesui: Handler
        fbui: HTMLDivElement
        o: {
            defObject: ProjectObjectCreation
        }
    }
}