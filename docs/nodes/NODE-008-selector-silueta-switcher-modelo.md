# [NODE-008]: Selector de Silueta & Switcher de Modelo
- **Tipo:** UI Component / 3D Switcher
- **Estado:** Activo
- **Responsable:** Frontend / Orchestrator

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-005 (Engine 3D), NODE-012 (Modelos GLB)
- **Nodos de Salida (Alimenta a):** NODE-004 (TextureComposer: recalcula áreas UV), NODE-005 (ShirtEngine.switchModel)
- **Contratos / Módulos expuestos:**
  - `src/ui/silhouetteSelector.js`: Botones de selección de corte (Hombre: Boxy Fit vs Mujer: Slim Fit).
  - `src/state/actions.js`: `setSelectedSilhouette(type)`.
  - `ShirtEngine.switchModel(modelKey)`: Descarga e intercambia el archivo GLB (`shirt_clo_draco.glb` vs `shirt_woman_draco.glb`).

### 📦 Responsabilidad Técnica
Permitir la alternancia entre la silueta masculina y femenina, desencadenando la recarga asíncrona de la malla 3D adecuada y la reconfiguración de los límites de posicionamiento UV.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Frontend:**
  - **Cambio:** Integración en el Context Graph.
  - **Motivo:** Identificar el disparador de alternancia de silueta y su impacto en la malla activa.
  - **Impacto:** Conecta la interfaz con el cargador Draco de Three.js y el recalibrado de UVs.

- **[2026-10-06 | v1.3.0] Por [Frontend & QA]:**
  - **Cambio:** Soporte de transición fluida con indicador cyber-luxury de carga en `ModelSwapController`.
  - **Motivo:** Solicitud del usuario para eliminar el glitch donde las siluetas se cruzaban al alternar entre hombre y mujer.
  - **Impacto:** La experiencia del cliente final es suave, sin superposiciones ni artefactos de render.

- **[2026-10-06 | v1.4.0] Por [Frontend & QA]:**
  - **Cambio:** Integración del loader `ModelSwapController` en la carga inicial de la silueta masculina (`loadCloModel`), ocultación atómica inmediata de la malla previa (`visible = false`) al iniciar `swapTo` y etiquetas descriptivas de alta fidelidad ("Cargando silueta masculina • Boxy Fit...").
  - **Motivo:** Evitar cualquier cruce visual residual durante la descarga de mallas y unificar la experiencia de carga de ambos géneros.
  - **Impacto:** Transición limpia de 220ms sin artefactos ni doble malla en escena.
