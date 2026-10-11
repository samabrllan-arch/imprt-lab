import { FABRIC_COLORS, SIZES } from '../config/colors.js';
import { PRICING_CONFIG } from '../config/pricing.js';
import { FABRIC_GRAMMAGES } from '../config/materials.js';

/**
 * Estado inicial de la aplicación
 */
const initialState = {
  selectedColor: FABRIC_COLORS[0], // Washed Terracotta por defecto (#874438)
  selectedSilhouette: 'man',       // 'man' (Boxy Fit) o 'woman' (Slim Fit)
  selectedMaterial: 'algodon',     // 'algodon' (100% Peinado) o 'poliester' (Dry-Fit)
  selectedGrammage: '240',         // '120', '180' o '240' GSM
  selectedSize: SIZES[2],          // L por defecto
  sizeMode: 'fixed',               // 'fixed' (mismos cm en toda talla) | 'proportional' (crece con la prenda)
  activeZone: 'front',             // Zona activa editándose
  activeView: 'front',             // Ángulo de cámara 3D
  viewMode: '3d',                  // '3d' (órbita 360) o 'flat' (vista técnica plana)
  isAutoRotate: false,             // Giro automático 360
  customizations: {
    front: {
      hasDecal: false,
      imageSrc: null,
      imageElement: null,
      name: '',
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      widthCm: null, // Ancho real deseado (cm): fuente de verdad en modo medida fija
      heightCm: null, // Alto real deseado (cm)
      lockAspect: true, // Proporción vinculada (true) o libre (false)
      customAspect: null,
      opacity: 1.0
    },
    frontPocket: {
      hasDecal: false,
      imageSrc: null,
      imageElement: null,
      name: '',
      scale: 0.85,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      widthCm: null,
      heightCm: null,
      lockAspect: true,
      customAspect: null,
      opacity: 1.0
    },
    back: {
      hasDecal: false,
      imageSrc: null,
      imageElement: null,
      name: '',
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      widthCm: null,
      heightCm: null,
      lockAspect: true,
      customAspect: null,
      opacity: 1.0
    }
  },
  pricing: {
    basePrice: PRICING_CONFIG.baseShirtPrice,
    addonsTotal: 0,
    total: PRICING_CONFIG.baseShirtPrice
  }
};

class Store {
  constructor() {
    this.state = structuredClone(initialState);
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changeKey) {
    this.calculatePricing();
    for (const listener of this.listeners) {
      try {
        listener(this.state, changeKey);
      } catch (err) {
        console.error('[Store] Error en listener:', err);
      }
    }
  }

  calculatePricing() {
    let addons = 0;
    const c = this.state.customizations;
    for (const [zoneId, decal] of Object.entries(c)) {
      if (decal && decal.hasDecal) {
        addons += PRICING_CONFIG.zonePrices[zoneId] || 0;
      }
    }
    addons += PRICING_CONFIG.sizeAddons[this.state.selectedSize.id] || 0;

    const grammageObj = FABRIC_GRAMMAGES.find(g => g.id === this.state.selectedGrammage);
    if (grammageObj && grammageObj.priceModifier) {
      addons += grammageObj.priceModifier;
    }

    this.state.pricing.addonsTotal = addons;
    this.state.pricing.total = Math.max(35000, this.state.pricing.basePrice + addons);
  }
}

export const store = new Store();
