/**
 * Instance by DrewIt
 */

import {stylesheet} from "@assets/stylesheet";

export const sheet: stylesheet = new stylesheet({base: '[node-key="sidebar"]'})

sheet.css({
    '&': {
        height: '100dvh',
        width: '60px',
    },
    '.bar': {
        height: '100%',
        overflow: 'hidden',
        overflowY: 'auto',
        scrollbarWidth: 0
    },
    '.tab': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '10px',
        ':hover': {
            backgroundColor: 'var(--bg-hover-color)'
        },
        '$[active]': {
            backgroundColor: 'var(--bg-hover-color)',
            color: 'var(--cr-lightgrey)',
            boxShadow: '3px 3px 3px 0px #0000004f'
        }
    },
})
