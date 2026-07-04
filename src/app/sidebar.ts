/**
 * Instance by DrewIt
 */

import {UIComponent, UIBlock, newnode} from "@dom/ui-root";
import {onResizeX} from "./ui";
import { dom } from "./boot";

const o = new UIComponent({
    tag: 'aside',
    attrs: {
        expand: ''
    },
    append: [
        () => newnode('div', {
            className: 'p-xxs relative h-full',
            append: [
                () => newnode('div', {
                    className: 'h-center p-sm'
                }),
                new UIBlock({}),
            ]
        }),
        () => newnode('div', {className: 'col-resizer right-side'})
    ],
    UIKey: 'sidebar',
});

const d = newnode('div', {
    className: 'sidebar-con'
}); d.append(o.node)

o.on('append', () => {
    o.init()
    o.defineState('relative', () => {d.removeAttribute('collapse'); dom.GlobalEvents.unEvent(d, 'mouseleave')})('absolute', () => {d.setAttribute('collapse', ''); dom.GlobalEvents.onEvent('mouseenter', d, () => o.style({left: '0'})); dom.GlobalEvents.onEvent('mouseleave', d, () => o.style({left: '-380px'}))})
    o.setState('relative')
    let r = o.find('.col-resizer.right-side');
    o.delegate(r, 'pointerdown', onResizeX(r, o.node, {max: 370, min: 300}) as () => void)
})

const sidebar$ = () => d

export {sidebar$}
