import { setSize } from '../state/actions.js';
import { showToast } from './toast.js';

const fmt = (n) => String(Number(n.toFixed(1)));

/** Cambia de talla y avisa si algún estampado debió reducirse por el límite de impresión. */
export function changeSizeWithNotice(size) {
  const reduced = setSize(size);
  if (reduced.length) {
    const r = reduced[0];
    const extra = reduced.length > 1 ? ` (+${reduced.length - 1} zona${reduced.length > 2 ? 's' : ''})` : '';
    showToast(`Talla ${size.label}: el estampado se ajustó de ${fmt(r.requestedCm)} a ${fmt(r.appliedCm)} cm por el límite de impresión${extra}`, 'info', 4200);
  }
}
