/**
 * Instance by DrewIt
 * 
 * nodecreator.js
 * co-built with GPT-5
 */

"use strict";

const SVG_NAMESPACE = `http://www.w3.org/2000/svg`;
const SVG_TAGS = new Set(["svg", "g", "path", "circle", "line", "polyline", "polygon", "ellipse", "text", "defs", "use", "mask", "clipPath", "linearGradient", "radialGradient", "stop"]);
const casiveAttrs = new Set(["viewBox"]);

function isNode(v) {return v instanceof Node}

/**
 * Converts camelCase or pascalCase to kebab-case: myAttrName -> my-attr-name
 * @param {string} s 
 */
function toKebab(s) {
    return String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * @param {object} spec { tag, ...attrs, textContent, innerHTML, append, children }
 */
function createFromSpec(spec) {
    if (!spec || typeof spec !== "object") return null;
    if (!spec.tag) return null;
    return jsx(spec.tag, spec)
}

export function jsx(tag = "div", obj = {}) {
    if (!tag) tag = "div"

    // Create elements with SVG namespace when appropriate
        const useNS = SVG_TAGS.has(tag)
        const E = useNS ? document.createElementNS(SVG_NAMESPACE, tag) : document.createElement(tag)

    // Helper to set attributes safely
        function setAttr(name, value) {
            E.setAttribute(name, value)
        }

    for (const [key, value] of Object.entries(obj || {})) {

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
                E.addEventListener(ev, value)
                continue;
            }

        // Boolean attributes: true -> present, false -> ommited
            if (typeof value === "boolean") {
                if (value) E.setAttribute(toKebab(key), "")
                continue
            }

        // Converts camelCase to kebab-case for attributes (dataTest -> data-test)
            if (casiveAttrs.has(key)) setAttr(key, value)
            else {
                const attr = toKebab(key)
                if (attr !== "tag") setAttr(attr, value)
            }
    }

    return E
}

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";
const XML_NS  = "http://www.w3.org/XML/1998/namespace";

function normalizeChildrenArg(attrs, explicitChildren) {
    // Priority: explicitChildren (argument) > attrs.children > attrs.append
        if (explicitChildren && explicitChildren.length) return explicitChildren
        if (Array.isArray(attrs.children)) return attrs.children
        if (Array.isArray(attrs.append)) return attrs.append
        if (attrs.children != null) return [attrs.children]
        if (attrs.append != null) return [attrs.append]
        return []
}

/**
 * 
 * @param {Element} e 
 * @param {string} n 
 * @param {} v  
 */
// Namsespaced-aware setter for svg
    function setSVGAttr(e, n, v) {
        if (v == null) return;

        // Namespaced attributes
            if (n.startsWith("xlink:")) {
                e.setAttributeNS(XLINK_NS, n, String(v))
                return;
            }
            if (n.startsWith("xml:")) {
                e.setAttribute(XML_NS, n, String(v))
                return;
            }
            if (typeof v === "boolean") {
                if (v) e.setAttribute(n, "")
                else e.removeAttribute(n)
                return;
            }

        // default: set attribute with provided casing (important for viewBox, preserveAspectRatio, etc.)
            e.setAttribute(n, String(v))
    }

// Create element from spec recursively
    function createSVGFromSpec(spec) {
        if (spec == null) return null;
        if (isNode(spec)) return spec;
        if (typeof spec === "string" || typeof spec === "number") {
            return document.createTextNode(String(spec))
        }
        if (typeof spec !== "object" || !spec.tag) return null;
        const attrs = spec.attrs || {}
        const children = spec.children || spec.append || spec.c || [];
        const node = vector(spec.tag, attrs, children);
        if (spec.textContent != null) node.textContent = String(spec.textContent);
        if (spec.innerHTML != null) node.innerHTML = String(spec.innerHTML); // caution: avoid if untrusted
        return node
    }

export function vector(tag = "g", attrs = {}, children = []) {
    if (!tag) tag = 'g'
    const E = document.createElementNS(SVG_NS, tag)

    // Normalize children (attrs.children / attrs.append are allowed)
        const mergedChildren = normalizeChildrenArg(attrs, Array.isArray(children) ? children : (children ? [children] : []));
    
    // apply attributes in attrs (skip special control keys)
        for (const [rawKey, rawValue] of Object.entries(attrs || {})) {
            if (rawValue == null) continue;

            // skip special control keys
                if (["children","append","c","textContent","innerHTML"].includes(rawKey)) continue;

            // class handling
                if (rawKey === "class" || rawKey === "className") {
                    // for SVG prefer setAttribute('class', ...)
                        E.setAttribute("class", String(rawValue));
                        continue;
                }

            // style: accept object or string; for SVG we can set style.cssText or attributes individually
                if (rawKey === "style") {
                    if (typeof rawValue === "object") {

                    // assign each style property (camelCase or kebab accepted)
                        for (const [k, v] of Object.entries(rawValue)) {

                            // prefer CSSStyleDeclaration when possible
                                try { E.style[k] = v; } catch(e) { /* fallback */ E.style.setProperty(k, v); }
                        }
                    }
                    else {
                        E.setAttribute("style", String(rawValue));
                    }
                    continue;
                }

            // event handlers: onClick -> click
                if (/^on[A-Z]/.test(rawKey) && typeof rawValue === "function") {
                    const evt = rawKey.slice(2).toLowerCase();
                    E.addEventListener(evt, rawValue);
                    continue;
                }

            // id handling (common)
                if (rawKey === "id") {
                    E.id = String(rawValue);
                    continue;
                }
            
            // data-attributes handle
                if (/^data[A-Z]/.test(rawKey) || /^aria[A-Z]/.test(rawKey)) {
                    let a = toKebab(rawKey);
                    E.setAttribute(a, String(rawValue))
                    continue;
                }

            // default: SVG attributes — keep original casing (important)
                setSVGAttr(E, rawKey, rawValue);
        }

    // append children
        for (const child of mergedChildren) {
            if (child == null || child === false) continue;
            if (isNode(child)) {
                E.appendChild(child);
            }
            else if (typeof child === "string" || typeof child === "number") {
                E.appendChild(document.createTextNode(String(child)));
            }
            else if (Array.isArray(child)) {
                // flatten nested arrays
                    for (const c of child) {
                        const node = createSVGFromSpec(c);
                        if (node) E.appendChild(node);
                    }
            }
            else if (typeof child === "object") {
                const node = createSVGFromSpec(child);
                if (node) E.appendChild(node);
            }
        }

    return E
}

/**  Usage examples
    const svg1 = vector("svg", { width: 200, height: 200, viewBox: "0 0 100 100", style: { border: "1px solid #ddd" } }, [
        { tag: "circle", attrs: { cx: 50, cy: 50, r: 40, fill: "tomato" } },
        { tag: "text", attrs: { x: 50, y: 55, "text-anchor": "middle", "font-size": "12px", fill: "#fff" }, textContent: "OK" }
    ]);
    const defs = vector("defs", {}, [
        { tag: "image", attrs: { id: "img1", width: 50, height: 50, "xlink:href": "https://example.com/icon.png" } }
    ]);
    const svg2 = vector("svg", { width: 100, height: 100, viewBox: "0 0 100 100" }, [
        defs,
        { tag: "use", attrs: { "x": 10, "y": 10, "xlink:href": "#img1" } }
    ]);
*/

/**
 * @param {string} e 
 */
var e = e => document.createElement(e);

class HTMLBase extends HTMLElement {
    addClass = (...t) => {
        t.forEach(t => this.classList.add(t))
    }
}

class SpanElementConstructor extends HTMLBase {
    constructor () {
        return e("span")
    }
}

class DivElementConstructor extends HTMLBase {
    constructor () {
        return e("div")
    }
}

class LiElementConstructor extends HTMLBase {
    constructor () {
        return e("li")
    }
}

class HeadingElementConstructor extends HTMLBase {
    constructor (s) {
        return e(`h${s}`)
    }
}

class QuoteElementConstructor extends HTMLBase {
    constructor () {
        return e("blockquote")
    }
}

class InputElementContructor extends HTMLBase {
    constructor () {
        return e('input')
    }
}

class LinkElementConstructor extends HTMLBase {
    constructor () {
        return e('link')
    }
}

class AnchorElementConstructor extends HTMLBase {
    constructor () {
        return e('a')
    }
}

class BrElementConstructor extends HTMLBase {
    constructor () {
        return e('br')
    }
}

class ParagraphElementConstructor extends HTMLBase {
    constructor () {
        return e('p')
    }
}

export var span = SpanElementConstructor, div = DivElementConstructor, li = LiElementConstructor, heading = HeadingElementConstructor, quote = QuoteElementConstructor, input = InputElementContructor, link = LinkElementConstructor, anchor = AnchorElementConstructor, br = BrElementConstructor, Paragraph = ParagraphElementConstructor;
