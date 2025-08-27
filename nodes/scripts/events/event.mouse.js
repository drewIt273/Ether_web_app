/**
 * Instance by DrewIt
 * 
 * event.mouse.js
 */

import {dom} from "../domquery.js"

!function() {
    var h = dom("[aside-state]").at(0), d = dom("#h01").at(0), e = dom("aside#sidebar-nav").at(0), f = (s) => h.setAttribute("aside-state", s), SP = (e, p, v) => e.style.setProperty(p, v);

    dom("[event-click]")
        .delegate("click", () => {
            var a = h.getAttribute("aside-state")
            if (a === "fixed") {
                f("absolute"); SP(d, "width", "10px"); SP(e, "margin-left", "")
            }
            if (a === "absolute") {
                f("fixed"); SP(d, "width", "320px"); SP(e, "margin-left", "")
            }
        }, '[data-event="toggle-aside-state"]')

    dom("[event-hover]")

        .delegate("mouseleave", () => {
            var a = h.getAttribute("aside-state")
            if (a === "absolute") {
                SP(e, "margin-left", "-325px")
            }
        }, "#h01")

        .delegate("mouseenter", () => {
            var a = h.getAttribute("aside-state")
            if (a === "absolute") {
                SP(e, "margin-left", "10px")
            }
        }, "#h01")
}()