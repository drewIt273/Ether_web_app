/**
 * Instance by DrewIt
 */

import {stylesheet} from '@assets/stylesheet'

declare global {
    interface UiModule {
        root: UiComponent
        type: TypeOfModule
        readonly nodes: UiComponent[]
        readonly imports: string[]
        readonly storagekey: StorageKeyReference[]
        readonly name: keyof UiModulesInterfaceMap
        onImport: Handler | null
        /**Returns true if root node is still mounted. */
        readonly mounted: boolean
        /**Unmounts all the UiComponents for this UiModule. */
        unMount(): void
    }
    interface UiModulesInterfaceMap {
        "sidebar": UiModule
        "issues": UiConstructiveModule
        "projects": UiConstructiveModule
        "mainLayoutConstructive": UiModule & mainLayoutConstructiveModule
    }
    interface UiConstructiveModule extends UiModule {}
}

const NodeModuleMap = new WeakMap<Node, UiModule>()

// @ts-expect-error
const modules: UiModulesInterfaceMap = {}

const Imports = {
    sidebar: () => import('./sidebar/index'),
    isses: () => import('./issues/index'),
    projects: () => import('./projects/index'),
    mainLayoutConstructive: () => import('./main/index')
}

class UiComponent {

    constructor(n: () => HTMLElement) {
        this.#fn = n
    }

    get node() {
        if (!this.n) this.n = this.#fn()
        return this.n
    }

    readonly name: string = ''
    readonly module: UiModule | null = null

    deps: string[] = []

    mount(n: HTMLElement) {
        if (this.module) {
            this.deps.forEach(async d => await ui.require(`${this.module?.name as keyof UiModulesInterfaceMap}:${d}`))
            n.append(this.node)
        }
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
    } = {mount: () => {}, unmount: () => {}}

    // @ts-expect-error
    private n: HTMLElement
    #fn: () => HTMLElement
}

interface ModuleDefinitionObject {
    root: HTMLElement | UiComponent | null
    type?: TypeOfModule
    storeRef?: StorageKeyReference[]
    imports?: string[]
    nodes?: UiComponent[]
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

interface ModuleStateManager {
    stateOf(s: string): string
    [x: string]: any
}

type TypeOfModule = 'default' | 'constructed'

class UiModule {

    root: UiComponent
    nodes: UiComponent[]
    constructor(name: keyof UiModulesInterfaceMap, root: UiComponent, ...comps: UiComponent[]) {
        this.n = name
        this.root = root
        this.nodes = [this.root, ...comps]
        this.nodes.forEach(n => NodeModuleMap.set(n.node, this))
    }

    private n: keyof UiModulesInterfaceMap
    private k: TypeOfModule = 'default'

    get name() {
        return this.n
    }

    get mounted() {
        return this.root.node.$.mounted
    }

    set type(v: TypeOfModule) {
        this.k = v
    }

    get type() {
        return this.k
    }

    unMount() {
        this.nodes.forEach(n => n.unmount())
    }

    readonly storagekey: StorageKeyReference[] = []
    readonly imports: string[] = []

    onImport: ((u: UiComponent) => any) | null = null
}

class UiConstructor {

    static define<K extends keyof UiModulesInterfaceMap>(name: K, props: ModuleDefinitionObject): UiModulesInterfaceMap[K] { // @ts-expect-error
        const u = props.root instanceof UiComponent ? props.root : props.root instanceof HTMLElement ? this.expose({node: props.root as HTMLElement, name: `${name}:root`, module: name}) : null, o: UiModulesInterfaceMap[K] = new UiModule(name, u)
        o.onImport = props.onImport ?? null
        if (o.root && o.root.o) o.root.o = {mount: props.onMount, unmount: props.onUnmount} // @ts-expect-error
        o.storagekey = props.storeRef ?? []
        o.type = props.type ?? 'default'
        this.modules[name] = o, o.imports.push(...props.imports ?? [])
        return o
    }

    static expose(props: UiComponentDefinitionObject) {
        const o = new UiComponent(() => props.node) // @ts-expect-error
        o.name = props.name
        o.deps = props.deps ?? []
        o.o = {mount: props.onmount, unmount: props.unmount}
        return o
    }

    static async require<K extends keyof UiModulesInterfaceMap, L extends string>(key: K | `${K}:${L}`): Promise<UiModulesInterfaceMap[K] | UiComponent | stylesheet | undefined> {
        if (key.match(/^[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*$/i)) {
            const s = key.split(':'), a: {uicomp?: UiComponent, sheet?: stylesheet} = await import(`./${s[0]}/${s[1]}`)
            return a.uicomp ? a.uicomp : a.sheet ? a.sheet : undefined
        }
        else {
            // @ts-expect-error
            if (this.modules[key as keyof UiModulesInterfaceMap]) return this.modules[key as keyof UiModulesInterfaceMap]
            else {
                // @ts-expect-error
                const a: {module: UiModule} = await Imports[key]()
                a.module.onImport?.call(a.module, a.module.root), a.module.imports.forEach(async i => {
                    const o = await this.require(`${key}:${i}`);
                    o instanceof stylesheet ? o.mount() : null
                }) // @ts-expect-error
                return a.module
            }
        }
    }

    static readonly modules: UiModulesInterfaceMap = modules

    static defineProperty<K extends keyof UiModulesInterfaceMap>(key: K | UiModule, property: string, obj: any): returnedCall {
        const u = key instanceof UiModule ? key : this.modules[key]
        if (u) {
            if (u[property as keyof UiModule] === undefined) { // @ts-expect-error
                const s = Symbol('S'); u[s] = {}
                Object.defineProperty(u, property, {
                    value: obj,
                    enumerable: false,
                    configurable: false
                })
            }
            else throw new Error(`Cannot overwrite already defined property of UiModule ${u.name}`)
        }
        return (prop: string, value: any) => this.defineProperty(key, prop, value) as returnedCall
    }

    static readonly NodeModuleMap = NodeModuleMap

    static async load(u: UiModule | keyof UiModulesInterfaceMap, callback: Handler = () => {}) {
        const o = this.modules.mainLayoutConstructive, b = o.constructed, n = u instanceof UiModule ? u : await this.require(u) as UiModule // @ts-expect-error
        if (b) this.unmount(b)
        if (n.mounted === !1) {
            o.mount(n), callback()
        }
        storageapi.o.set('session')('constructedModule', n.name)
    }

    static async unmount(u: UiModule | keyof UiModulesInterfaceMap, callback: Handler = () => {}) {
        const o = this.modules.mainLayoutConstructive, n = u instanceof UiModule ? u : await this.require(u) as UiModule
        if (n.type === 'constructed' && o.constructed === n) o.unmount(n), callback();
    }

    static getModule(n: Node) {
        return NodeModuleMap.get(n)
    }

    static UiModule = UiModule
}

export const ui: UiConstructor = UiConstructor

interface UiConstructor {
    new(): UiConstructor
    require<K extends keyof UiModulesInterfaceMap>(key: K): Promise<UiModulesInterfaceMap[K]>
    require<K extends keyof UiModulesInterfaceMap, L extends string>(key: `${K}:${L}`): Promise<UiComponent | stylesheet | undefined>
    defineProperty<K extends keyof UiModulesInterfaceMap>(key: K | UiModule, property: string, value: any): ((prop: string, value: any) => returnedCall)
    define<K extends keyof UiModulesInterfaceMap>(name: K, props: ModuleDefinitionObject): UiModulesInterfaceMap[K]
    expose(props: UiComponentDefinitionObject): UiComponent
    load(u: UiModule | keyof UiModulesInterfaceMap, callback?: Handler): Promise<void>
    getModule(n: Node): UiModule | undefined
    readonly NodeModuleMap: WeakMap<Node, UiModule>
    readonly modules: UiModulesInterfaceMap
    UiModule: typeof UiModule
}

type returnedCall = (props: string, value: any) => returnedCall

export type {ModuleDefinitionObject, UiComponentDefinitionObject}