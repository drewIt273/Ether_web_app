/**
 * Instance by DrewIt
 */

import {Module} from "./module";

interface AnimatableCSSProperties {
    width?: `${number}` | `${number}px` | 'auto'
    height?: `${number}` | `${number}px` | 'auto'
    transformX?: `${number}px`
    transformY?: `${number}px`
    opacity?: number
    color?: `#${string}`
    backgroundColor?: `#${string}`
}

export class UiMotionEngine extends Module {

    constructor(r: Rune) {
        super(r)
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    async animate(node: HTMLElement, keyframes: MotionFrame[] | null, options: number | KeyframeAnimationOptions | undefined = undefined) {
        return node.$.motion.current = (() => node.animate(keyframes, options))()
    }
}

declare global {
    interface MotionFrame extends AnimatableCSSProperties, Keyframe {
        duration?: number
        easing?: string
        composite?: CompositeOperationOrAuto
        offset?: number | null
    }
}
