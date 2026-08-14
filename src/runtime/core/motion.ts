/**
 * Instance by DrewIt
 */

import {Module} from "./module";

interface AnimatableCSSProperties {
    width?: `${number}px` | 'auto' | 'fit-content'
    height?: `${number}px` | 'auto' | 'fit-content'
    transformX?: `${number}px`
    transformY?: `${number}px`
    opacity?: number
    color?: `#${string}`
    backgroundColor?: `#${string}`
}

interface playOptions {
    action: 'forward' | 'reverse'
    commit: boolean
}

interface AnimationEventInterface {
    readonly record: WeakMap<Animation, Record<keyof AnimationEventMap, Handler>>
    set(key: Animation, ev: keyof AnimationEventMap, fn: Handler<any>): void
}

const ei: AnimationEventInterface = {
    record: new WeakMap(),
    set(key, ev, fn) {
        const o = {[ev]: fn} as Record<keyof AnimationEventMap, Handler>
        this.record.set(key, Object.assign(this.record.get(key) ?? {}, o))
    },
}

const sym = Symbol('MotionFrames'), bool = Symbol('bool')

export class UiMotionEngine extends Module {

    constructor(r: Rune) {
        super(r)
        this.IMC.map('anim', (node: HTMLElement, keyframes: MotionFrame[], options: UiMotionOptions) => this.animate(node, keyframes, options))
    }

    async onInit() {
        Object.defineProperty(Animation.prototype, 'frames', {
            set(v) {
                if (Array.isArray(v)) this[sym] = v
            },
            get() {
                return this[sym]
            },
            configurable: false, enumerable: false
        }),
        Object.defineProperty(Animation.prototype, 'persit', {
            set(v) {
                if (typeof v === 'boolean') this[bool] = v
            },
            get() {
                return this[bool]
            },
            configurable: false, enumerable: false
        })
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    animate(node: HTMLElement, keyframes: MotionFrame[], options: UiMotionOptions) {
        const k = new KeyframeEffect(node, keyframes, options), a = new Animation(k)
        a.frames = keyframes
        return a
    }

    play(node: Node, motion: Animation | string, options: playOptions = {action: 'forward', commit: true}) {
        const m = node.$.motion, a = typeof motion === 'string' ? m.defs.get(motion) : motion
        if (a) {
            const frs = a.frames
            if (m.current) {
                m.current.pause()
            }
            options.action === 'forward' ? a.play() : a.reverse(), m.current = a, m.state = 'running';
            let fn = () => {
                if (m.current === a) {
                    m.current = null, m.state = 'null'
                }
                if (options.commit) a.commitStyles()
            }
            ei.record.has(a) ? ei.record.get(a)?.finish() : (a.addEventListener('finish', fn), ei.set(a, 'finish', fn))
        }
    }
}

function persistComputedStyles(n: Node, frames: MotionFrame[]) {
    for (const f of frames) {
        for (const [k, v] of Object.entries(f)) {
            n.$.motion.buffer = {}
            if (Object.hasOwn(CSSStyleProperties.prototype, k)) n.$.motion.buffer[k as keyof CSSStyleProperties] = `${v}`
        }
    }
    return frames
}

function constructFrames(n: Node, frames: MotionFrame[]) {
    for (const f of frames) {
        for (const [k, v] of Object.entries(f)) {
            if (k === 'height') { // @ts-expect-error
                if (v === 'fit-content') f[k] = `${getComputedStyle(n as Element).height}px`
            }
        }
    }
    return frames
}

declare global {
    interface MotionFrame extends AnimatableCSSProperties, Keyframe {
        duration?: number
        easing?: string
        composite?: CompositeOperationOrAuto
        offset?: number | null
    }
    type UiMotionOptions = number | KeyframeAnimationOptions | undefined
    interface Animation {
        frames: MotionFrame[]
    }
}
