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
        this.nodes =  (typeof selector === 'string') ? selector.startsWith('$') ? [document.querySelector(selector.replace('$',''))] : Array.from(document.querySelectorAll(selector)) : selector instanceof Node ? [selector] : Array.from(document.childNodes)
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
            let t = typeof target === 'string' ? document.querySelector(target) : t
            t.appendChild(node)
        })
        return this
    }

    remove(n = "") {
        if (n === "" || undefined) this.#each(node => node.remove());
        else if (typeof n === "string") this.#each(node => node.querySelectorAll(n).forEach(l => {if (node.contains(l)) l.remove()}))
        return this
    }

    at(i = 0) {
        return this.nodes[i]
    }

    eq(index = this.count()) {
        let a = [];
        for (let i = 0; i < index; i++) {
            a.push(this.nodes[i])
        }
        return a
    }

    has(selector) {
        let a = [];
        for (let i = 0; i < this.count(); i++) {
            let n = this.nodes[i], q = n.querySelector(selector);
            if (q) a.push(n)
        }
        return a
    }

    is(selector) {
        let g = this.nodes.filter(node => node.matches(selector)), b;
        if (g.length) b = !0
        else b = !1
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
