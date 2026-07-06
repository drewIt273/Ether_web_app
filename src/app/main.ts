/**
 * Instance by DrewIt
 */

import {UIComponent} from "@dom/ui-root";

const o = new UIComponent({
    tag: 'main',
    UIKey: 'mainLayoutConstructive'
})

export const main$ = () => o.node

o.on('append', () => {
    o.init()
})