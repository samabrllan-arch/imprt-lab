# [NODE-005]: Motor 3D Three.js & Render Loop
- **Tipo:** WebGL Engine / 3D Graphics
- **Estado:** Activo (v1.5.0)
- **Responsable:** Frontend (3D WebGL) / QA

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-004 (TextureComposer), NODE-006 (CameraManager), NODE-012 (Modelos GLB)
- **Nodos de Salida (Alimenta a):** NODE-007 (CanvasDragController), NODE-008 (SilhouetteSelector), NODE-011 (Exporter/Capturas)
- **Contratos / Módulos expuestos:**
  - `src/three/engine.js` (211 líneas): Fachada unificada (`ShirtEngine`). Métodos: `loadCloModel()`, `switchModel()`, `captureScreenshot()`, `setView()`, `dispose()` y, desde v1.5.0, `pauseRender()` / `resumeRender()` (idempotentes; recuerdan si el bucle corría, p. ej. el editor de imágenes NODE-010 los usa) y `setStudioVisible(bool)` (lo llama el router al abrir/cerrar el estudio).
  - `src/three/deviceProfile.js` (16, v1.5.0): `isMobileGpu()` (ventana <= 768 px o `pointer: coarse`), `maxPixelRatio()` (1.3 móvil / 2 escritorio) y `particleCount()` (40 móvil / 160 escritorio).
  - `src/three/scene.js` (96): Inicialización de `THREE.Scene`, `THREE.WebGLRenderer` (DPR adaptativo), tone mapping ACESFilmic y loop `requestAnimationFrame` (`startLoop`/`stopLoop`; `stopLoop` cancela el fotograma agendado y `startLoop` descarta el tiempo pausado del `Clock`).
  - `src/three/lights.js`: Iluminación de estudio fotográfico con sombras suaves y rim lights.
  - `src/three/particles.js`: Partículas de polvo ambiental doradas flotantes.

### 📦 Responsabilidad Técnica
Orquestar la visualización 3D en WebGL a 60 FPS estables. Vincular la textura generada por `NODE-004` al material PBR de la prenda, manejar el render loop, las partículas de fondo y la captura HD del modelo renderizado.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Frontend:**
  - **Cambio:** Incorporación al Context Graph.
  - **Motivo:** Eliminar dudas sobre qué clase maneja el ciclo de vida de WebGL y Three.js.
  - **Impacto:** Todas las vistas y capturas del estudio 3D dependen de este nodo.

- **[2026-10-06 | v1.3.0] Por [Frontend & Orchestrator]:**
  - **Cambio:** Integración de `ModelSwapController` en `ShirtEngine` y desacoplamiento del renderizado UV al cambiar de silueta.
  - **Motivo:** Evitar el cruce o parpadeo visual con UVs desfasadas mientras carga el modelo 3D GLB alternativo.
  - **Impacto:** Transición limpia con overlay, caché en memoria (`Map`) y pre-carga en segundo plano a 60 FPS.

- **[2026-10-09 | v1.6.0] Por Senior 3D WebGL Engineer & Frontend:**
  - **Cambio:** (1) **Puente táctil de scroll en CameraManager:** `bindTouchScrollBridge` detecta si el deslizamiento sobre el lienzo 3D es vertical u horizontal en pantallas táctiles; si es vertical, desplaza `.studio-fullscreen-workspace` fluidamente, y si es horizontal rota el modelo 360°. (2) **Zero-allocation en render loop:** `CameraManager` reutiliza un vector scratch `_scratchOffset` en vez de clonar vectores cada frame. (3) **Aligeramiento en SceneManager:** `startLoop` detecta eventos de scroll pasivo (`_isScrolling`) para alternar fotogramas durante desplazamiento veloz y ceder prioridad al hilo del compositor.
  - **Motivo:** En móvil, OrbitControls capturaba todos los gestos táctiles con `preventDefault`, atrapando al usuario en el canvas 3D e impidiendo hacer scroll hacia abajo a los controles de la prenda.
  - **Impacto:** Navegación táctil libre de bloqueos; el usuario puede desplazarse verticalmente por todo el estudio sin trabas y a 60 FPS estables.
