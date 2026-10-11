/**
 * Validación y normalización del perfil de cliente (NODE-025).
 * Función pura, sin DOM ni storage: la usan `authService.updateUserProfile` y `userProfileModal`.
 */
import { ALIAS_MAX, normalizeAlias } from './userAlias.js';

export const PROFILE_FIELDS = ['name', 'alias', 'phone', 'city', 'address', 'deliveryNotes'];

const LIMITS = { name: 80, alias: ALIAS_MAX, phone: 20, city: 60, address: 140, deliveryNotes: 200 };

/** Quita espacios sobrantes y recorta al largo máximo de cada campo. */
export function normalizeProfile(input = {}) {
  const out = {};
  for (const key of PROFILE_FIELDS) {
    out[key] = key === 'alias'
      ? normalizeAlias(input[key])
      : String(input[key] ?? '').replace(/\s+/g, ' ').trim().slice(0, LIMITS[key]);
  }
  return out;
}

/** Devuelve `{ field: 'mensaje' }`; objeto vacío = válido. El nombre es el único obligatorio. */
export function validateProfile(data) {
  const errors = {};
  if (data.name.length < 3) errors.name = 'Escribe tu nombre completo (mínimo 3 caracteres).';
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15 || !/^\+?[\d\s()-]+$/.test(data.phone)) {
      errors.phone = 'Ingresa un celular válido, por ejemplo +57 300 123 4567.';
    }
  }
  if (data.city && data.city.length < 2) errors.city = 'Escribe la ciudad o municipio.';
  return errors;
}
