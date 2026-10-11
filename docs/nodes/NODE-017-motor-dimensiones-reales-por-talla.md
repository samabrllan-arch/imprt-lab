# [NODE-017]: Motor de Dimensiones Reales por Talla (Print Sizing)
- **Tipo:** Pricing / Config (lógica pura)
- **Estado:** Activo
- **Responsable:** Backend / Frontend

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-002 (`zones.js`, `SIZES` en `colors.js`)
- **Nodos de Salida (Alimenta a):** NODE-001 (acciones de talla/escala), NODE-009 (panel de medida), NODE-011 (WhatsApp)
- **Contratos / Métodos expuestos (`src/config/printSizing.js`):**
  - `computeDimsCm(scale, zoneId, size, aspect)`, `getDecalDimensionsCm(decal, zoneId, size)` -> medidas, límites y uso del área.
  - `scaleFromWidthCm`, `clampScale`, `getMaxScale`, `getWidthRangeCm`, `buildPresetWidths`.
  - `resolveScaleForSize`, `buildSizeTable`, `syncIntentWidth`, `SIZE_MODES`.
  - Tests: `node --test tests/printSizing.test.js` (11 casos).

### 📦 Responsabilidad Técnica
Única fuente de verdad de las medidas en cm. Modelo: el 3D se calibra sobre talla L (54 cm de pecho); a escala 1.0 el estampado mide `baseCm` de la zona (frente 28, bolsillo 11, espalda 29) multiplicado por (ancho prenda / 54). Modo `fixed`: mismos cm en toda talla (la escala visual se ajusta; la intención `widthCm` se conserva aunque una talla la recorte). Modo `proportional`: conserva la escala visual. Área máxima por talla (`maxPrintWidthCm/HeightCm`) y 12x12 cm (x ratio) en bolsillo.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-06 | v1.0.0] Por Orchestrator:**
  - **Cambio:** Creación del nodo. Reemplaza las fórmulas duplicadas de `decalLayout.js` (base 60 vs 28 sin ratio, bolsillo 11 vs 12, cm estáticos en botones), que ahora re-exportan este motor.
  - **Motivo:** Las medidas en cm eran incoherentes entre UI, límites y pedido.
  - **Impacto:** Medidas consistentes en UI, store y WhatsApp; la fórmula es lineal y exactamente invertible.

- **[2026-10-06 | v1.1.0] Por Frontend & UI/UX Designer:**
  - **Cambio:** Restauración del badge de talla activa (`#size-badge`) y de la tabla interactiva comparativa por talla (`#size-table`) en el panel "Medida real de impresión" (`decalSizeView.js` y `decalSizeControls.js`). Al hacer clic en cualquier celda de talla (S, M, L, XL, XXL) se conmuta la talla de visualización con notificación Toast inmediata.
  - **Motivo:** El usuario necesita visualizar cómo se adapta el estampado en las distintas tallas de confección mientras diseña en el estudio 3D, manteniendo la selección de compra en el checkout.
  - **Impacto:** Claridad dimensional total durante la edición sin duplicar selectores en la barra inferior de compra.

- **[2026-10-10 | v1.2.0] Por Backend & Frontend 3D:**
  - **Cambio:** Desbloqueo de proporciones fijas en el motor de medidas. Se integró `getHeightRangeCm`, soporte para `decal.lockAspect === false`, `decal.heightCm` y `decal.customAspect` en `getDecalDimensionsCm`, `syncIntentWidth` y `resolveScaleForSize`. Tests ampliados a 12 casos (`node --test tests/printSizing.test.js`).
  - **Motivo:** Permitir estampados no simétricos ni cuadrados (ej. 24 cm de ancho × 35 cm de alto) y aprovechar la altura física de confección (hasta 42 cm en L y 50 cm en XXL).
  - **Impacto:** El usuario puede configurar de forma totalmente independiente el ancho y el alto de los estampados.

