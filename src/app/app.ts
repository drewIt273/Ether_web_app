/**
 * Instance by DrewIt
 */

import {Rune} from "@core/rune";
import {Sidebar$} from "./SidebarLayout";
import {main$} from "./MainLayout";

const rune = new Rune(), a = await rune.boot()
if (a instanceof Error) throw a;

export const dom = rune.dom, scheduler = rune.scheduler

if (dom.ready) dom.append(Sidebar$())(main$())