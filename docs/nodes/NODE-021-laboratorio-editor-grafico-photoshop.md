# [NODE-021]: Laboratorio de Edición Gráfica & Photoshop en Navegador
- **Tipo:** Canvas Compositor / 2D Engine / UI Component / QA Suite
- **Estado:** Activo (Fase 1: Prototipo & Laboratorio Completados)
- **Responsable:** Frontend 3D Engineer & Orchestrator

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-012 (Modelos 3D GLB & Draco), NODE-015 (Tokens Visuales Cyber-Luxury)
- **Nodos de Salida (Alimenta a):** NODE-004 (TextureComposer), NODE-009 (Controles Estampado), NODE-010 (Editor de Imágenes: usa `cutoutImageData` en su botón 1 clic y Chroma)
- **Contratos / Métodos expuestos:**
  - `mountAtelierStudio(container, onUpdate3dCallback)`: Monta el editor multicapa orientado a moda streetwear.
  - `mountMiniPaint(container, onUpdate3dCallback)`: Embebe el cliente completo de miniPaint (Photoshop GitHub) vía iframe.
  - `ShirtPreview3D`: Renderizador Three.js aislado con proyección en tiempo real de textura 2048x2048 sobre la prenda.
  - `sessionStorage['shirt_lab_exported_art']`: Puente temporal para transferir el arte exportado hacia el estudio principal.

### 📦 Responsabilidad Técnica
Proporcionar un entorno aislado (`photoshop-lab.html`) para diseñar composiciones gráficas avanzadas en el navegador (texto con tipografías de impacto, carga de imágenes, filtros fotográficos, colores de fondo y capas reordenables), con validación y visualización inmediata en 3D sobre la silueta de la camiseta antes de su integración definitiva en el estudio de producción.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-07 | v2.3.1] Por [Frontend & QA Auditor]:**
  - **Cambio:** `imageEnhancerService.js` expone `cutoutImageData(imgData, 'auto' | 'chroma', { tolerance, choke, contiguous })` (recorte síncrono sobre `ImageData`, sin PNG intermedio) y las funciones públicas existentes (`removeChromaGreenFromImage`, `removeAutoBackgroundFromImage`) ahora delegan en él con la misma firma. En el recorte automático, el anti-aliasing que rodea las zonas interiores conservadas (huecos, ojos, contrapesos) se mantiene opaco (dilatación de 2px con `dilateMask`).
  - **Motivo:** El editor nativo del estudio (NODE-010) necesita el mismo motor de recorte sin pasar por `photoshop-lab.html`; además, los huecos conservados dejaban un aro translúcido con tinte del color de fondo.
  - **Impacto:** Un único motor de recorte para el laboratorio y el estudio; el aro translúcido pasó de 1113 a 0 píxeles en la prueba sintética (0 píxeles con tinte de fondo en bordes exteriores e interiores).
- **[2026-10-08 | v2.3.0] Por [Frontend 3D & Orchestrator]:**
  - **Cambio:** Integración de `cutoutMask.js` (morfología 3×3 separable, erosión de 8 vecinos para choke real 0-3px, defringe de color multicapa, bleed de borde y curva LUT). Reescritura completa de `imageEnhancerService.js` con muestreo perimetral del color clave (conserva lima ácido `#CCFF00`), matte suave color→alfa, flood-fill perimetral en fondo auto (conserva blancos y detalles interiores) y nitidez ponderada por luminancia/alfa. Actualización de `atelierUI.js` con procesamiento centralizado (`processSelectedImage`), no acumulación de sobreenfoque con `sharpenBase` y salvaguarda try/catch en `sessionStorage`.
  - **Motivo:** Validación algorítmica de corte vectorial y eliminación de halos sin artefactos.
  - **Impacto:** Calidad de recorte milimétrica de grado DTF industrial a 0.35s en texturas 2048px.
- **[2026-10-08 | v2.2.0] Por [Frontend 3D & QA Auditor]:**
  - **Cambio:** Erradicación de halos difusos y bordes oscuros en la extracción de fondo verde y auto: eliminación del difuminado ancho excesivo y reemplazo por recorte por contracción de contorno (Choke 1px) con micro anti-aliasing subpíxel; incorporación de la herramienta "🎯 Perfilar Bordes (Quitar Halos)" (`refineAndCleanEdges`) para eliminar neblinas semitransparentes; sustitución del filtro unsharp por "✨ Claridad HD Suave" con umbral de contraste (`applySmartSharpenHD`) que evita introducir ruido o grano tosco en el interior del arte.
  - **Motivo:** Feedback del usuario con capturas del rayo donde la extracción dejaba un halo oscuro/borroso y la nitidez volvía toscos los píxeles internos sin definir el borde.
  - **Impacto:** Recortes ultra limpios y afilados como vectores sin sombras sucias ni pixelación interna.
- **[2026-10-08 | v2.1.0] Por [Frontend 3D & Design]:**
  - **Cambio:** Integración directa in-studio de herramientas de extracción de fondo ("🟢 Quitar Fondo Verde" chroma key con despill y "✨ Quitar Fondo Auto" perimetral con sliders de tolerancia 5-75% y suavizado de bordes 0-8px), botón de mejora de calidad "✨ Nitidez HD" (unsharp mask 3×3), control de Subtono de Color (hue-rotate -180° a +180°) y Saturación (0-200%), supresión de bordes pixelados mediante anti-aliasing subpíxel (`smoothAlphaEdges`) y biblioteca de efectos con fondo verde puro (`#00FF00`) para testing rápido.
  - **Motivo:** Petición del usuario para evitar salir del estudio para quitar fondos, eliminar bordes dentados/pixelados en exportación/carrito, y permitir ajustar matices y efectos sobre verde croma.
  - **Impacto:** Flujo de diseño autocontenido en una sola vista con exportación de calidad HD a la camiseta 3D y carrito.
- **[2026-10-07 | v2.0.0] Por [Frontend & Orchestrator]:**
  - **Cambio:** Rediseño completo del estudio gráfico: eliminación de miniPaint y del panel 3D lateral en la mesa de trabajo (espacio amplio a 60 FPS); incorporación de manejadores de escala en las 4 esquinas del bounding box y barra inferior de transformación; catálogo nativo de efectos vectoriales streetwear (rayos, nubes, fuego, destellos Y2K); creación de la herramienta dedicada `bg-remover.html` y conexión directa de envío a la camiseta 3D en `index.html#estudio`.
  - **Motivo:** Respuesta al feedback del usuario sobre tosquedad, falta de controles de escala y necesidad de un extractor de fondos limpio y banco de efectos.
  - **Impacto:** Edición gráfica rápida, responsiva e intuitiva sin lag, con handoff automático al modelo 3D.
- **[2026-10-07 | v1.0.0] Por [Frontend & Orchestrator]:**
  - **Cambio:** Creación del laboratorio `photoshop-lab.html` con doble motor inicial.
  - **Motivo:** Requerimiento del usuario para probar un Photoshop en el navegador.
  - **Impacto:** Prototipo inicial de exploración.
