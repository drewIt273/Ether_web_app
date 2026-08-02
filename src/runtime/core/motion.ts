/**
 * Instance by DrewIt
 */

import {Module} from "./module";

export class Motion extends Module {

    constructor(r: Rune) {
        super(r)
    }

    async onInit() {
        this.init = !0
    }

    async onReady() {
        this.ready = !0
    }

    async animate(node: HTMLElement, keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options: number | KeyframeAnimationOptions | undefined = undefined) {
        return node.$.motion.current = (() => node.animate(keyframes, options))()
    }
}