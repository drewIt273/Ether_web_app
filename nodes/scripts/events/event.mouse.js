/**
 * Instance by DrewIt
 * 
 * event.mouse.js
 */

import {dom, E} from "../domquery.js"

/**
 * Sidebar local function handler
 */
!function() {
    var h = dom("[aside-state]").at(0), d = dom("#h01").at(0), e = dom("aside#sidebar-nav").at(0), da = dom('[data-event="toggle-aside-state"]').at(0), sno = dom('#sidebar-nav [data-events-effects="opacity"]'), snoh = n => {SP(n, "opacity", 0); setTimeout(() => {SP(n, "display", "none")}, 340)}, ns = (n) => {n.style = ``}, f = (s) => h.setAttribute("aside-state", s), SP = (e, p, v) => e.style.setProperty(p, v), A = (e, a) => e.getAttribute(a), epf = () => {d.classList.add("items-center"); SP(d, "width", "25px")}, nepf = () => {d.classList.remove("items-center")};

    dom("[event-click]")

        .delegate("click", () => {
            var a = A(h, "aside-state")
            if (a !== "sticky") {
                if (a == "fixed") {
                    f("absolute"); SP(d, "width", "10px"); SP(e, "margin-left", ""); da.firstElementChild.innerHTML = `<span id="n02"></span>`
                }
                if (a == "absolute") {
                    f("fixed"); SP(d, "width", "320px"); SP(e, "margin-left", ""); da.firstElementChild.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--svg-color)" aria-hidden="true" data-slot="icon" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"></path></svg>`
                }
            }
            nepf(), sno.nodes.forEach(node => {ns(node)})
        }, '[data-event="toggle-aside-state"]')

        .delegate("click", () => {
            sno.nodes.forEach(node => {snoh(node)})
            f("sticky"); setTimeout(() => {SP(e, "width", "40px")}, 570); epf()
        }, '[data-event="toggle-stickybar-state"]')

    dom("[event-hover]")

        .delegate("mouseleave", () => {
            var a = A(h, "aside-state")
            if (a === "absolute") {
                SP(e, "margin-left", "-325px")
            }
        }, "#h01")

        .delegate("mouseenter", () => {
            var a = A(h, "aside-state")
            if (a === "absolute") {
                SP(e, "margin-left", "10px")
            }
        }, "#h01")

    dom("[event-scroll]")

        .delegate("scroll", () => {
            let a = E.parentElement.querySelector('#nav-bar');
            (E.scrollTop > 0) ? SP(a, "border-color", "var(--bg-border-color)") : SP(a, "border-color", "")
        }, '[data-sidebar-section-type="container"]')
}()