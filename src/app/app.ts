/**
 * Instance by DrewIt
 */

import {dom} from "./boot";
import {sidebar$} from "./sidebar";

if (dom.ready) dom.append(sidebar$())
console.log(dom.rune.states.reg)