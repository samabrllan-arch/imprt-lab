/**
 * Catálogo unificado de diseños (NODE-014): drops oficiales + diseños públicos de la comunidad.
 * Orden "más recientes primero": los de la comunidad llevan fecha de publicación (`createdAt`, el más nuevo antes)
 * y van delante; los drops oficiales no tienen fecha y conservan el orden curado de `config/lookbook.js`.
 */
import { LOOKBOOK_ITEMS } from '../config/lookbook.js';
import { communityItems } from './lookbookCard.js';

export const LANDING_LATEST = 4;

export const allDesigns = () => [...communityItems(), ...LOOKBOOK_ITEMS];
export const latestDesigns = (n = LANDING_LATEST) => allDesigns().slice(0, n);
export const findDesign = (id) => allDesigns().find((item) => item.id === id);
