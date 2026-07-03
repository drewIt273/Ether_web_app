/**
 * Instance by DrewIt
 */

import {UIComponent, newnode} from "@dom/ui-root";

const sidebar = new UIComponent({
    tag: 'aside',
    attrs: {
        expand: ''
    },
    append: [
        newnode('div', {
            className: 'col-resizer right-side',
            on: ['click', () => {
                console.log('It seems to work!')
            }]
        })
    ],
    UIKey: 'sidebar',
});

sidebar.on('append', () => {
    sidebar.defineState('relative')('relative')
    sidebar.setState('relative')
})

const fn = () => sidebar

export {fn}

console.log(Date.now())