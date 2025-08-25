/**
 * Instance by DrewIt
 * 
 * ejscss.js
 */

"use strict"

var
// collapsed collapsable element
ehcs = {
    height: "0px",
    overflow: "hidden",
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
},

sidebar_absolute_state_visible = {
    left: "0px"
},

sidebar_absolute_state_hidden = {
    left: "-317px"
}

function insert(node, ...css) {
    css.forEach(o => {
        for (let prop in o) {
            var val = String(o[prop]);
            node.style[prop] = val
        }
    })
}

