// IndexedDB storage for offline-first data persistence
const DB_NAME = "policyguard";
const DB_VERSION = 1;

interface StoredData {
  key: string;
  value: any;
  timestamp: number;
  synced?: boolean;
}

let db: IDBDatabase | null = null;

export async function initializeOfflineStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains("cache")) {
        const store = database.createObjectStore("cache", { keyPath: "key" });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("synced", "synced", { unique: false });
      }

      if (!database.objectStoreNames.contains("policies")) {
        database.createObjectStore("policies", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("appointments")) {
        database.createObjectStore("appointments", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("documents")) {
        database.createObjectStore("documents", { keyPath: "id" });
      }
    };
  });
}

export async function cacheData(key: string, value: any): Promise<void> {
  if (!db) return;

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["cache"], "readwrite");
    const store = transaction.objectStore("cache");
    
    store.put({
      key,
      value,
      timestamp: Date.now(),
      synced: false,
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getCachedData(key: string): Promise<any | null> {
  if (!db) return null;

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["cache"], "readonly");
    const store = transaction.objectStore("cache");
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result?.value || null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCachedData(): Promise<StoredData[]> {
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["cache"], "readonly");
    const store = transaction.objectStore("cache");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearExpiredCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  if (!db) return;

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["cache"], "readwrite");
    const store = transaction.objectStore("cache");
    const index = store.index("timestamp");
    const range = IDBKeyRange.upperBound(Date.now() - maxAge);
    
    const request = index.openCursor(range);
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function storePolicy(policy: any): Promise<void> {
  if (!db) return;

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["policies"], "readwrite");
    const store = transaction.objectStore("policies");
    store.put(policy);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getAllPolicies(): Promise<any[]> {
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["policies"], "readonly");
    const store = transaction.objectStore("policies");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}
