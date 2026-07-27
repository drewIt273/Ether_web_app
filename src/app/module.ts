/**
 * Instance by DrewIt
 */

interface UiModule {
    readonly name: keyof UiModulesInterfaceMap
    root: UiComponent | null
    readonly imports: string[]
    onImport: Handler | null
}

interface UiModulesInterfaceMap {
    "sidebar"?: UiModule
    "issues"?: UiModule
    "projects"?: UiModule
}

const modules: UiModulesInterfaceMap = {}

const Imports = {
    sidebar: () => import('@app/sidebar/index'),
    isses: () => import('@app/issues/index'),
    projects: () => import('@app/projects/index')
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
    root?: HTMLElement | null
    imports?: string[]
    onMount?: Handler
    onUnmount?: Handler
    onImport?: Handler
}

class UiModule {

    root: UiComponent | null
    constructor(name: keyof UiModulesInterfaceMap, root: UiComponent | null = null) {
        this.#n = name
        this.root = root // @ts-expect-error
        this.root?.module = name
    }

    #n: keyof UiModulesInterfaceMap

    // @ts-expect-error
    readonly name = this.#n

    readonly imports: string[] = []

    onImport: Handler | null = null
}

class UiConstructor {

    static define<K extends keyof UiModulesInterfaceMap>(name: K, props: ModuleDefinitionObject): UiModulesInterfaceMap[K] {
        const u = props.root ? new UiComponent(() => props.root as HTMLElement) : null, o = new UiModule(name, u)
        o.onImport = props.onImport ?? null
        if (o.root?.o) o.root.o = {mount: props.onMount, unmount: props.onUnmount}
        this.modules[name] = o
        return o
    }

    static async require<K extends keyof UiModulesInterfaceMap, L extends string>(key: K | `${K}:${L}`): Promise<UiModulesInterfaceMap[K]> {
        let o = this.modules[key as K]
        if (key.match(/^[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*$/i)) {
            const s = key.split(':'), a = await import(`@app/${s[0]}/${s[1]}`)
        }
        else {
            // @ts-expect-error
            const a: {module: UiModule} = await Imports[key]()
            a.module.onImport?.()
        }
        return o
    }

    static readonly modules: UiModulesInterfaceMap = modules

    static defineProperty<K extends keyof UiModulesInterfaceMap>(key: K, property: string, value: any) {
        const u = this.modules[key]
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
    require<K extends keyof UiModulesInterfaceMap>(key: K): Promise<UiModulesInterfaceMap[K] | undefined>
    require<K extends keyof UiModulesInterfaceMap, L extends string>(key: `${K}:${L}`): Promise<UiComponent | undefined>
    defineProperty<K extends keyof UiModulesInterfaceMap>(key: K, property: string, value: any): void
    define<K extends keyof UiModulesInterfaceMap>(name: K, props: ModuleDefinitionObject): UiModulesInterfaceMap[K]
    readonly modules: UiModulesInterfaceMap
}
