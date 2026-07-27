/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";
import {main$} from "./MainLayout";
import {Sidebar$} from "./sidebar";

const rune = new Rune(), a = await rune.boot()
if (a instanceof Error) throw a

export const dom = rune.dom, scheduler = rune.scheduler

if (dom.ready) dom.append(Sidebar$())(main$());

(function() {
    if (!storageapi.o.has('userdocs')) storageapi.o.set('userdocs', {})
})()
