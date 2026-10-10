/**
 * Instance by DrewIt
 */

import {ranstring} from "@assets/any";

type IssueProjectState = 'backlog' | 'todo' | 'inProgress' | 'inReview' | 'done' | 'canceled'
type IssueProjectPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none'
type IssueID = `I${number}`

interface IssueCreationObject {
    name: string
    id?: IssueID
    desc?: string
    tags?: string[]
    state?: IssueProjectState
    priority?: IssueProjectPriority
}

const IssueMap = new Map<IssueID, Issue>()

function idfy(s: string) {
    return s.trim().toLowerCase().replaceAll(/\s+/g, '-')
}

function checkIssueId(s: string) { 
    return RegExp(/^(I[0-9])+$/, 'g').test(s.trim())
}

class Issue {

    tags: string[]
    constructor(o: IssueCreationObject) {
        this.#n = o.name
        this.#id = o.id ? checkIssueId(o.id) ? o.id : (() => {const a: IssueID = `I${IssueMap.size + 1}`; console.warn(`Invalid id "${o.id}". Attributed id: "${a}"`); return a})() : `I${IssueMap.size + 1}`
        this.#desc = o.desc ?? ''
        this.#s = o.state ?? 'backlog'
        this.tags = o.tags ?? []
        this.#p = o.priority ?? 'none'
        IssueMap.set(this.#id, this)
    }

    #n: string = ''
    #s: IssueProjectState
    #p: IssueProjectPriority
    #id: IssueID
    #desc: string = ''
    #subs: IssueID[] = []

    set desc(s: string) {
        this.#desc = s
    }

    get desc() {
        return this.#desc
    }

    set name(s: string) {
        this.#n = s
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

    setSubIssue(s: IssueID) {
        IssueMap.has(s) ? this.#subs.push(s) : console.error(`Cannot set unexistent issue as a sub-issue: "${s}"`)
    }

    getSubIssue(s: IssueID) {
        if (this.#subs.includes(s)) return IssueMap.get(s)
        else return undefined
    }

    /**
     * Returns a new Issue which is a copy having a different ID.
     */
    duplicate() {
        return new Issue({name: this.name, state: this.state, priority: this.priority, tags: [...this.tags], desc: this.desc})
    }

    get ID () {
        return this.#id
    }
}
