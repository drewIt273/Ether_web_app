/**
 * Instance by DrewIt
 */

import {dom} from "./boot";
import {sidebar$} from "./sidebar";
import {main$} from "./main";

if (dom.ready) dom.append(sidebar$())(main$())