/**
 * Instance by DrewIt
 */

import {UIComponent, UIBlock, newnode} from "@dom/ui-root";
import {onResizeX, toggleUINodeState} from "./ui";
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
        ($) => newnode('div', {className: 'col-resizer right-side'})
    ],
    UIKey: 'sidebar',
});

const d = newnode('div', {
    className: 'sidebar-con'
}); d.append(o.node)

o.on('append', () => {
    o.init()
    o.defineState('absolute', () => {d.setAttribute('collapse', ''); dom.GlobalEvents.onEvent('mouseenter', d, () => o.style({left: '10px'})); dom.GlobalEvents.onEvent('mouseleave', d, () => o.style({left: '-380px'}))})('relative', () => {d.removeAttribute('collapse'); dom.GlobalEvents.unEvent(d, 'mouseenter'); dom.GlobalEvents.unEvent(d, 'mouseleave'); o.style({left: 0})})
    o.setState('relative')
    let r = o.find('.col-resizer.right-side');
    o.delegate(r, 'pointerdown', onResizeX(r, o.node, {max: 370, min: 300}) as () => void)
    dom.GlobalEvents.onEvent('click', r, () => toggleUINodeState(o, 'absolute', 'relative'))
})

const sidebar$ = () => d

export {sidebar$}
