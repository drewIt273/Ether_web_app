/**
 * Instance by DrewIt
 */

/**
 * For resizing to correctly occur, don't forget to add an event listener on the Node 'on' with event 'pointerdown' and passing this function as the event listener.
 */
export function onResizeX(on: Node, target: Node = on.parentNode as ParentNode, o: {max: number | null, min: number} = {max: null, min: 0}) {
    return function fn(e: PointerEvent) {
        const i = e.clientX;
        const resizer = on as HTMLElement, parent = target as HTMLElement
        if (!target) return;
        const p = parent.getBoundingClientRect().width;
        try {resizer.setPointerCapture(e.pointerId)} catch {}
        const onMove = (ev: PointerEvent) => {
            let x = ev.clientX
            if (o.max) parent.style.width = `${(x < o.max && x >= o.min) ? p + (x - i) : parent.getBoundingClientRect().width}px`
        }
        const onUp = (ev: PointerEvent) => {
            try {resizer.releasePointerCapture(e.pointerId)} catch {}
            resizer.removeEventListener('pointermove', onMove)
            resizer.removeEventListener('pointerup', onUp)
        }
        resizer.addEventListener('pointermove', onMove)
        resizer.addEventListener('pointerup', onUp)
    }
}

/**
 * For resizing to correctly occur, don't forget to add an event listener on the Node 'on' with event 'pointerdown' and passing this function as the event listener.
 */
export function onResizeY(on: Node, target: Node = on.parentNode as ParentNode, o: {max: number | null, min: number} = {max: null, min: 0}) {
    return function fn(e: PointerEvent) {
        const i = e.clientY;
        const resizer = on as HTMLElement, parent = target as HTMLElement
        if (!target) return;
        const p = parent.clientHeight;
        try {resizer.setPointerCapture(e.pointerId)} catch {}
        const onMove = (ev: PointerEvent) => {
            let y = ev.clientY
            if (o.max) parent.style.width = `${(y < o.max && y > o.min) ? p + (y - i) : o.max}px`
        }
        const onUp = (ev: PointerEvent) => {
            try {resizer.releasePointerCapture(e.pointerId)} catch {}
            resizer.removeEventListener('pointermove', onMove)
            resizer.removeEventListener('pointerup', onUp)
        }
        resizer.addEventListener('pointermove', onMove)
        resizer.addEventListener('pointerup', onUp)
    }
}
