/**
 * Instance by DrewIt
 */

interface UiModules {
    sidebar?: UiComponent
    [x: string]: UiComponent
}

class UiComponent {

    constructor(n: () => Node) {
        this.#fn = n
    }

    get node() {
        if (!this.#n) this.#n = this.#fn()
        return this.#n
    }

    readonly mounted = this.node.$.mounted

    #n?: Node
    #fn: () => Node
}

class ui {

    static expose<K extends keyof UiModules>(key: K, node: HTMLElement) {
        const u = new UiComponent(() => node);
        this.modules[key] = u
        return u
    }

    static readonly modules: UiModules = {}
}

export {ui}
