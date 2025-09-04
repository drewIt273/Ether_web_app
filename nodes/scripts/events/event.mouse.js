/**
 * Instance by DrewIt
 * 
 * event.mouse.js
 */

import {dom, E} from "../domquery.js"

var h = dom("[aside-state]").at(0), d = dom("#h01").at(0), e = dom("aside#sidebar-nav").at(0), da = dom('[data-event="toggle-aside-state"]').at(0), SP = (e, p, v) => e.style.setProperty(p, v), A = (e, a) => e.getAttribute(a);

/**
 * Sidebar local function handler
 */
!function() {

    dom("[event-click]")

        .delegate("click", () => {
            var a = A(h, "aside-state")
            if (a !== "sticky") {
                if (a == "fixed") 
                    toggle_aside_state("absolute")
                if (a == "absolute")
                    toggle_aside_state("fixed")
            }
        }, '[data-event="toggle-aside-state"]')

    dom("[event-hover]")

        .delegate("mouseenter", () => {
            var a = A(h, "aside-state")
            if (a === "absolute") {
                SP(e, "transform", "translateX(0px)")
            }
        }, "#h01")

        .delegate("mouseleave", () => {
            var a = A(h, "aside-state")
            if (a === "absolute") {
                SP(e, "transform", "translateX(-300px)")
            }
        }, "#h01")

    dom("[event-scroll]")

        .delegate("scroll", () => {
            let a = E.parentElement.querySelector('#nav-bar'), b = E.parentElement.querySelector('#aside-bottom-container');
            (E.scrollTop > 0) ? SP(a, "border-color", "var(--bg-border-color)") : SP(a, "border-color", "");
        }, '[data-sidebar-section-type="container"]')

}()

function toggle_aside_state(state) {
    let t = s => h.setAttribute("aside-state", s);
    if (state === "fixed") {
        t("fixed"); da.firstElementChild.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--svg-color)" aria-hidden="true" data-slot="icon" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"></path></svg>`
    }
    else if (state === "absolute") {
        t("absolute"); da.firstElementChild.innerHTML = `<span id="n02"></span>`
    }
};