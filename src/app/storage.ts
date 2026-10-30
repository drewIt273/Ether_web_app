/**
 * Instance by DrewIt
 */

import {hasSubObject} from "@assets/any"

const DATABASE_NAME = "ether"
const DATABASE_VERSION = 1

declare global {
    type IssueState = "backlog" | "todo" | "done" | "canceled"
    type ProjectState = "inProgress" | "inReview" | "canceled"
    type IssueProjectPriority = "urgent" | "high" | "medium" | "low" | "none"
    type IssueID = `I${number}`
    type ProjectID = `P${number}`
    interface IssueObjectCreation {
        name: string
        id: IssueID
        desc?: string
        status?: IssueState
        priority?: IssueProjectPriority
        projectId?: ProjectID
    }
    interface ProjectObjectCreation {
        name: string
        id: ProjectID
        desc?: string
        status?: ProjectState
        priority?: IssueProjectPriority
    }
    interface CreationObjectStore {
        issues: IssueObjectCreation
        projects: ProjectObjectCreation
    }
    interface DBObjectIssue extends IssueObjectCreation {
        createdAt: Date
        updatedAt: Date
    }
    interface DBObjectProject extends ProjectObjectCreation {
        createdAt: Date
        updatedAt: Date
        issues: IssueID[]
    }
    interface DBObjectStore {
        issues: DBObjectIssue
        projects: DBObjectProject
    }
}

var idb: Promise<IDBDatabase> | undefined

class EtherDataBase {
    static openDataBase(): Promise<IDBDatabase> {
        if (idb) return idb

        idb = new Promise((res, rej) => {
            const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
            request.onupgradeneeded = () => {
                const db = request.result;
                // Create object stores only when they don't exist
                if (!db.objectStoreNames.contains('issues')) {
                    const issues = db.createObjectStore('issues', {
                        keyPath: 'id'
                    })
                    // Allows querying issues by projects
                    issues.createIndex('projectId', 'projectId', {unique: false})
                    issues.createIndex('status', 'status', {unique: false})
                }
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects', {
                        keyPath: 'id'
                    })
                }
            }
            request.onsuccess = () => {
                const db = request.result
                db.onversionchange = () => db.close()
                res(db)
            }
            request.onerror = () => {
                idb = undefined
                rej(request.error ?? new Error(`Failed to open database ${DATABASE_NAME}`))
            }
            request.onblocked = () => {
                console.warn(`Database upgrade blocked by another open connection`)
            }
        })
        return idb
    }

    static async putRecord<K extends keyof CreationObjectStore>(storeName: K, record: CreationObjectStore[K]): Promise<void> {
        const db = await this.openDataBase();

        return new Promise((res, rej) => {
            const trans = db.transaction(storeName, "readwrite")
            trans.objectStore(storeName).add(record);
            trans.oncomplete = () => res()
            trans.onabort = () => {
                rej(trans.error ?? new Error("Database transaction aborted."));
            }
            trans.onerror = () => {
                rej(trans.error ?? new Error("Database transaction failed."));
            }
        })
    }

    static async getRecord<K extends keyof DBObjectStore>(storeName: K, id: string): Promise<K | undefined> {
        const db = await this.openDataBase();
        return new Promise((res, rej) => {
            const trans = db.transaction(storeName, "readonly"), request = trans.objectStore(storeName).get(id);
            request.onsuccess = () => {
                res(request.result as K | undefined);
            }
            request.onerror = () => {
                rej(request.error ?? new Error("Failed to retrieve record."));
            }
        })
    }

    static async updateRecord<K extends keyof DBObjectStore>(storeName: K, id: DBObjectStore[K]['id'], o: Partial<DBObjectStore[K]>, idb: IDBDatabase | null = null): Promise<void> {
        const db = idb ? idb : await this.openDataBase();
        return new Promise((res, rej) => {
            const trans = db.transaction(storeName, "readwrite"), store = trans.objectStore(storeName), req = store.get(id) as IDBRequest<DBObjectStore[K]>;
            req.onsuccess = () => {
                for (const [k, v] of Object.entries(o as DBObjectStore[K])) { // @ts-expect-error
                    if (k !== 'id') req.result[k] = v
                }
                store.put(req.result), res()
            }
            req.onerror = () => rej(req.error ?? new Error('Failed to update record'))
        })
    }

    static async findRecords<K extends keyof DBObjectStore>(storeName: K, query: Partial<DBObjectStore[K]>, idb: IDBDatabase | null = null): Promise<DBObjectStore[K][]> {
        const db = idb ? idb : await this.openDataBase()
        return new Promise((res, rej) => {
            const o = db.transaction(storeName, "readonly").objectStore(storeName), req = o.getAll() as IDBRequest<DBObjectStore[K][]>, ans: DBObjectStore[K][] = [];
            req.onsuccess = () => {
                for (const a of req.result) if (hasSubObject(a, query)) ans.push(a);
                res(ans)
            }
            req.onerror = () => {
                rej(req.error)
            }
        })
    }

    static async delete<K extends keyof DBObjectStore>(storeName: K, query: DBObjectStore[K]): Promise<void> {
        const j = await this.openDataBase(), o = await this.findRecords(storeName, query, j), k = j.transaction(storeName, "readwrite"), t = k.objectStore(storeName);
        for (const r of o) {
            if (r && r.id) t.delete(r.id)
        }
        return new Promise((res, rej) => {
            k.oncomplete = () => res()
            k.onabort = () => rej(k.error ?? new Error(`Delete transaction aborted`))
            k.onerror = () => rej(k.error ?? new Error(`Delete transaction failed`))
        })
    }

    /**
     * Returns immediately and closes the connection in a separate thread.
     */
    static async close() {
        (await idb)?.close()
    }
}

export const edb = EtherDataBase
