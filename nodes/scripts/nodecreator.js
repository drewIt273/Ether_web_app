/**
 * Instance by DrewIt
 * 
 * nodecreator.js
 */

export function jsx(tag = "", obj = {}) {
	const E = document.createElement(tag), matchCaps = /[A-Z]/g

    // Set default svg attribute
        if (tag === "svg") {
            E.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        }

    for (const [key, value] of Object.entries(obj)) {

        // Set className
            if (key === "class") {
                E.className = String(value)
                continue;
            }

        // Set id
            if (key === "id") {
                E.id = String(value)
                continue;
            }

        // Set style object
            if (key === "style") {
                if (typeof value === "object") {
                    Object.assign(E.style, value)
                }
                continue;
            }

        // Set innerHTML. Don't use along with append
            if (key === "innerHTML" && typeof value === "string") {
                E.innerHTML = value
                continue;
            }

        // Set children. Don't use along with innerHTML
            if (key === "append") {
                if (typeof value === "object") {
                    let h;
                    for (const [o, v] of Object.entries(value)) {
                        if (o === "tag") {
                            h = jsx(String(v), value);
                            E.appendChild(h)
                        }
                    }
                }
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