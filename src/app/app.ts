/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";
import {main$} from "./MainLayout";
import {ui} from "./module";

const rune = new Rune(), a = await rune.boot()
if (a instanceof Error) throw a

export const dom = rune.dom, scheduler = rune.scheduler

const sidebar = await ui.require('sidebar')

if (dom.ready) dom.append(sidebar?.root?.node as HTMLElement);

(function() {
    if (!storageapi.o.has('userdocs')) storageapi.o.set('userdocs', {})
})()
