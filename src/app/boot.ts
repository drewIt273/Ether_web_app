/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";

const n = new WeakMap<Node, { id: string; isRuneRoot: boolean }>();

Object.defineProperty(Node.prototype, 'rune', {
    get() {
        if (!n.has(this)) {
            n.set(this, { id: '', isRuneRoot: false });
        }
        return n.get(this)!;
    },
    set(value) {
        if (typeof value === 'object' && value !== null) {
            n.set(this, value as { id: string; isRuneRoot: boolean });
        }
    },
    configurable: true,
    enumerable: false,
})

const rune = new Rune(), a = rune.boot()

if (a instanceof Error) throw a;

export const dom = rune.dom, scheduler = rune.scheduler
