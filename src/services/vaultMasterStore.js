/**
 * Archivo máster de la Bóveda en IndexedDB (NODE-026).
 *
 * `localStorage` solo admite ~5 MB por origen y guarda texto (base64 pesa +33 %): un PNG de 300 DPI de 2–4 MB
 * no cabe ni una vez. IndexedDB guarda el Blob tal cual y tiene cuota de cientos de MB. En `localStorage`
 * quedan solo los metadatos y las miniaturas. Si IndexedDB no está disponible (modo privado, navegador
 * antiguo) todas las funciones devuelven null/false y la bóveda sigue funcionando con la copia reducida.
 */
const DB_NAME = 'shirt_studio_vault_masters';
const STORE = 'masters';
let dbPromise = null;

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(null);
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
        req.onsuccess = () => resolve(req.result);
        req.onerror = req.onblocked = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

/** Ejecuta `job(store)` en una transacción; devuelve `{ ok, value }` al completarse. */
async function run(mode, job) {
  const db = await openDb();
  if (!db) return { ok: false, value: null };
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, mode);
      const req = job(tx.objectStore(STORE));
      tx.oncomplete = () => resolve({ ok: true, value: req.result ?? null });
      tx.onerror = tx.onabort = () => resolve({ ok: false, value: null });
    } catch (_) {
      resolve({ ok: false, value: null });
    }
  });
}

/** @returns {Promise<boolean>} true si el máster quedó guardado */
export async function putMaster(id, blob, meta = {}) {
  return (await run('readwrite', (s) => s.put({ id, blob, ...meta, savedAt: Date.now() }))).ok;
}

/** @returns {Promise<Blob|null>} */
export async function getMaster(id) {
  return (await run('readonly', (s) => s.get(id))).value?.blob ?? null;
}

export async function deleteMaster(id) {
  return (await run('readwrite', (s) => s.delete(id))).ok;
}
