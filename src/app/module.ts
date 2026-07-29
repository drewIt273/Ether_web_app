/**
 * Instance by DrewIt
 */

interface UiModule {
    root: UiComponent | null
    readonly imports: string[]
    onImport: Handler | null
}

interface UiModulesInterfaceMap {
    "sidebar": UiModule
    "issues": UiModule
    "projects": UiModule
}

// @ts-expect-error
const modules: UiModulesInterfaceMap = {}

const Imports = {
    sidebar: () => import('./sidebar/index'),
    isses: () => import('./issues/index'),
    projects: () => import('./projects/index')
}

class UiComponent {

    constructor(n: () => HTMLElement) {
        this.#fn = n
    }

    get node() {
        if (!this.#n) this.#n = this.#fn()
        return this.#n
    }

    readonly name: string = ''
    readonly module: keyof UiModulesInterfaceMap | null = null

    deps: string[] = []

    mount(n: HTMLElement | keyof UiModulesInterfaceMap, asOnlyNode: boolean = false) {
        if (this.module) this.deps.forEach(async d => await ui.require(`${this.module as keyof UiModulesInterfaceMap}:${d}`))
        this.o.mount?.()
    }

    unmount() {
        const n = this.node.parentElement
        if (n) n.removeChild(this.node)
        this.o.unmount?.()
    }

    get mounted() {
        return this.node.$.mounted
    }

    o: {
        mount: Handler | undefined
        unmount: Handler | undefined
    } = {
        mount: () => {},
        unmount: () => {}
    }

    #n?: HTMLElement
    #fn: () => HTMLElement
}

interface ModuleDefinitionObject {
    root?: HTMLElement | UiComponent | null
    imports?: string[]
    onMount?: Handler
    onUnmount?: Handler
    onImport?: Handler
}

interface UiComponentDefinitionObject {
    name: string
    node: HTMLElement
    module?: keyof UiModulesInterfaceMap | null
    deps?: string[]
    onmount?: Handler
    unmount?: Handler
}

class UiModule {

    root: UiComponent | null
    constructor(name: keyof UiModulesInterfaceMap, root: UiComponent | null = null) {
        this.#n = name
        this.root = root // @ts-expect-error
        if (this.root?.module) this.root.module = name
    }

    #n: keyof UiModulesInterfaceMap

    get name() {
        return this.#n
    }

    readonly imports: string[] = []

    onImport: Handler | null = null
}

class UiConstructor {

    static define<K extends keyof UiModulesInterfaceMap>(name: K, props: ModuleDefinitionObject): UiModulesInterfaceMap[K] {
        const u = props.root instanceof UiComponent ? props.root : props.root instanceof HTMLElement ? this.expose({node: props.root as HTMLElement, name: `${name}:root`, module: name}) : null, o = new UiModule(name, u)
        o.onImport = props.onImport ?? null
        if (o.root && o.root.o) o.root.o = {mount: props.onMount, unmount: props.onUnmount}
        this.modules[name] = o
        return o
    }

    static expose(props: UiComponentDefinitionObject) {
        const o = new UiComponent(() => props.node) // @ts-expect-error
        o.name = props.name, o.module = props.module ?? null
        o.deps = props.deps ?? []
        o.o = {mount: props.onmount, unmount: props.unmount}
        return o
    }

    static async require<K extends keyof UiModulesInterfaceMap, L extends string>(key: K | `${K}:${L}`): Promise<UiModulesInterfaceMap[K] | UiComponent> {
        if (key.match(/^[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*$/i)) {
            const s = key.split(':'), a: {uicomp: UiComponent} = await import(`./${s[0]}/${s[1]}`)
            return a?.uicomp
        }
        else {
            // @ts-expect-error
            const a: {module: UiModule} = await Imports[key]()
            a.module.onImport?.(), a.module.imports.forEach(i => this.require(`${key}:${i}`))
            return a.module
        }
    }

    static readonly modules: UiModulesInterfaceMap = modules

    static defineProperty<K extends keyof UiModulesInterfaceMap>(key: K | UiModule, property: string, value: any) {
        const u = key instanceof UiModule ? key : this.modules[key]
        if (u) {
            if (u[property as keyof UiModule] === undefined) {
                Object.defineProperty(u, property, {
                    value: value,
                    enumerable: false,
                    configurable: false
                })
            }
            else throw new Error(`Cannot overwrite already defined property of UiModule ${u.name}`)
        }
        else return;
    }
}

export const ui: UiConstructor = UiConstructor

interface UiConstructor {
    new (): UiConstructor
    require<K extends keyof UiModulesInterfaceMap>(key: K): Promise<UiModulesInterfaceMap[K] | undefined>
    require<K extends keyof UiModulesInterfaceMap, L extends string>(key: `${K}:${L}`): Promise<UiComponent | undefined>
    defineProperty<K extends keyof UiModulesInterfaceMap>(key: K | UiModule, property: string, value: any): void
    define<K extends keyof UiModulesInterfaceMap>(name: K, props: ModuleDefinitionObject): UiModulesInterfaceMap[K]
    expose(props: UiComponentDefinitionObject): UiComponent
    readonly modules: UiModulesInterfaceMap
}

export type {ModuleDefinitionObject, UiComponentDefinitionObject, UiModulesInterfaceMap}