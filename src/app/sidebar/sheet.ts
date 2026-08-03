/**
 * Instance by DrewIt
 */

import {stylesheet} from "@assets/stylesheet";

export const sheet: stylesheet = new stylesheet({base: '[node-key="sidebar"]'})

sheet.css({
    '&': {
        height: '100dvh',
        width: '300px',
    },
    '.itab, [icon]': {
        color: 'var(--fg-base-color)'
    },
    '#nav-controls': {
        display: 'flex',
        gap: '6px'
    },
    "#asidecontent": {
        position: 'relative',
        height: 'calc(100dvh - 8em)',
        overflow: 'hidden',
        overflowY: 'auto',
        '[abcon]': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'calc(100dvh - 8em)',
            overflow: 'hidden',
            overflowY: 'auto',
            padding: '10px 0',
        },
    }
})
