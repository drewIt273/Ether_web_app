/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";

const nodeRuneData = new WeakMap<Node, { id: string; isRuneRoot: boolean }>();

Object.defineProperty(Node.prototype, 'rune', {
    get() {
        if (!nodeRuneData.has(this)) {
            nodeRuneData.set(this, { id: '', isRuneRoot: false });
        }
        return nodeRuneData.get(this)!;
    },
    set(value) {
        if (typeof value === 'object' && value !== null) {
            nodeRuneData.set(this, value as { id: string; isRuneRoot: boolean });
        }
    },
    configurable: true,
    enumerable: false,
});

const rune = new Rune(), a = rune.boot()

if (a instanceof Error) throw a;

export const dom = rune.dom, scheduler = rune.scheduler
