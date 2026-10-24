/**
 * Instance by DrewIt
 */

const DATABASE_NAME = "ether"
const DATABASE_VERSION = 1

var idb: Promise<IDBDatabase> | undefined

export function openDataBase(): Promise<IDBDatabase> {
    if (idb) return idb

    idb = new Promise((res, rej) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result
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