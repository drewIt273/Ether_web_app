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

    tags: string[]
    constructor(o: IssueCreationObject) {
        this.#n = o.name
        this.#id = `${idfy(o.name).concat(ranstring(6, 1))}`
        this.#desc = o.desc ?? ''
        this.#s = o.state ?? 'backlog'
        this.tags = o.tags ?? []
        this.#p = o.priority ?? 'none'
    }

    #n: string = ''
    #s: IssueProjectState
    #p: IssueProjectPriority
    #id: string = ''
    #desc: string = ''

    set desc(s: string) {
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

    /**
     * Returns a copy of this Issue having a different ID.
     */
    duplicate() {
        return new Issue({name: this.name, state: this.state, priority: this.priority, tags: this.tags, desc: this.desc})
    }

    readonly ID = this.#id
}
