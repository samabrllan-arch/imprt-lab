import { PRICING_CONFIG, formatCurrency } from '../config/pricing.js';
import { getDecalDimensionsCm } from '../config/decalLayout.js';

/**
 * Formatea y construye la URL de WhatsApp con el pedido detallado y medidas reales en cm
 */
export function buildWhatsAppOrderUrl(state, customerData = {}) {
  const { selectedColor, selectedSize, selectedSilhouette, selectedMaterial, selectedGrammage, customizations, pricing, isMagicMug } = state;
  const isMug = selectedSilhouette === 'mug';
  const matName = isMug
    ? (isMagicMug ? 'Cerámica Termosensible Mágica (Cambia con calor)' : 'Cerámica AAA Sublimación HD')
    : (selectedMaterial === 'poliester' ? 'Poliéster Deportivo Dry-Fit' : 'Algodón 100% Peinado');
  const silName = isMug
    ? (isMagicMug ? 'Mug Mágico 11 Oz Termosensible ✨' : 'Vaso Cerámico 11 Oz ☕')
    : (selectedSilhouette === 'woman' ? 'Mujer (Slim Fit)' : 'Hombre (Boxy Fit)');

  const phone = (customerData.phone || PRICING_CONFIG.supportPhone).replace(/[^0-9]/g, '');

  let decalsList = '';
  for (const [zoneId, zone] of Object.entries(customizations)) {
    if (zone.hasDecal && (!isMug || zoneId === 'front')) {
      const dims = getDecalDimensionsCm(zone, zoneId, selectedSize);
      const zoneName = isMug ? 'Vaso 11 Oz' : (zoneId === 'front' ? 'Frente Central' : (zoneId === 'frontPocket' ? 'Logo Pecho' : 'Espalda'));
      const wCm = isMug ? +(9.5 * (zone.scale || 1)).toFixed(1) : dims.widthCm;
      const hCm = isMug ? +(8.5 * (zone.scale || 1)).toFixed(1) : dims.heightCm;
      decalsList += `• *${zoneName}:* ${zone.name} → *${wCm} × ${hCm} cm*\n`;
    }
  }

  const modeNote = isMug
    ? '_Sublimación cilíndrica de alta definición._'
    : (state.sizeMode === 'proportional'
      ? '_Medidas proporcionales a la talla._'
      : '_Medida fija en cm para cualquier talla._');

  if (!decalsList) {
    decalsList = isMug ? '• Sin estampado\n' : '• Sin estampados (Camiseta básica lisa)\n';
  }

  const orderId = customerData.orderId ? `📋 *Orden:* #${customerData.orderId}\n` : '';

  const driveNote = customerData.driveUrl
    ? `\n☁️ *Archivo 300 DPI:* ${customerData.driveUrl}\n`
    : (customerData.hasLocalFile ? `\n📦 *Archivo 300 DPI:* Adjunto el archivo generado en este chat.\n` : '');

  const specLines = isMug
    ? `☕ *Producto:* ${silName}\n🏺 *Acabado:* ${matName}\n🎨 *Color Base:* ${isMagicMug ? 'Negro Termosensible (Interior Blanco)' : `${selectedColor.name} (${selectedColor.hex})`}\n📏 *Capacidad:* 11 Oz (325 ml · 9.5×8.2 cm)`
    : `👕 *Silueta:* ${silName}\n🧵 *Material:* ${matName}\n⚖️ *Gramaje:* ${selectedGrammage || '240'} GSM\n🎨 *Color:* ${selectedColor.name} (${selectedColor.hex})\n📏 *Talla:* ${selectedSize.label} - ${selectedSize.name} (${selectedSize.lengthCm}×${selectedSize.widthCm} cm)`;

  const message = 
`⚡ *¡HOLA! QUIERO CONFIRMAR MI PEDIDO 3D* ⚡
${orderId}-----------------------------------------
${specLines}

✨ *Estampados & Medidas Reales:*
${decalsList}${decalsList.includes('Sin estampado') ? '' : modeNote + '\n'}${driveNote}💰 *Total Liquidado:* ${formatCurrency(pricing.total)}
${customerData.name ? `👤 *Cliente:* ${customerData.name}\n` : ''}${customerData.city ? `📍 *Ciudad:* ${customerData.city}\n` : ''}-----------------------------------------
_Diseñado en IMPRNT [LAB] Atelier 3D_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje para validar el pago de un pedido registrado (NODE-024).
 * wa.me no permite adjuntar imágenes: el cliente adjunta el pantallazo manualmente en el chat.
 */
export function buildPaymentProofWhatsAppUrl(order, methodLabel = '') {
  const phone = PRICING_CONFIG.supportPhone.replace(/[^0-9]/g, '');
  const g = order.garment || {};
  const artNote = order.driveUrl
    ? `☁️ *Arte DTF 300 DPI:* ${order.driveUrl}\n`
    : (order.hasLocalFile ? '📦 *Arte DTF 300 DPI:* lo adjunto en este chat.\n' : '');

  const message =
`💳 *COMPROBANTE DE PAGO*
📋 *Orden:* #${order.id}
👕 *Prenda:* ${g.silhouette || 'Camiseta'} • Talla ${g.size || ''} • ${g.color || ''}
💰 *Total:* ${order.pricing?.formatted || ''}
${methodLabel ? `🏦 *Pagué por:* ${methodLabel}\n` : ''}${order.customer?.name ? `👤 *Cliente:* ${order.customer.name}\n` : ''}${order.customer?.city ? `📍 *Ciudad:* ${order.customer.city}\n` : ''}${order.customer?.address ? `🏠 *Dirección:* ${order.customer.address}\n` : ''}${order.customer?.phone ? `📱 *Celular:* ${order.customer.phone}\n` : ''}${artNote}-----------------------------------------
_Adjunto el pantallazo del comprobante en este chat para su validación._`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
