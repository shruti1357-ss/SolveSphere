const DATABASE_NAME = "solvesphere-offline-reports";
const DATABASE_VERSION = 1;

export const STORES = {
  PENDING_REPORTS: "pendingReports",
  REPORT_DRAFTS: "reportDrafts",
  SYNC_METADATA: "syncMetadata",
};

let databasePromise;

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORES.PENDING_REPORTS)) {
          const store = db.createObjectStore(STORES.PENDING_REPORTS, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
          store.createIndex("status", "status");
        }
        if (!db.objectStoreNames.contains(STORES.REPORT_DRAFTS)) {
          const store = db.createObjectStore(STORES.REPORT_DRAFTS, { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt");
        }
        if (!db.objectStoreNames.contains(STORES.SYNC_METADATA)) {
          db.createObjectStore(STORES.SYNC_METADATA, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Unable to open offline storage"));
    });
  }
  return databasePromise;
}

export async function put(storeName, value) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve(value);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function get(storeName, key) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAll(storeName) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function remove(storeName, key) {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
