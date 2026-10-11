# [NODE-007]: Arrastre Interactivo de Estampados (CanvasDrag)
- **Tipo:** Pointer Events / Interaction
- **Estado:** Activo
- **Responsable:** Frontend / Interaction Design

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-005 (Engine 3D), NODE-006 (Camera Flat Mode)
- **Nodos de Salida (Alimenta a):** NODE-001 (Actions: `updateDecalTransform`), NODE-004 (TextureComposer), NODE-009 (Decal Controls UI)
- **Contratos / Módulos expuestos:**
  - `src/three/canvasDragController.js`:
    - `onPointerDown(e)`: Detecta inicio de arrastre (activo si `viewMode === 'flat'` o teclas modificadoras).
    - `onPointerMove(e)`: Convierte el desplazamiento en píxeles del mouse a deltas de `offsetX` y `offsetY` normalizados.
    - `onPointerUp()`: Libera el arrastre.

### 📦 Responsabilidad Técnica
Permitir que el usuario mueva el estampado directamente haciendo clic y arrastrando sobre la prenda en el lienzo del visor, sincronizando en vivo los sliders numéricos de la barra lateral.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v2.1.0] Por Frontend & Interaction Design:**
  - **Cambio:** Corrección del signo de `deltaY` en `canvasDragController.js` (`newY = initOffsetY - deltaY * scaleFactor`) y desvinculación de la restricción de bounds colapsados.
  - **Motivo:** El arrastre hacia arriba invertía el movimiento del diseño hacia abajo y quedaba bloqueado por los límites colapsados.
  - **Impacto:** Arrastre táctil y con cursor 100% natural, directo y fluido en ambos ejes.

- **[2026-10-05 | v1.0.0] Por Frontend:**
  - **Cambio:** Mapeo en el Context Graph.
  - **Motivo:** Identificar la conexión entre el gesto del mouse y la mutación de estado de coordenadas UV.
  - **Impacto:** Conecta la experiencia táctil 2D con el render 3D inmediato.

- **[2026-10-06 | v1.3.0] Por [Frontend]:**
  - **Cambio:** Corrección del signo en `getVertSign` (+1) en `decalLayout.js` sincronizado con `CanvasDragController`.
  - **Motivo:** El movimiento del ratón en modo plano estaba invertido verticalmente (arrastrar abajo movía arriba y viceversa).
  - **Impacto:** Movimiento 1:1 intuitivo (abajo = abajo, arriba = arriba) en camisetas de hombre y mujer.
