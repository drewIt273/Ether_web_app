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


export async function putRecord<T extends { id: string }>(storeName: "projects" | "issues", record: T): Promise<void> {
    const db = await openDataBase();

    return new Promise((resolve, reject) => {
        const trans = db.transaction(storeName, "readwrite")
        trans.objectStore(storeName).put(record)
        trans.oncomplete = () => resolve()
        trans.onabort = () => {
            reject(trans.error ?? new Error("Database transaction aborted."));
        }
        trans.onerror = () => {
            reject(trans.error ?? new Error("Database transaction failed."));
        }
  })
}

export async function getRecord<T>(storeName: "projects" | "issues", id: string): Promise<T | undefined> {
    const db = await openDataBase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly"), request = transaction.objectStore(storeName).get(id);
        request.onsuccess = () => {
            resolve(request.result as T | undefined);
        }
        request.onerror = () => {
            reject(request.error ?? new Error("Failed to retrieve record."));
        }
    })
}
