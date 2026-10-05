/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";
import {ui} from "./module";

const rune = new Rune(), a = await rune.boot()
if (a instanceof Error) throw a

export const dom = rune.dom, scheduler = rune.scheduler;

(async function() {
    // Requiring default modules and appending their root nodes into the dom.
    const sidebar = await ui.require('sidebar'), main = await ui.require('mainLayoutConstructive')
    if (dom.ready) dom.append(sidebar.root.node)(main.root.node)

    // Define the session key of the CacheObject if it is undefined.
    if (!storageapi.o.has('session')) storageapi.o.set('session', {
        constructedModule: 'issues'
    })

    // Loads the Constructive UiModule of the previous session.
    await ui.load(storageapi.o.get('session')?.constructedModule as keyof UiModulesInterfaceMap)
})()
