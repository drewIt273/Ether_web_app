/**
 * Instance by DrewIt
 */

import {ranstring} from "@assets/any";

type IssueProjectState = 'inProgress' | 'backlog' | 'finished' | 'planned'
type IssueProjectPriority = 'high' | 'medium' | 'low' | 'none'

interface IssueCreationObject {
    name: string
    desc?: string
    tags?: string[]
    state?: IssueProjectState
    priority?: IssueProjectPriority
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
        this.#s = o.state ?? 'backlog'
        this.tags = o.tags ?? null
        this.#p = o.priority ?? 'none'
    }

    #n: string = ''
    #s: IssueProjectState
    #p: IssueProjectPriority
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

    set state(s: IssueProjectState) {
        this.#s = s
    }

    get state() {
        return this.#s
    }

    set priority(s: IssueProjectPriority) {
        this.#p = s
    }

    get priority() {
        return this.#p
    }

    readonly ID = this.#id
}
