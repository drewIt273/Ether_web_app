/**
 * Instance by DrewIt
 */

import {ranstring} from "@assets/any";

interface IssueCreationObject {
    name: string
    desc?: string
    tags?: string[]
}

function idfy(s: string) {
    return s.replaceAll(/ /g, '-').toLowerCase()
}

class Issue {

    tags: string[] | null
    constructor(o: IssueCreationObject) {
        this.#n = o.name
        this.#id = `${idfy(o.name).concat(ranstring(6, 1))}`
        this.#desc = o.desc ?? null
        this.tags = o.tags ?? null
    }

    #n: string = ''
    #id: string = ''
    #desc: string | null = null

    set desc(s: string | null) {
        this.#desc = s
    }

    get desc() {
        return this.#desc
    }

    set name(s: string) {
        this.#n = s
        this.#id = `${idfy(s).concat(ranstring(6, 1))}`
    }

    get name() {
        return this.#n
    }

    readonly ID = this.#id
}
