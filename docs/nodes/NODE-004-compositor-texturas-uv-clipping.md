# [NODE-004]: Compositor de Texturas UV & Clipping 2D
- **Tipo:** Canvas Compositor / 2D Engine
- **Estado:** Activo
- **Responsable:** Frontend (3D WebGL)

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-002 (Config y Presets), NODE-012 (Modelos 3D GLB)
- **Nodos de Salida (Alimenta a):** NODE-005 (Motor 3D Three.js), NODE-009 (Controles de Estampado)
- **Contratos / Métodos expuestos:**
  - `TextureComposer.compose(state)`: Redibuja el canvas 2048x2048 con fondo textil y capas de estampados.
  - `TextureComposer.getTexture()`: Retorna `THREE.CanvasTexture` vinculada al material PBR.
  - `src/config/zones.js`: Coordenadas de los centros de proyección UV y factores de escala por silueta (`man` vs `woman`).
  - `drawDecal(ctx, decal, area, silhouette)`: Aplica traslación, rotación, escala, compensación de `flipY` y máscara `ctx.clip()`.

### 📦 Responsabilidad Técnica
Generar en tiempo real la textura difusa 2D de alta resolución (2048×2048) proyectada sobre la malla 3D. Controla las coordenadas cartesianas de cada zona y aplica el enmascaramiento para que los gráficos no desborden sobre costuras indeseadas.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v2.1.0] Por Frontend 3D & Orchestrator:**
  - **Cambio:** Calibración de centrado horizontal óptico en `decalLayout.js` (`getSilhouetteOffsetX`) para alinear milimétricamente el frente femenino con el vértice del escote sin modificar `zones.js`. Eliminación del encogimiento artificial de `clampCenterToBounds` que bloqueaba el movimiento vertical y horizontal de los sliders y del arrastre.
  - **Motivo:** Restricción estricta de no modificar `zones.js` y corrección del bloqueo en `offsetY` y desvío horizontal visual en la silueta femenina.
  - **Impacto:** Libertad total de movimiento vertical (pecho alto/medio/bajo) y horizontal con centrado óptico perfecto al 100%.

- **[2026-10-05 | v2.0.0] Por Frontend:**
  - **Cambio:** Unificación total del espacio UV entre Hombre y Mujer. Coordenadas de pecho frontal (`y: 720`), bolsillo y espalda sincronizadas a la misma orientación vertical (`vertSign = 1`). Eliminación de cajas de recorte artificiales (`bounds: WOMAN_FRONT_BOUNDS`) ya que la nueva malla femenina posee UVs continuas completas.
  - **Motivo:** Reconstrucción de la silueta femenina con topología CLO3D.
  - **Impacto:** Ambos modelos responden idénticamente a traslaciones verticales y sliders sin cortes ni zonas muertas.

- **[2026-10-05 | v1.1.0] Por Frontend:**
  - **Cambio:** Mapeo formal en el Context Graph. Documentación del comportamiento de `vertSign` y de la máscara `ctx.clip()` de 4.40x para prevenir líneas de corte prematuras en el torso.
  - **Motivo:** Centralizar el conocimiento técnico de cómo la textura 2D interactúa con las UVs de los modelos masculino y femenino.
  - **Impacto:** Cualquier ajuste de posición Y en `zones.js` o `decalControls.js` repercute directamente en la proyección sobre la prenda en `NODE-005`.
- **[2026-10-06 | v2.2.0] Por Frontend 3D & QA:**
  - **Cambio:** Calibración milimétrica del centro frontal en `zones.js` (`x: 568` para hombre y mujer) y eliminación del offset negativo residual en `decalLayout.js` (`getSilhouetteOffsetX = 0`).
  - **Motivo:** El estampado aparecía sutilmente desplazado hacia la izquierda en ambas siluetas en vista frontal/plana.
  - **Impacto:** Alineación simétrica perfecta respecto a la costura central del cuello y tórax tanto en Boxy Fit como en Slim Fit.

- **[2026-10-09 | v2.5.0] Por Frontend 3D & Orchestrator:**
  - **Cambio:** Calibración de la zona Logo Pecho (`frontPocket`): elevación del origen UV base a `y: 755` (alineación natural con el pectoral superior/bolsillo), ampliación de los bounds físicos de la silueta masculina a `[minX: 260, maxX: 560, minY: 520, maxY: 940]` y femenina a `[minX: 280, maxX: 540, minY: 920, maxY: 1250]`, y expansión de límites a `minOffset: -2.2, maxOffset: 2.2`.
  - **Motivo:** El logo del pecho quedaba posicionado muy bajo por defecto y obligaba al usuario a llevar el slider Y a su límite máximo (1.40), impidiendo desplazarlo más arriba o con libertad lateral.
  - **Impacto:** Por defecto el logo del pecho se sitúa en la posición óptima de diseño, con holgura vertical completa y libertad de desplazamiento lateral simétrico hacia el costado o centro.

- **[2026-10-10 | v2.6.0] Por Frontend 3D & QA:**
  - **Cambio:** Ampliación del límite inferior de desplazamiento vertical (`minY: 320` en silueta masculina y `minY: 500` en femenina para Frente y Espalda en `zones.js`) con `minOffset: -2.5`. Actualización de `computeDecalSize` en `decalLayout.js` y `TextureComposer.drawDecal` para renderizar estampados con dimensiones físicas independientes (`decal.widthCm` y `decal.heightCm`) y extensión de altura vertical hasta 1.8x.
  - **Motivo:** Permitir estampados rectangulares alargados de hasta 35-42 cm de alto sin colapsar ni encoger en altura, y dar libertad de movimiento hacia el abdomen y dobladillo inferior.
  - **Impacto:** Libertad dimensional completa para estampados streetwear oversize y pósteres verticales alargados.



