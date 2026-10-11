# [NODE-003]: Matriz de Costos & Precios en Vivo
- **Tipo:** Pricing / Finance
- **Estado:** Activo
- **Responsable:** Backend / Frontend

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store)
- **Nodos de Salida (Alimenta a):** NODE-009 (Decal Controls), NODE-011 (Checkout WhatsApp)
- **Contratos / Módulos expuestos:**
  - `src/config/pricing.js`: Constantes base (`BASE_PRICE`, `ZONE_PRICES`, `DISCOUNTS`).
  - `calculateTotalPrice(customizations)`: Función pura de cálculo en tiempo real.
  - `src/ui/pricingBar.js`: Renderizado de la barra inferior con precio total y desglose por zonas estampadas.

### 📦 Responsabilidad Técnica
Gestionar la tarificación dinámica del producto sumando el costo de la prenda base y el recargo por cada zona estampada (pecho, espalda, mangas), alimentando la barra de cotización y el checkout.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Backend:**
  - **Cambio:** Incorporación al Context Graph.
  - **Motivo:** Evitar dispersión de la lógica de costos entre la UI y el despacho de la orden.
  - **Impacto:** Transparencia total en el costo por zona estampada.
- **[2026-10-06 | v1.1.0] Por Backend:**
  - **Cambio:** `pricingBar.js` deja de re-renderizar en eventos `transform:*` (el precio no depende de ellos) y usa `changeSizeWithNotice`. Muestra largo/pecho de la talla junto al selector.
  - **Motivo:** Re-render del dock en cada frame de arrastre provocaba jank.
  - **Impacto:** Sin cambios en la matriz de precios. El cambio de talla avisa si algún estampado se recorta por el área máxima.
