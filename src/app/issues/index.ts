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
                            jsx('span', {style: {maxWidth: '30em', paddingBottom: '1em'}, append: [s]}),
                            jsx('div', {class: 'primary-tab', append: ["Create an Issue"]}),
                        ],
                        class: 'd-flex flex-column gap-lg'
                    })
                ]
            })
        ]
    })
}

function Issues$() {
    return jsx('div', {
        class: 'h-full',
        append: [fb()]
    })
}

export const module: UiModulesInterfaceMap['issues'] = ui.define('issues', {root: Issues$()})