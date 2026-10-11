/**
 * Alias público de autor `@alias` (NODE-020 / NODE-025). Funciones puras, sin DOM ni storage.
 *  - Se guarda en minúscula y SIN la arroba; la arroba se antepone solo al mostrarlo (`formatAlias`).
 *  - 3–20 caracteres: letras, números, "_" y "."; empieza y termina con letra o número.
 *  - Único entre las cuentas de este navegador (sin backend, la unicidad es local).
 */
export const ALIAS_MIN = 3;
export const ALIAS_MAX = 20;
const PATTERN = /^[a-z0-9](?:[a-z0-9_.]*[a-z0-9])?$/;
// Nombres que sugieren ser del negocio: evitan suplantar al equipo en la galería comunitaria
const RESERVED = ['admin', 'administrador', 'soporte', 'staff', 'moderador', 'oficial', 'official', 'comunidad',
  'shirtstudio', 'shirt_studio', '3dshirtstudio', 'atelier', 'equipo'];

/** "  @Pépito Gómez! " → "pepito_gomez" */
export function normalizeAlias(input) {
  return String(input ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/^@+/, '')
    .replace(/\s+/g, '_').replace(/[^a-z0-9_.]/g, '')
    .replace(/[_.]{2,}/g, '_').replace(/^[_.]+|[_.]+$/g, '')
    .slice(0, ALIAS_MAX).replace(/[_.]+$/g, '');
}

export const formatAlias = (alias) => (alias ? `@${alias}` : '');

/** Devuelve el mensaje de error o '' si es válido. `taken` = alias ya usados por OTRAS cuentas. */
export function validateAlias(alias, taken = new Set()) {
  if (alias.length < ALIAS_MIN) return `El alias necesita al menos ${ALIAS_MIN} caracteres (letras, números, _ o .).`;
  if (!PATTERN.test(alias)) return 'Usa solo letras, números, "_" o "." y empieza y termina con letra o número.';
  if (RESERVED.includes(alias)) return 'Ese alias está reservado. Elige otro.';
  if (taken.has(alias)) return 'Ese alias ya está en uso. Prueba con otro.';
  return '';
}

/** Alias inicial a partir de un correo (o nombre): `pepito@gmail.com` → `pepito`; si está tomado, `pepito2`… */
export function suggestAlias(seed, taken = new Set()) {
  let base = normalizeAlias(String(seed || '').split('@')[0]);
  if (base.length < ALIAS_MIN) base = normalizeAlias(`${base}user`) || 'user';
  base = base.slice(0, ALIAS_MAX - 4);
  let candidate = base;
  for (let n = 2; taken.has(candidate) || RESERVED.includes(candidate); n++) candidate = `${base}${n}`;
  return candidate;
}

/** Da alias a las cuentas que no lo tienen (cuentas anteriores a esta función). */
export function ensureAliases(users) {
  const taken = new Set(users.map((u) => u.alias).filter(Boolean));
  let changed = false;
  const out = users.map((u) => {
    if (u.alias) return u;
    const alias = suggestAlias(u.email || u.name, taken);
    taken.add(alias);
    changed = true;
    return { ...u, alias };
  });
  return { users: out, changed };
}

/** Conjunto de alias usados por todas las cuentas excepto `exceptId`. */
export const takenAliases = (users, exceptId = null) =>
  new Set(users.filter((u) => u.id !== exceptId && u.alias).map((u) => u.alias));
