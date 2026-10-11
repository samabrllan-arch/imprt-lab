# [NODE-001]: Store Reactivo & Acciones de Estado
- **Tipo:** State Management / EventBus
- **Estado:** Activo
- **Responsable:** Orchestrator / Frontend

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** Ninguno (Fuente única de verdad)
- **Nodos de Salida (Alimenta a):** NODE-003, NODE-004, NODE-005, NODE-006, NODE-007, NODE-008, NODE-009, NODE-011
- **Contratos / Métodos expuestos:**
  - `store.getState()`: Retorna el estado global inmutable.
  - `store.subscribe(listener)`: Notifica cambios con clave atómica (`changeKey`).
  - `store.notify(changeKey)`: Dispara reactividad selectiva.
  - `setSelectedColor(color)`, `setActiveZone(zoneId)`, `setDecal(zoneId, data)`, `updateDecalTransform(zoneId, transform)`, `setSelectedSilhouette(type)`, `setViewMode(mode)`.

### 📦 Responsabilidad Técnica
Almacenar, mutar y notificar de forma síncrona el estado global de la aplicación (silueta seleccionada, color activo, transformaciones de estampados X/Y/Escala/Rotación, vista de cámara activa, modo 3D vs plano y desglose financiero).

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Orchestrator:**
  - **Cambio:** Creación e indexación del nodo dentro del Context Graph del proyecto.
  - **Motivo:** Estandarización de memoria viva y desacoplamiento de capas para evitar búsquedas a ciegas.
  - **Impacto:** Conecta el motor 3D, el compositor UV y todos los controles de UI con cero fricción.
- **[2026-10-06 | v1.1.0] Por Orchestrator:**
  - **Cambio:** Estado: `sizeMode` y `customizations[*].widthCm`. Acciones: `setSizeMode`; `setSize` recalcula estampados según el modo y devuelve las zonas reducidas; `setDecal` re-limita la escala por proporción de imagen; `updateDecalTransform` acepta `widthCm`.
  - **Motivo:** Centralizar la graduación por talla en el store y no en la UI.
  - **Impacto:** NODE-004 recompone al evento `size`; NODE-009/003/011 consumen el nuevo contrato.

- **[2026-10-10 | v1.2.0] Por Orchestrator & Frontend:**
  - **Cambio:** Estado: añadido `heightCm: null`, `lockAspect: true`, `customAspect: null` a cada zona en `customizations`. Nueva acción `toggleLockAspect(zoneId)` y soporte de `heightCm` y `lockAspect` en `updateDecalTransform`.
  - **Motivo:** Permitir la edición libre e independiente de ancho y alto para personalizaciones no simétricas.
  - **Impacto:** Almacenamiento desacoplado de dimensiones reales consumido por `NODE-004`, `NODE-009` y `NODE-017`.

