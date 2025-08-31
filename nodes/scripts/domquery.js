/**
 * Instance by DrewIt 
 * 
 * domquery.js
 */

/**
 * E is a variable used by some query$ methods to reference an element, node or node list the method returns.
 * Use this only when you want to do something on the returned item.
 * 
 * Not all query$ methods sets a value for E
 */
export let E;

class query$ {

    /**
     * @param {Element} selector 
     */
    constructor(selector) {

        this.nodes = Array.from(document.querySelectorAll(selector)) /**todo: typeof selector === "string" ? Array.from(document.querySelectorAll(selector)) : selector instanceof Element ? [selector] : Array.isArray(selector) ? selector : []*/
        this.selector = selector;

        return new Proxy(this, {

            get(target, prop) {

                // If prop exist on methods$, use it
                    if (prop in target) return target[prop]

                // Otherwise, return the first property from the first element
                    return target.nodes[0]?.prop
            },

            set(target, prop, value) {

                target.nodes.forEach(e => {
                    e[prop] = value
                });
                return true
            }
        })
    }

    on(event, callback, delay = 0) {
        this.nodes.forEach(node => {
            document.body.addEventListener(event, e => {
                if (e.target.matches(node)) setTimeout(() => callback, delay)
            })
        })

        return this // For chaining
    }

    onload(callback, timeout = 0) {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(callback, timeout); E = this.nodes
        });

        return this
    }

    delegate(eventType, handler, selector = "") {
        if (selector === "" || undefined) {
            this.nodes.forEach(node => {
                node.addEventListener(eventType, handler); E = node
            })
        }
        else {
            document.querySelectorAll(`${this.selector}${selector}`).forEach(s => {
                s.addEventListener(eventType, handler); E = s;
            })
        }

        return this
    }

    hover(enter, leave, enterDelay = 0, leaveDelay = 0) {
        this.on("mouseenter", () => enter, enterDelay)
        this.on("mouseleave", () => leave, leaveDelay)

        return this
    }

    hover0(enter, leave, enterDelay = 0, leaveDelay = 0) {
        let t = this.nodes.at(0); E = t
        t.addEventListener("mouseenter", () => setTimeout(() => enter, enterDelay))
        t.addEventListener("mouseleave", () => setTimeout(() => leave, leaveDelay))

        return this
    }

    css(styleObjOrProp) {
        if (typeof styleObjOrProp === "string") {

            // Returns value of the first element
                const e = this.nodes[0];
                return e ? getComputedStyle(e).getPropertyValue(styleObjOrProp) : undefined
        }

        for (const key in styleObjOrProp) {
            const v = styleObjOrProp[key];
            if (typeof v === "object") {

                // Handle nested style block
                    if (key.startsWith('#') || key.startsWith('.') || key.startsWith('[')) {
                        this.nodes.forEach(node => {
                            const targets = node.querySelectorAll(key);
                            targets.forEach(t => {Object.assign(t.style, v);})
                        })
                    }
            }
            else if (key.startsWith('_')) {

                // Handle tag prefix like _div, _section
                    const tag = key.slice(1).toLowerCase();
                    this.nodes.forEach(node => {
                        const targets = node.querySelectorAll(tag);
                        targets.forEach(t => Object.assign(t.style, v))
                    })
            }
            else {

                // Apply to main elements
                   this.nodes.forEach(node => node.style[key] = v)
            }
        }

        return this
    }

    attr(a, v = "") {
        if (typeof a === "string") {
            if (v === undefined || null) {

                // Case 1, get attribute
                    return this.nodes[0]?.getAttribute(a);
            }
            else {

                // Case 2, set single attribute
                    this.nodes.forEach(node => node.setAttribute(a, v))
            }
        }
        else if (typeof a === "object") {

            // Case 3, set multiple attributes
                for (let [key, val] of Object.entries(a)) {
                    this.nodes.forEach(node => node.setAttribute(key, val))
                }
        }

        return this
    }

    removeAttr(...attrs) {
        this.nodes.forEach(node => {
            attrs.forEach(attr => {
                node.removeAttribute(attr)
            })
        })

        return this
    }

    append(...nodes) {
        this.nodes.forEach(node => {
            E = node
            nodes.forEach(n => {
                node.innerHTML += n
            })
        })

        return this
    }

    appendTo(target) {
        this.nodes.forEach(node => {
            document.querySelector(target).innerHTML += node.innerHTML
        })

        return this
    }

    remove(n = "") {
        if (n === "" || undefined) {
            this.nodes.forEach(node => node.remove());

            return this;
        }
        else if (typeof n === "string" && n !== "") {
            this.nodes.forEach(node => {
                let a = node.querySelectorAll(n);
                a.forEach(l => {if (node.contains(l)) l.remove()})
            })

            return this
        }
    }

    at(index = 0) {
        return this.nodes[index]
    }

    eq(index = this.count()) {
        var a = [];
        for (let i = 0; i < index; i++) {
            a.push(this.nodes[i])
        }

        return a
    }

    has(selector) {
        var a = [];
        for (let i = 0; i < this.count(); i++) {
            let n = this.nodes[i], q = n.querySelector(selector);
            if (q) a.push(n)
        }

        return a
    }

    is(selector) {
        let g = this.nodes.filter(selector), b;
        if (g.length > 0) b = true
        else b = false

        return {
            isfound: b,
            nodes: g,
            this: this,
        }
    }

    childrenOf(selector = "", i = 0) {
        if (selector === "" || undefined) {
            return this.nodes[i].childNodes
        }
        else {
            return document.querySelector(`${this.selector}${selector}`).childNodes
        }
    }

    targetChild(selector) {
        return document.querySelector(`${this.selector} ${selector}`)
    }

    prop(n, v = "") {
        if (v === "" || undefined) {

            // Get property from first element
                return this.nodes[0]?.[n]
        }
        else {

            // Set property for all elements
                this.nodes.forEach(node => {
                    node.setProperty(n, v)
                })
        }

        return this
    }

    html(content = "") {
        if (content === "" || undefined) {
            return this.nodes[0]?.innerHTML
        }
        else {
            this.nodes.forEach(node => {
                node.innerHTML = content
            })
        }

        return this
    }

    empty() {
        this.nodes.forEach(node => 
            node.childNodes.forEach(n => n.remove())
        )

        return this
    }

    fadeIn(duration = 400, callback) {
        this.nodes.forEach(node => {
            
            // Ignore if already visible an opacity is 1
                const computed = getComputedStyle(node);
                if (computed.display !== "none" || computed.opacity === 1) {
                    if (callback) callback.call(node);
                    return;
                }

            // Save original display if not already saved
                if (!node._fadeOriginalDisplay) 
                    node._fadeOriginalDisplay = computed.display === "none" ? "block" : computed.display
            
            node.style.opacity = 0; node.style.display = node._fadeOriginalDisplay; node.style.transition = `opacity ${duration}ms ease`;

            // Force reflow to apply styles before transitions
                node.offsetWidth;

            node.style.opacity = 1;

            // cleanup after transition ends
                const handler = () => {
                    node.style.transition = '';
                    node.removeEventListener("transitionend", handler)
                    if (callback) callback.call(node);
                };

            node.addEventListener("transitionend", handler);
        })

        return this
    }

    fadeOut(duration = 400, callback) {
        this.nodes.forEach(node => {
            const computed = getComputedStyle(node);
            if (computed.display === 'none') {
                if (callback) callback.call(node);
                return;
            }

            node.style.transition = `opacity ${duration}ms ease`;
            node.style.opacity = 1;

            // Force reflow so transition can happen
                node.offsetWidth;

            node.style.opacity = 0;

            const handler = (e) => {

                // Ensure the event is for opacity property
                    if (e.propertyName !== 'opacity') return;
                
                node.style.transition = '';
                node.style.display = 'none';
                node.removeEventListener('transitionend', handler);
                if (callback) callback.call(node);
            }

            node.addEventListener('transitionend', handler);
        })

        return this;
    }

    fadeToggle(duration = 400, callback) {
        this.nodes.forEach(node => {
            const computed = getComputedStyle(node);
            if (computed.display === 'none' || computed.opacity === 0) {

                // FadeIn if hidden or transparent
                    this.fadeIn.call({nodes: [node]}, duration, callback)
            }
            else {

                // FadeOut if visible
                    this.fadeOut.call({nodes: [node]}, duration, callback)
            }
        })

        return this
    }

    filter(selector) {
        return document.querySelectorAll(`${this.selector}${selector}`)
    }

    first() {
        return this.nodes[0]
    }

    find(selector, all = false) {
        if (!all) return this.filter(selector).item(0)
        else return this.filter(selector)
    }

    count() {
        return this.nodes.length
    }

    click() {
        this.nodes.forEach(n => n.click());

        return this;
    }

    blur() {
        this.nodes.forEach(n => n.blur())

        return this;
    }

    focus() {
        this.nodes.forEach(n => n.focus())

        return this;
    }

    classlist = {

        add: (...tokens) => {
            this.nodes.forEach(node => tokens.forEach(t => node.classList.add(t)))
            return this
        },

        remove: (...tokens) => {
            this.nodes.forEach(node => tokens.forEach(t => node.classList.remove(t)))
            return this
        },

        replace: (token, newToken) => {
            this.nodes.forEach(node => {
                if (Array.isArray(token)) {
                    if (typeof newToken === "string") {
                        node.classList.add(newToken);
                        token.forEach(t => node.classList.remove(t))
                    }
                    else if (Array.isArray(newToken)) {
                        token.forEach(t => node.classList.remove(t));
                        newToken.forEach(t => node.classList.add(t))
                    }
                }
                else if (typeof token === "string") {
                    if (Array.isArray(newToken)) {
                        node.classList.remove(token)
                        newToken.forEach(t => node.classList.add(t))
                    }
                    else if (typeof newToken === "string") {
                        node.classList.replace(token, newToken)
                    }
                }
                else return 0
            })

            return this
        },

        toggle: (token) => {
            this.nodes.forEach(node => {
                if (typeof token === "string") {
                    node.classList.toggle(token)
                }
                else if (Array.isArray(token)) {
                    token.forEach(t => node.classList.toggle(t))
                }
            })

            return this
        },

    }

    classList(selector = "", index = 0) {
        if (selector !== "" || undefined) {
            return document.querySelector(`${this.selector}${selector}`).classList
        }
        else return this.nodes[index].classList
    }
}

export function dom(selector) {
    return new query$(selector)
}

export function query$Extend(n, p) {
    return query$.prototype[n] = p
}
