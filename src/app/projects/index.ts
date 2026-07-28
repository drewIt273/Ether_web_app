/**
 * Instance by DrewIt
 */

import {ui} from "@app/module"

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
                            jsx('span', {style: {maxWidth: '30em', paddingBottom: '1em'}, append: [s]}),
                            jsx('div', {class: 'primary-tab', append: ["Create a Project"]}),
                        ],
                        class: 'd-flex flex-column gap-lg'
                    })
                ]
            })
        ]
    })
}

function Projects$() {
    return jsx('div', {
        class: 'h-full',
        append: [fb()]
    })
}

export const module: UiModulesInterfaceMap['projects'] = ui.define('projects', {root: Projects$()})