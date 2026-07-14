/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";

const rune = new Rune(), a = rune.boot()

if (a instanceof Error) throw a;

export const dom = rune.dom, scheduler = rune.scheduler
