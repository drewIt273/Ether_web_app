/**
 * Instance by DrewIt
 * 
 * any.js
 * co-built with GPT-5
 */

/**
 * Converts camelCase or pascalCase to kebab-case: myAttrName -> my-attr-name
 * @param {string} s 
 */
export function toKebab(s) {
    return String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export const isNode = v => v instanceof Node

/** @param {Node} v */
export const hasNode = v => isNode(v) && document.contains(v)

export const isArray = a => Array.isArray(a)

/** @param {string} v */
export const isString = v => typeof v === "string"

/**
 * @param {Element} e @param {string} a
 */
export const hasAttr = (e, a) => e.hasAttribute(a)

/**
 * Returns a random whole number between min and max inclusively.
 * @param {number} min @param {number} max 
 */
export const $ran = (min, max) => Math.round(Math.random() * (max - min) + min)

/**
 * Returns a random string whose length is specified.
 * @param {number} length The length of each string block.
 * @param {number} count The number of string blocks seperated with '-'.
 * @param {string} end The optional string to be added at the end.
 */
export const ranstring = (length, count, end = '') => {
    const chars = 'abcdefd', vchars = chars + '1234567890';
    let f = (s, c) => Array.from({length: c}, () => s[Math.floor(Math.random() * s.length)]).join(''), key = f(chars, 1);
    key += Array.from({length: count}, () => f(vchars, length)).join('-')

    return (end.length) ? key += `${end}` : key
}

/**
 * Returns true if o is strictly an object
 * @param {*} o 
 */
export const strictObject = o => o !== null && typeof o === "object" && o?.constructor === Object

/**
 * Returns the computed style property of an element
 * @param {Element} e @param {string} p 
 */
export const getStyle = (e, p) => getComputedStyle(e)?.[p]

/**
 * Set an inline property style of an element
 * @param {Element} e Element @param {String} p CSSProperty @param {String} v CSSValue
 */
export const setStyle = (e, p, v) => e.style.setProperty(p, v)

export class Registry {

    /**
     * @param {{}} src 
     */
    constructor(src = {}) {
        /**A reference to the registry object */
        this.reg = strictObject(src) ? {...src} : {}
    }

    #generatekey() {
        const chars = 'ABCDabcdef1234567890'
        let key;
        do {
            key = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }
        while (this.reg.hasOwnProperty(key))
        return key
    }

    /**
     * Writes data into the registry and returns its key.
     * @param {*} data The data of any type which needs to be written in the registry.
     * @param {string} key The key to which the data will be attached. Generated automatically if not specified.
     */
    write(data, key = '') {
        if (!isString(key) || !key || key === '') key = this.#generatekey()
        this.reg[key] = data
        return key
    }

    /**
     * Performs the specified action for each element in the registry.
     * @param {(value: any, key: string)} callback 
     */
    forEach(callback) {
        Object.entries(this.reg).forEach(([key, value]) => callback(value, key));
        return this
    }

    /**
     * Returns the value at a given key.
     * @param {string} key 
     */
    get(key) {
        return this.reg[key]
    }

    /**
     * Removes the specifed key from the registry.
     * @param {string} key 
     */
    remove(key) {
        delete this.reg[key]
        return this
    }

    /**
     * Returns the key of the specified value v if found in the registry.
     * @param {any} v 
     */
    keyOf(v) {
        for (const [k, a] of Object.entries(this.reg)) {
            if (v === a) return k
        }
    }

    /**
     * Find first value where predicate returns true.
     * @param {(value: any, key: string) => boolean} predicate 
     */
    find(predicate) {
        for (const [key, value] of Object.entries(this.reg)) {
            if (predicate(value, key)) return value;
        }
        return null
    }

    /**
     * Filter enteries where predicate returns true.
     * @param {(value: any, key: string)} predicate 
     */
    filter(predicate) {
        const filtered = {}
        Object.entries(this.reg).forEach(([key, value]) => {
            if (predicate(value, key)) filtered[key] = value
        })
        return new Registry(filtered)
    }

    /**
     * 
     * @param {(value: any, key: string)} predicate 
     */
    mutate(predicate) {
        for (const [k, v] of Object.entries(this.reg)) {
            if (predicate(v, k)) {
                this.reg = Object.defineProperty(this.reg, k, v)
            }
        }
        return this.reg
    }

    /**
     * Merge other Registries into this one
     * @param  {...Registry} others 
     */
    merge(...others) {
        others.forEach(other => {
            if (other instanceof Registry) {
                Object.entries(other.reg).forEach(([key, value]) => {
                    this.reg[key] = value;
                })
            }
            else {
                let k = this.#generatekey();
                Object.assign(this.reg, {[k]: other})
            }
        })
        return this
    }

    /**
     * Removes elements from this registry and, if necessary, inserts new elements in their place.
     * @param {number} start @param {number} deleteCount @param {...any} items 
     */
    splice(start, deleteCount, ...items) {
        return Object.entries(this.reg).splice(start, deleteCount, ...items)
    }

    /**
     * Determines whether this registry includes a certain key, returning true or false as appropriate.
     * @param {string} key The key to check in the registry
     */
    includesKey(key) {
        return Object.keys(this.reg).includes(key)
    }

    /**
     * Determines whether this registry includes a certain value, returning true or false as appropriate.
     * @param {*} value 
     */
    includesValue(value) {
        for (const [k, v] of Object.entries(this.reg)) {
            if (value === v) return !0
        }
        return !1
    }

    get size() {
        return Object.keys(this.reg).length
    }

    get values() {
        return Object.values(this.reg)
    }

    /**
     * Clear all enteries
     */
    clear() {
        this.reg = {}
        return this
    }
}

/**
 * @param {Node|string} s 
 * @returns {Node|null}
 */
export const find = s => isString(s) ? document.querySelector(s) : hasNode(s) ? s : null

/**
 * @param {string} s 
 */
export const findAll = s => isString(s) ? Array.from(document.querySelectorAll(s)) : null

/**
 * @param {string} e 
 */
export const create = e => document.createElement(e)

/**
 * @param {Element} e @param {string} a @param {string} v 
 */
export const dataset = (e, a, v) => e.setAttribute(`data-${toKebab(a)}`, v)

/**
 * @param {Element} e @param {string} a @param {string} v 
 */
export const setAttr = (e, a, v) => e.setAttribute(a, v)

/**
 * @param {Element} e @param {string} a 
 */
export const removeAttr = (e, a) => hasAttr(e, a) ? e.removeAttribute(a) : null

/**
 * Removes event listeners from nodes in the DOM
 * @param {NodeListOf<Node>} nodes should be a query result @param {string} ev @param {Function} handler 
 */
export const removeListeners = (nodes, ev, handler) => Array.from(nodes).forEach(node => {node.removeEventListener(ev, handler)})

/**A registry for nodes still having active listeners in the DOM */
export const activeListeners = new Registry

/**A registry for nodes whose event listeners where removed from the DOM */
export const backlogListeners = new Registry

/**A registry for deleted nodes */
export const backlogNodes = new Registry

/**Track which global events are already delegated @type {Set<string>} */
export const ActiveGlobals = new Set()

/**Stores references to global delegated listeners so they can be removed later @type {Map<string, ()>} */
export const GlobalDelegates = new Map()

/**
 * Adds event listeners to all matching selectors for each given handler and registers their listeners into the activeListeners registry, removing them from backlogListeners if found.
 * @param {string} ev @param {string|Node} target  @param {...(e: Event)} handlers
 */
export function on(ev, target, ...handlers) {
    const nodes = isString(target) ? findAll(target) : [target]
    const unbubble = new Set(['mouseenter', 'mouseleave', 'blur', 'focus', 'pointerenter', 'pointerleave'])
    console.log(activeListeners, ActiveGlobals, GlobalDelegates); // Testing, don't mind.
    
    nodes.forEach(node => {
        let existing = activeListeners.find(o => o.node === node && o.ev === ev)

        if (existing) {
            // Only add handlers that aren’t already registered
                handlers.forEach(handler => {
                    if (!existing.fn.includes(handler)) existing.fn.push(handler)
                })
        }
        else {
            // New entry
                if (!unbubble.has(ev)) activeListeners.write({node, ev, fn: [...handlers], in: 'active'})
        }

        // Ensure this node isn't still in backlog
            backlogListeners.splice(0, backlogListeners.size, backlogListeners.filter(o => o.node !== node))
    })

    if (!ActiveGlobals.has(ev)) {
        ActiveGlobals.add(ev)
        if (unbubble.has(ev)) {
            nodes.forEach(n => {
                const node = find(n)
                handlers.forEach(handler => node.addEventListener(ev, e => handler.call(node, e)))
            })
        }
        else {
            const delegatedListener = e => {
                activeListeners.filter(o => o.ev === ev).forEach(o => {
                    if (isString(o.node)) {
                        const matched = e.target.closest(o.node);
                        if (matched && document.body.contains(matched)) {
                            o.fn.forEach(fn => fn.call(matched, e));
                        }
                    }
                    else if (isNode(o.node)) {
                        if (o.node.contains(e.target)) {
                            o.fn.forEach(fn => fn.call(o.node, e));
                        }
                    }
                })
            }
            document.body.addEventListener(ev, delegatedListener)
            GlobalDelegates.set(ev, delegatedListener)
        }
    }
}

/**
 * Removes previously registered event listeners from targets and registers their listeners into the backlogListeners registry, removing them from activeListeners.
 * @param {string} ev @param {string|Node} target @param {...()} handlers
 */
export function off(ev, target, ...handlers) {
    const nodes = isString(target) ? findAll(target) : [target];
    const unbubble = new Set(['mouseenter', 'mouseleave', 'blur', 'focus', 'pointerenter', 'pointerleave']);

    nodes.forEach(node => {
        const existing = activeListeners.find(o => o.node === node && o.ev === ev);
        if (!existing) return;

        // Remove only the specified handlers, or all if none specified
            if (handlers.length) {
                existing.fn = existing.fn.filter(fn => !handlers.includes(fn));
            }
            else {
                existing.fn.length = 0;
            }

        // Remove direct listeners for non-bubbling events
            if (unbubble.has(ev)) {
                const el = find(node);
                if (el) {
                    const toRemove = handlers.length ? handlers : existing.fn;
                    toRemove.forEach(fn => el.removeEventListener(ev, fn));
                }
            }

        // If no handlers left, remove from activeListeners
            if (!existing.fn.length) {
                activeListeners.splice(0, activeListeners.size, activeListeners.filter(o => o !== existing)
                )
            }
    })

    // Remove global delegated listener if no more handlers exist for bubbling events
        if (!unbubble.has(ev)) {
            const stillActive = activeListeners.some(o => o.ev === ev);
            if (!stillActive && ActiveGlobals.has(ev)) {
                ActiveGlobals.delete(ev);
                const listener = GlobalDelegates.get(ev);
                if (listener) {
                    document.body.removeEventListener(ev, listener);
                    GlobalDelegates.delete(ev);
                }
            }
        }
}


/**
 * Restores all event listeners from backlog for matching selectors
 * @param {string} selector 
 */
export function restoreListeners(selector) {
    findAll(selector).forEach(node => {
        const toRestore = backlogListeners.filter(o => o.node === node);

        toRestore.forEach(o => {
            o.fn.forEach(f => node.addEventListener(o.ev, f));
            if (!activeListeners.includesValue(o)) activeListeners.write(o);
            o.in = 'active'
        })

        // Filter out restored objects from backlogListeners
            backlogListeners.splice(0, backlogListeners.length, ...backlogListeners.filter(o => o.node !== node))
    })
}

/**
 * Removes nodes matching target from the DOM along with their listeners.
 * @param {string|Node} target
 */
export function removeNode(target, log = false) {
    const nodes = typeof target === 'string' ? findAll(target) : [target]

    nodes.forEach(node => {
        // Remove all listeners first
            off(node)

        // Remove from DOM if still attached
            if (node.parentNode) node.parentNode.removeChild(node)

        // Optionally log removed node
            if (log) backlogNodes.write({node, in: 'backlog'})
    })
}
