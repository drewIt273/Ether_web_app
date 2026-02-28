/**
 * Instance by DrewIt
 * 
 * nodecreator.js
 * co-built with GPT-5
 */

import {toKebab, isNode} from "../../nodes/scripts/any.js";
import {GlobalEvents} from "../core/runtime.js";

const SVG_NAMESPACE = `http://www.w3.org/2000/svg`;
const SVG_TAGS = new Set(["svg", "g", "rect", "path", "circle", "line", "polyline", "polygon", "ellipse", "text", "defs", "use", "mask", "clipPath", "linearGradient", "radialGradient", "stop"]);
const casiveAttrs = new Set(["viewBox"]);

/**
 * @param {object} spec { tag, ...attrs, textContent, innerHTML, append, children }
 */
function createFromSpec(spec) {
    if (!spec || typeof spec !== "object") return null;
    if (!spec.tag) return null;
    return jsx(spec.tag, spec)
}

/**
 * 
 * @param {string} tag 
 * @param {{class: string, id: string, style: {}|string, innerHTML: string, textContent: string, append: Node[], on: (e: Node), attrs: {}}} props 
 */
export function jsx(tag = "div", props = {}) {

    // Create elements with SVG namespace when appropriate
        const E = SVG_TAGS.has(tag) ? document.createElementNS(SVG_NAMESPACE, tag) : document.createElement(tag)

    // Helper to set attributes safely
        function setAttr(name, value) {
            E.setAttribute(name, value)
        }

    for (const [key, value] of Object.entries(props || {})) {

        // Skip null/undefined
            if (value == null) continue;

        // Direct element properties
            if (key === "class" || key === "className") {
                E.className = String(value)
                continue;
            }
            if (key === "id") {
                E.id = String(value)
                continue;
            }
            if (key === "style") {
                if (typeof value === "object") {
                    Object.assign(E.style, value)
                }
                else {
                    E.setAttribute("style", String(value))
                }
                continue;
            }
            if (key === "innerHTML") {
                E.innerHTML = String(value)
                continue;
            }
            if (key === "textContent") {
                E.textContent = String(value)
                continue;
            }
        
        // append. create+append element(s) from spec(s)
            if (key === "append") {
                const arr = Array.isArray(value) ? value : [value]
                for (const spec of arr) {
                    if (spec == null) continue
                    if (typeof spec === "string" || typeof spec === "number") {
                        E.appendChild(document.createTextNode(String(spec)))
                    }
                    else if (isNode(spec)) {
                        E.appendChild(spec)
                    }
                    else if (typeof spec === "object") {

                        // If spec has it own tag, we create it recursively
                            const c = createFromSpec(spec)
                            if (c) E.appendChild(c)
                    }
                }
                continue
            }

        // Event listeners onClick -> click
            if (/^on[A-Z]/.test(key) && typeof value === "function") {
                const ev = key.slice(2).toLowerCase()
                GlobalEvents.listen(ev, E, value)
                continue;
            }

        // Boolean attributes: true -> present, false -> ommited
            if (typeof value === "boolean") {
                if (value) E.setAttribute(toKebab(key), "")
                continue
            }

        // Attributes set as objects
            if (key === "attrs" && typeof value === "object") {
                for (const [a, v] of Object.entries(value)) {
                    if (casiveAttrs.has(a)) setAttr(a, v)
                    else setAttr(toKebab(a), v)
                }
                continue;
            }

        // Converts camelCase to kebab-case for attributes (dataTest -> data-test)
            if (casiveAttrs.has(key)) setAttr(key, value)
            else {
                const attr = toKebab(key)
                if (attr !== "tag") setAttr(attr, value)
            }
    }
    
    if (E.hasAttribute('attrs')) E.removeAttribute('attrs')
    
    return E
}

/** @param {string} e */
let e = e => document.createElement(e);

class HTMLBase extends HTMLElement {
    delegate(ev, handler, selector) {
        document.querySelectorAll(`${this.tagName.toLowerCase()}${selector}`).forEach(e => {
            e.addEventListener(ev, handler)
        })
    }
}
class SpanElementConstructor extends HTMLBase {
    constructor() {return e("span")}
}
class DivElementConstructor extends HTMLBase {
    constructor() {return e("div")}
}
class LiElementConstructor extends HTMLBase {
    constructor() {return e("li")}
}
class HeadingElementConstructor extends HTMLBase {
    constructor(s) {return e(`h${s}`)}
}
class QuoteElementConstructor extends HTMLBase {
    constructor() {return e("blockquote")}
}
class InputElementContructor extends HTMLBase {
    constructor() {return e('input')}
}
class LinkElementConstructor extends HTMLBase {
    constructor() {return e('link')}
}
class AnchorElementConstructor extends HTMLBase {
    constructor() {return e('a')}
}
class BrElementConstructor extends HTMLBase {
    constructor() {return e('br')}
}
class ParagraphElementConstructor extends HTMLBase {
    constructor() {return e('p')}
}

export var span = SpanElementConstructor, div = DivElementConstructor, li = LiElementConstructor, heading = HeadingElementConstructor, quote = QuoteElementConstructor, input = InputElementContructor, link = LinkElementConstructor, anchor = AnchorElementConstructor, br = BrElementConstructor, Paragraph = ParagraphElementConstructor;
