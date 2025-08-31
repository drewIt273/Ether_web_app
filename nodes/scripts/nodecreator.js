/**
 * Instance by DrewIt
 * 
 * nodecreator.js
 * co-built with GPT-5
 */

const SVG_NAMESPACE = `http://www.W3.org/2000/svg`;
const SVG_TAGS = new Set(["svg", "g", "path", "circle", "line", "polyline", "polygon", "ellipse", "text", "defs", "use", "mask", "clipPath", "linearGradient", "radialGradient", "stop"]);

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

        // Set text content
            if (key === "textContent") {
                E.textContent = String(value)
                continue;
            }
        
        // For properties like ariaLabel, dataAttributes; breakes them down to give aria-label, data-attributes
            if ((ks('aria') || ks('data') || ks('stroke')) && key.match(matchCaps)) {
                let a = key.search(matchCaps), b = key.slice(0, a), c = key.slice(a).toLowerCase(), d = b.concat('-', c); console.log(a, b, c, d);
                E.setAttribute(d, String(value))
            }
            else {
                if (key !== "tag") E.setAttribute(key, String(value))
            }

        function ks(v) {
            return key.startsWith(v)
        }
	}

	return E
}