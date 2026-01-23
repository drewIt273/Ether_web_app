/**
 * Instance by DrewIt 
 * 
 * domquery.js
 */

export class query$ {

    /**
     * @param {string|Node} selector 
     */
    constructor(selector) {
        /**@type {ChildNode[]} */
        this.nodes =  (typeof selector === 'string') ? selector.startsWith('$') ? [document.querySelector(selector.replace('$',''))] : Array.from(document.querySelectorAll(selector)) : selector instanceof Node ? selector : Array.from(document.childNodes)
        this.selector = selector;
        return new Proxy(this, {
            get(target, prop) {
                // If prop exist on query$, use it
                    if (prop in target) return target[prop]
                // Otherwise, return the first property from the first element
                    return target.nodes[0]?.[prop]
            },
            set(target, prop, value) {
                target.nodes.forEach(e => {e[prop] = value})
                return true
            }
        })
    }

    #each = c => this.nodes.forEach(c)

    on(ev, callback, delay = 0) {
        this.#each(node => node.addEventListener(ev, e => {setTimeout(callback.call(this, e), delay)}))
        return this
    }

    onload(callback, timeout = 0) {
        document.addEventListener("DOMContentLoaded", () => {setTimeout(callback, timeout)})
        return this
    }

    delegate(eventType, handler, selector = "") {
        this.#each(n => n.querySelector(selector).addEventListener(eventType, handler))
        return this
    }

    hover(enter, leave, enterDelay = 0, leaveDelay = 0) {
        this.on("mouseenter", () => enter, enterDelay)
        this.on("mouseleave", () => leave, leaveDelay)
        return this
    }

    attr(a, v = "") {
        if (typeof a === "string") {
            if (v === undefined || null) return this.nodes[0]?.getAttribute(a); else this.#each(node => node.setAttribute(a, v))
        }
        else if (typeof a === "object") for (let [key, val] of Object.entries(a)) this.#each(node => node.setAttribute(key, val))
        return this
    }

    removeAttr(...attrs) {
        this.#each(node => {
            attrs.forEach(attr => node.removeAttribute(attr))
        })
        return this
    }

    append(...nodes) {
        this.#each(node => {
            nodes.forEach(n => node.appendChild(n))
        })
        return this
    }

    appendTo(target) {
        this.#each(node => {
            let t = document.querySelector(target); typeof target === 'string' ? t.innerHTML += node.innerHTML : t.append(target)
        })
        return this
    }

    remove(n = "") {
        if (n === "" || undefined) this.#each(node => node.remove());
        else if (typeof n === "string" && n !== "") this.#each(node => node.querySelectorAll(n).forEach(l => {if (node.contains(l)) l.remove()}))
        return this
    }

    at(i = 0) {
        return this.nodes[i]
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
        let g = this.nodes.filter(node => node.matches(selector)), b;
        if (g.length > 0) b = true
        else b = false
        return {
            isfound: b,
            nodes: g,
            this: this,
        }
    }

    childrenOf(selector = "", i = 0) {
        if (selector === "" || undefined) return this.nodes[i].childNodes
        else return document.querySelector(`${this.selector}${selector}`).childNodes
    }

    targetChild(selector) {
        return document.querySelector(`${this.selector} ${selector}`)
    }

    prop(n, v = "") {
        if (v === "" || undefined) return this.nodes[0]?.[n]
        else this.#each(node => {node[n] = v})
        return this
    }

    html(content = "") {
        if (content === "" || undefined) return this.nodes[0]?.innerHTML
        else this.#each(node => {node.innerHTML = content})
        return this
    }

    empty() {
        this.#each(node => node.childNodes.forEach(n => n.remove()))
        return this
    }

    fadeIn(callback, duration = 400) {
        this.#each(node => {
            
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

    fadeOut(callback, duration = 400) {
        this.#each(node => {
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

    fadeToggle(callback, duration = 400) {
        this.#each(node => {
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
        if (!all) return this.filter(selector)[0]
        else return this.filter(selector)
    }

    count() {
        return this.nodes.length
    }

    click() {
        this.#each(n => n.click());
        return this;
    }

    blur() {
        this.#each(n => n.blur())
        return this;
    }

    focus() {
        this.#each(n => n.focus())
        return this;
    }

    /**
     * @param {"add"|"remove"|"toggle"} action @param {...string} tokens 
     */
    setClass(action, ...tokens) {
        this.#each(node => {for (const token of tokens) node.classList[action]?.(token)})
        return this
    }

    classList(selector = "", index = 0) {
        if (selector !== "" || undefined) return document.querySelector(`${this.selector}${selector}`).classList
        else return this.nodes[index].classList
    }
}
