/**
 * Instance by DrewIt
 * 
 * ejscss.js
 */

"use strict"

var
// collapsed collapsable element
ehcs = {
    height: "1e-05px",
    opacity: 0,
    position: "initial",
    "pointer-events": "none"
},

// opened collapsable element
eocs = {
    height: "auto",
    opacity: 1,
    position: "initial",
    "pointer-events": "auto"
}

function insert(node, ...css) {
    css.forEach(o => {
        for (let prop in o) {
            node.style[prop] = String(o[prop])
        }
    })
}

