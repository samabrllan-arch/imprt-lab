/**
 * Actualización del perfil de cliente sobre la lista de cuentas (NODE-025). Función pura: la usa
 * `authService.updateUserProfile`, que se encarga de guardar y de notificar.
 */
import { normalizeProfile, validateProfile } from './profileValidation.js';
import { takenAliases, validateAlias } from './userAlias.js';
import { LEGAL_TERMS_VERSION } from '../config/legalTerms.js';

/**
 * @returns {{ users: object[], user: object, aliasChanged: boolean }}
 * @throws Error con `.fields` = { campo: 'mensaje' } si hay datos inválidos
 */
export function applyProfileUpdate(users, userId, { termsAccepted, ...fields } = {}) {
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('Usuario no encontrado.');

  const data = normalizeProfile(fields);
  const errors = validateProfile(data);
  if (!data.alias) delete data.alias; // vacío = conservar el alias actual
  else if (!errors.alias) {
    const msg = validateAlias(data.alias, takenAliases(users, userId));
    if (msg) errors.alias = msg;
  }
  if (Object.keys(errors).length) throw Object.assign(new Error(Object.values(errors)[0]), { fields: errors });

  const now = new Date().toISOString();
  const next = { ...users[idx], ...data, updatedAt: now };
  if (termsAccepted && next.termsVersion !== LEGAL_TERMS_VERSION) {
    next.termsVersion = LEGAL_TERMS_VERSION;
    next.termsAcceptedAt = now;
  }
  const out = users.slice();
  out[idx] = next;
  return { users: out, user: next, aliasChanged: next.alias !== users[idx].alias };
}
