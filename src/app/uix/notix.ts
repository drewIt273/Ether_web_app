/**
 * Instance by DrewIt
 */

import {ui} from "@app/module"

interface UxNotifierDefinitionObject {
    duration?: number | 'none'
}

class UxNotifier {

    readonly node: HTMLDivElement
    private o: UxNotifierDefinitionObject
    constructor(content: HTMLElement, defn: UxNotifierDefinitionObject) {
        this.node = jsx('div', {append: [content]})
        this.o = defn
    }

    // The display of the notification banner should be animated but the Motion Engine is not yet ready. For now, it handles the duration logic when displayed.
    show() {
        if (typeof this.o.duration === 'number') window.setTimeout(this.hide, this.o.duration)
    }

    // The removal of the notification banner should be animated but the Motion Engine is not yet ready.
    hide() {}
}

function notify(content: HTMLElement, defn: UxNotifierDefinitionObject = {}) {
    return new UxNotifier(content, defn)
}

function bannerContainer() {
    return jsx('div', {
        style: {zIndex: 10, position: 'absolute', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '6px'}
    })
}

export const module: UiModulesInterfaceMap['UxNotificationModule'] = ui.define('UxNotificationModule', {root: bannerContainer()})

ui.defineProperty('UxNotificationModule', 'notify', notify)?.('container', bannerContainer())

declare global {
    interface UxNotify extends UxNotifier {
        notify(content: HTMLElement, defn?: UxNotifierDefinitionObject): UxNotifier
    }
}
