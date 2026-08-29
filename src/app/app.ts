/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";
import {ui} from "./module";

const rune = new Rune(), a = await rune.boot()
if (a instanceof Error) throw a

export const dom = rune.dom, scheduler = rune.scheduler

const sidebar = await ui.require('sidebar'), main = await ui.require('mainLayoutConstructive')

if (dom.ready) dom.append(sidebar.root.node)(main.root.node)

const c = storageapi.o.get('session')?.constructedModule
if (c) await ui.load(c)
