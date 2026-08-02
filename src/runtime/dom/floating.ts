/**
 * Instance by DrewIt
 */

import tippy, { Instance, Props } from 'tippy.js'

/**
 * Public tooltip/popup configuration (Tippy-agnostic)
 */
export interface TooltipConfig {
    content: string | HTMLElement
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
    trigger?: 'mouseenter' | 'click' | 'focus' | 'manual'
    delay?: [number, number] // [show, hide]
    interactive?: boolean
    theme?: 'light' | 'dark'
    arrow?: boolean
    animation?: 'fade' | 'scale' | 'perspective'
    maxWidth?: number
    appendTo?: Element | 'parent'
    [key: string]: any // Allow custom Tippy props
}

export interface PopupConfig extends TooltipConfig {
    // Popup-specific options
    closeOnClickOutside?: boolean
    closeOnEscape?: boolean
}

/**
 * Metadata stored in WeakMap
 */
export interface InstanceMetadata {
    id: string
    type: 'tooltip' | 'popup'
    config: TooltipConfig
    isActive: boolean
}

export interface InstanceRegistry {
    // WeakMap: reference element → internal Tippy instance
    instances: WeakMap<Element, Instance<Props>>
    
    // WeakMap: reference element → metadata (for introspection)
    metadata: WeakMap<Element, InstanceMetadata>
    
    // Strong reference map: id string → element (for lookup)
    idMap: Map<string, Element>
}

const reg: InstanceRegistry = {
    instances: new WeakMap(),
    metadata: new WeakMap(),
    idMap: new Map()
}

export class Tooltip {

    readonly props: Instance<Props>
    readonly node: HTMLElement
    constructor(node: HTMLElement, props: Partial<Props> = {}) {
        this.node = node
        this.props = tippy(node, props)
        reg.instances.set(node, this.props)
    }

    setContent(o: string | HTMLElement) {
        this.props.setContent(o)
    }

    get getContent() {
        return this.props.props.content
    }

    show() {
        if (this.props.state.isEnabled === !1) this.enable()
        this.props.show()
    }

    hide() {
        this.props.hide()
    }

    disable() {
        this.props.disable()
    }

    enable() {
        this.props.enable()
    }
}

interface InteractiveMenuInterface extends Instance<Props> {
    node: HTMLDivElement
}

export class TippyModule {

    readonly imenu: InteractiveMenu
    constructor() {
        this.imenu = new InteractiveMenu()
    }

    createTooltip(node: HTMLElement, props: Partial<Props> = {}) {
        if (!reg.instances.has(node)) return new Tooltip(node, props)
    }

    getTooltip(node: HTMLElement) {
        return reg.instances.get(node)
    }
}

class InteractiveMenu {

    readonly node: HTMLDivElement
    constructor() {
        this.node = jsx('div', {})
    }
}