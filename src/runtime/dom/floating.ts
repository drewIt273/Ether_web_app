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
    onShow?: (instance: TooltipInstance) => void
    onHide?: (instance: TooltipInstance) => void
    [key: string]: any // Allow custom Tippy props
}

export interface PopupConfig extends TooltipConfig {
    // Popup-specific options
    closeOnClickOutside?: boolean
    closeOnEscape?: boolean
}

/**
 * Public instance handle (users never touch internal Tippy instance)
 */
export interface TooltipInstance {
    id: string
    reference: Element
    getContent(): string | HTMLElement
    setContent(content: string | HTMLElement): void
    show(): void
    hide(): void
    disable(): void
    enable(): void
    update(config: Partial<TooltipConfig>): void
    destroy(): void
}

/**
 * Metadata stored in WeakMap
 */
export interface InstanceMetadata {
    id: string
    type: 'tooltip' | 'popup'
    config: TooltipConfig
    isActive: boolean
    createdAt: number
}

// src/runtime/floating/adapter/instance-manager.ts

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

    readonly instance: Instance<Props>
    readonly node: HTMLElement
    constructor(node: HTMLElement) {
        this.node = node
        this.instance = tippy(node)
        reg.instances.set(node, this.instance)
    }

    private con: string | HTMLElement = ''

    setContent(o: string | HTMLElement) {
        this.instance.setContent(o)
        this.con = o
    }

    get getContent() {
        return this.con
    }
}