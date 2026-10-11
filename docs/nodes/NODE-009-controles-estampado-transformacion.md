# [NODE-009]: Controles de Estampado & Transformación UI
- **Tipo:** UI Component / Controls
- **Estado:** Activo
- **Responsable:** Frontend / Design

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-003 (Pricing), NODE-004 (TextureComposer), NODE-007 (CanvasDrag)
- **Nodos de Salida (Alimenta a):** NODE-001 (Actions: `updateDecalTransform`), NODE-004 (TextureComposer), NODE-010 (Editor de Imagen)
- **Contratos / Módulos expuestos:**
  - `src/ui/decalControls.js`: Sliders de Escala (0.2 a 2.5), Posición X (-1.4 a 1.4), Posición Y (-1.8 a 1.4), Rotación (0° a 360°), botones de centrado y eliminación.
  - `src/ui/decalUploader.js`: Carga de archivos locales (PNG, JPG, SVG) y selector de presets.
  - `src/config/decalLayout.js`: Presets de alineación rápida (pecho izquierdo, centro, gigante).

### 📦 Responsabilidad Técnica
Renderizar los controles flotantes y de panel lateral para modificar geométricamente el estampado activo de la zona seleccionada, reflejando en tiempo real las transformaciones en el lienzo WebGL.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Frontend:**
  - **Cambio:** Incorporación al Context Graph.
  - **Motivo:** Evitar discrepancias entre los rangos permitidos en los sliders y los límites matemáticos del store.
  - **Impacto:** Conexión directa y fluida entre los inputs del usuario y el canvas 2D.
- **[2026-10-06 | v1.1.0] Por Frontend:**
  - **Cambio:** Panel "Medida real de impresión" (`decalSizeView.js`, `decalSizeControls.js`, `sizeNotice.js`): lectura en cm, medidor de área máxima, ancho/alto editables con steppers, atajos en cm, modo Medida fija/Proporcional y tabla del diseño en cada talla (clic = cambiar talla). Se elimina el slider de escala % y los botones con cm estáticos. Sliders y panel se sincronizan in-place (sin re-render) y el track muestra progreso (`rangeFill.js`).
  - **Motivo:** Las medidas en cm eran inconsistentes (3 fórmulas distintas) y poco interactivas; el re-render por frame causaba tirones.
  - **Impacto:** decalControls ya no re-renderiza en `transform:*`/`size`/`sizeMode`; `updateDecalTransform` acepta `widthCm`.

- **[2026-10-06 | v1.4.0] Por [UI/UX & Frontend]:**
  - **Cambio:** Integración del Semáforo DPI en vivo en el panel de medidas de impresión (`decalSizeView.js`).
  - **Motivo:** Permitir al usuario saber si su imagen cuenta con resolución óptima (>=300 DPI) antes de ordenar.
  - **Impacto:** Retroalimentación inmediata con badge dinámico y guía de calidad.

- **[2026-10-06 | v1.5.0] Por [UI/UX & Frontend]:**
  - **Cambio:** Eliminación del botón externo "Quitar Fondo", disposición de un único botón de ancho completo "🎯 Centrar Estampado" bajo el botón de "Abrir Editor HD", y remoción de la tabla de tallas redundante en el panel lateral.
  - **Motivo:** Evitar confusión de interfaces duplicadas y concentrar la eliminación avanzada de fondo en el editor y la selección de talla en el checkout.
  - **Impacto:** Interfaz lateral limpia, sin selectores dispersos y 100% enfocada en dimensiones de estampado.

- **[2026-10-06 | v1.6.0] Por UI/UX Designer & Frontend:**
  - **Cambio:** Rediseño del estado `:hover` de `.btn-recenter-luxury` (`transform.css`). Se eliminó el texto blanco invasivo (`color: #ffffff`) que resultaba ilegible en modo claro; se implementó fondo sutil con acento de marca naranja (`#fff7ed` en claro / `rgba(255, 87, 34, 0.12)` en oscuro), texto en naranja de alto contraste (`#ea580c` / `var(--primary)`), borde de marca con resplandor (`box-shadow`), micro-animación en el icono de diana al posar el cursor y respuesta elástica en `:active`.
  - **Motivo:** El hover anterior volvía el botón blanco y desvanecía el texto sobre el fondo claro de la interfaz.
  - **Impacto:** Feedback visual premium, perfectamente legible y consistente con la estética Cyber-Luxury.

- **[2026-10-08 | v1.7.0] Por [Frontend]:**
  - **Cambio:** La galería de diseños de autor (`authorDesignsModal.js`, 158 líneas) añade el filtro "Comunidad", que muestra los diseños marcados como públicos en la Bóveda (`communityGallery.js`, NODE-026) en `#author-community-grid`; los presets siguen en `#author-presets-grid`.
  - **Motivo:** Requerimiento de usuario: los diseños públicos de la Bóveda se comparten en la Vitrina de Diseños de Autor.
  - **Impacto:** "Público" solo es visible dentro del mismo navegador (no hay backend). Aplicar un diseño de la comunidad usa el flujo existente de decals.

- **[2026-10-08 | v1.7.1] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** `decalUploader.js` (176 líneas) aplica el tope de 300 DPI al cargar un archivo (`clampToPrintDpi` + `canvasToImage`, aviso con `describeClamp`) y envía el arte ya limitado al store y al editor. `communityGallery.js` muestra `por @alias` en cada diseño comunitario (con respaldo al nombre del propietario).
  - **Motivo:** Evitar guardar y componer en la textura imágenes de decenas de MB y mostrar el crédito de autor unificado.
  - **Impacto:** Sin cambios en los contratos del store. Imágenes pequeñas no se amplían aquí.

- **[2026-10-09 | v1.8.0] Por Frontend 3D & UI/UX Designer:**
  - **Cambio:** Expansión de los rangos en los sliders de precisión de Posición X y Posición Y (`min="-2.0" max="2.0" step="0.02"` en `decalControlsView.js`) y ampliación del clamp en `actions.js` (`updateDecalTransform` a `[-2.5, 2.5]`).
  - **Motivo:** El slider de Posición Y topaba en 1.40 impidiendo subir el estampado al pectoral superior, y Posición X carecía de recorrido lateral suficiente.
  - **Impacto:** Control simétrico milimétrico con amplio recorrido vertical y lateral en todas las zonas sin zonas muertas.

- **[2026-10-10 | v1.9.0] Por UI/UX Designer & Frontend:**
  - **Cambio:** Integración del botón de candado de proporción (`#btn-lock-aspect`, 🔗 / 🔓) entre los campos de Ancho y Alto en el panel de medidas (`decalSizeView.js`, `decalSizeControls.js`, `sizePanel.css`). Desacoplamiento de `applyWidth` y `applyHeight`: cuando la proporción está libre (`lockAspect: false`), el usuario puede modificar independientemente el ancho o el alto (ej. 24 × 35 cm) sin obligar a proporciones simétricas ni cuadradas. Modularización de estilos DPI a `dpiBadge.css`.
  - **Motivo:** El usuario necesitaba libertad para colocar estampados alargados hacia abajo y ajustar libremente las proporciones horizontales y verticales.
  - **Impacto:** Flexibilidad total de diseño sin romper la proporción natural por defecto.

- **[2026-10-10 | v1.9.1] Por UI/UX Designer & Frontend:**
  - **Cambio:** Incorporación de la barra deslizante independiente de Alto (`#height-cm-slider`, `.slider-field#height-slider-field`). Al desbloquear la proporción con 🔓, se revela instantáneamente un slider dedicado para el Alto con lectura en cm en vivo (`#height-slider-val`) y límites reales (4 cm a 42-50 cm), permitiendo arrastrar y graduar el alto táctil y visualmente sin limitarse al teclado numérico. Al bloquear con 🔗, el slider de alto se oculta limpiamente y el slider principal retoma el control proporcional conjunto. Modularización de `.size-table` a `sizeTable.css`.
  - **Motivo:** El usuario reportó que al desbloquear la proporción libre sólo existía la barra deslizante para el ancho, careciendo de una barra para ajustar el alto.
  - **Impacto:** Experiencia táctil y ergonómica completa con doble barra deslizante contextual para diseño libre.


