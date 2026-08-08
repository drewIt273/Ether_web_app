/**
 * Instance by DrewIt
 */

import {Module} from "./module";

interface AnimatableCSSProperties {
    width?: number | `${number}px` | 'auto'
    height?: number | `${number}px` | 'auto'
    transformX?: `${number}px`
    transformY?: `${number}px`
    opacity?: number
    color?: `#${string}`
    backgroundColor?: `#${string}`
}

export class UiMotionEngine extends Module {

    constructor(r: Rune) {
        super(r)
        this.IMC.map('anim', (node: HTMLElement, keyframes: MotionFrame[] | null, options: UiMotionOptions) => this.animate(node, keyframes, options))
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    animate(node: HTMLElement, keyframes: MotionFrame[] | null, options: UiMotionOptions) {
        const k = new KeyframeEffect(node, keyframes, options)
        return new Animation(k)
    }

    play(node: Node, motion: Animation | string) {
        const m = node.$.motion, a = typeof motion === 'string' ? m.defs.get(motion) : motion
        if (a) {
            if (m.current) m.current.finish()
            a.play(), a.commitStyles(), m.current = a, m.state = 'running';
            let fn = () => {m.current = null, m.state = 'null'; a.removeEventListener('finish', fn)}
            a.addEventListener('finish', fn)
        }
    }
}

declare global {
    interface MotionFrame extends AnimatableCSSProperties, Keyframe {
        duration?: number
        easing?: string
        composite?: CompositeOperationOrAuto
        offset?: number | null
    }
    type UiMotionOptions = number | KeyframeAnimationOptions | undefined
}
