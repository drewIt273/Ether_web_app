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

/**
 * Toggles between two states s1 and s2. If a different state was set initially, sets s1 as n's state.
 */
export function toggleUINodeState(n: UINode, s1: string, s2: string) {
    let s = n.currentstate; console.log(s);
    if (s === s1) n.setState(s2)
    else if (s === s2) n.setState(s1)
    else n.setState(s1)
}

export function toggleElementState(n: HTMLElement, s1: string, s2: string) {
    let s = 'data-state', g = n.getAttribute(s)
    if (g === s1) n.setAttribute(s, s2)
    else if (g === s2) n.setAttribute(s, s1)
    else n.setAttribute(s, s1)
}