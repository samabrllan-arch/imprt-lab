# [NODE-013]: Enrutador de Vistas (Landing <-> Estudio 3D)
- **Tipo:** UI Router / View Lifecycle
- **Estado:** Activo (v1.6.1)
- **Responsable:** Frontend / Orchestrator

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-005 (Engine 3D), NODE-014 (controlador de la vista `#galeria`), NODE-028 (controlador de la vista `#conocenos`)
- **Nodos de Salida (Alimenta a):** Todos los componentes de UI (`landing`, `studio`, `modales`)
- **Contratos / Módulos expuestos:**
  - `src/ui/appRouter.js`: Maneja eventos de hash change (`#estudio`, `#inicio`, `#catalogo`), transiciones de pantalla completa y reescalado de WebGL (`resize`).
  - `src/ui/studioLoader.js`: Pantalla de carga Cyber-Luxury con barra de progreso y animaciones de bienvenida.

  - **Vista `#galeria` (v1.5.0):** `src/ui/appRouter.js` (228 líneas) delega en `src/ui/appRouterGallery.js` (46): `openGallery(router, pushHash)` / `closeGallery(router, updateHash)`. Estado `isGalleryOpen`, `galleryView` (`#gallery-view` en `index.html`), `setGalleryController({ open, close })` (se enlaza en `main.js`). Se abre con el hash `#galeria`, con `[data-action="open-gallery"]` o `a[href="#galeria"]`; Escape y "Volver a la Tienda" la cierran y la landing recupera su posición de scroll. Persistencia en `sessionStorage['shirt_current_view'] = 'gallery'` y clase `route-gallery` inyectada desde el `<head>` (sin destello al recargar). Estudio y Auth cierran la galería antes de abrirse; el botón Atrás del navegador vuelve entre `#estudio` y `#galeria`.
  - **Vista `#conocenos` (v1.6.0):** `appRouter.js` (230 líneas) delega en `src/ui/appRouterAbout.js` (47): `openAbout(router, pushHash)` / `closeAbout(router, updateHash)`, con estado `isAboutOpen`, `aboutView` (`#about-view`) y `setAboutController({ open, close })` (se enlaza en `main.js` con `AboutFullscreenView`, NODE-028). Se abre con el hash `#conocenos` o `#nosotros`, con `[data-action="open-about"]` o `a[href="#conocenos"]`; Escape y "Volver a la Tienda" la cierran. Persistencia en `sessionStorage['shirt_current_view'] = 'about'` y clase `route-about` inyectada desde el `<head>`. Estudio, Galería y Auth cierran Conócenos antes de abrirse. Los disparadores de clic (Estudio, Galería, Conócenos y Auth) viven ahora en `src/ui/appRouterTriggers.js` (34): `bindViewTriggers(router)`.

### 📦 Responsabilidad Técnica
Gestionar la alternancia fluida entre la página de aterrizaje (Landing page con Hero Showcase, Lookbook y Formulario) y el Estudio 3D inmersivo de personalización a pantalla completa.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Frontend:**
  - **Cambio:** Integración en el Context Graph.
  - **Motivo:** Asegurar que el cambio entre la landing comercial y el taller 3D no provoque fugas de memoria en WebGL ni re-renderizados innecesarios.
  - **Impacto:** Experiencia de navegación instantánea sin recarga de página.

- **[2026-10-06 | v1.2.0] Por [Frontend & Orchestrator]:**
  - **Cambio:** Incorporación de persistencia de sesión en `sessionStorage` (`shirt_current_view = studio`), inyección de clase `route-studio` en `document.documentElement` desde el `<head>` de `index.html` y sincronización instantánea en `checkInitialRoute()`.
  - **Motivo:** Al pulsar F5 (refrescar página) en el navegador mientras se estaba en el estudio 3D, la aplicación volvía a mostrar la landing page inicial.
  - **Impacto:** Al recargar la página (F5) con `#estudio` o habiendo estado en el estudio, permanece 100% en el visor 3D sin destellos ni saltos a la landing page.

- **[2026-10-07 | v1.3.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Creación del laboratorio interactivo de loaders (`loader-preview.html`), generación de activos holográficos 3D con IA (`public/assets/loader/`) y calibrador fotograma a fotograma.
  - **Adopción Oficial:** Se implementó permanentemente la variante **"Escaneo Cuántico Orbital (IA + CLO3D)"** (`loader_cyber_scan.jpg`) como el loader oficial por defecto en `src/ui/studioLoader.js` con telemetría de caída de tela, escaneo 360° y resplandor dual magenta/cian.
- **[2026-10-07 | v1.3.1] Por [QA & UI/UX Designer]:**
  - **Cambio:** Corrección de alineación concéntrica estricta en el escenario holográfico. Se desacopló la animación heredada `floatAmbient` (que contenía `translate(25px, -20px)`) sustituyéndola por `holoFloat` sobre el contenedor padre y `pulseHoloGlow` en el activo visual, además de fijar dimensiones `width="136" height="136"` con `loading="eager"`.
  - **Motivo:** En el primer renderizado, la imagen del loader se desplazaba 25px hacia la esquina superior derecha saliéndoseles de los aros concéntricos de radar.
  - **Impacto:** Imagen 100% concéntrica y anclada al centro de los anillos de radar en cualquier momento y dispositivo sin desfase.

- **[2026-10-07 | v1.4.0] Por [Frontend & UI/UX Designer]:**
  - **Cambio:** Soporte integral en `AppRouter` para la vista dedicada a pantalla completa `#auth-view` (`openAuth()`, `closeAuth()`, control hash `#cuenta`/`#login`/`#registro`), sincronización fluida a 60 FPS y tecla Escape.
  - **Motivo:** Requerimiento de usuario para una transición a pantalla completa dedicada de registro/login estilo Atelier 3D con máxima fluidez.
  - **Impacto:** Navegación ultra-fluida e instantánea entre Landing, Estudio 3D y Portal de Autenticación sin recargas de página.

- **[2026-10-07 | v1.4.1] Por [QA & Fullstack Architect]:**
  - **Cambio:** Sincronización modular del pipeline CSS vinculando `navbar.css` y `authFullscreen.css` en `src/main.js` y mediante `@import` en `landing.css`, reordenamiento en `<head>` de `index.html` y fijación de atributos nativos de dimensión en el logo (`width="24" height="24"`).
  - **Motivo:** El navegador en desarrollo retenía la versión previa de `landing.css` sin renderizar la nueva barra desacoplada tras actualización HMR en caliente.
  - **Impacto:** Renderizado instantáneo, ordenado y 100% blindado tanto en desarrollo como en producción.

- **[2026-10-08 | v1.5.0] Por [Lead Architect, UI/UX Designer, Frontend WebGL & QA Auditor]:**
  - **Cambio:** `AppRouter` gestiona la tercera vista a pantalla completa `#galeria` (`appRouterGallery.js`), con control de hash, clic delegado, Escape, restauración del scroll de la landing y `route-gallery` en `index.html`; `main.js` monta `initCommunityGalleryView`. Se conservan las terminaciones de línea CRLF de `index.html` y `main.js`.
  - **Motivo:** Requerimiento de usuario: la galería completa debe conmutar a pantalla completa igual que `#estudio` o `#login`.
  - **Impacto:** Verificado en Chromium: clic en el CTA abre `#galeria` (landing oculta); Estampar en 3D pasa a `#estudio` y cierra la galería; Atrás vuelve a `#galeria`; Escape vuelve a la tienda; carga directa de `#galeria` y recarga permanecen en la galería. `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm, por lo que no hay `node_modules`): ejecútalo localmente. En su lugar se verificó `node --check` de cada archivo tocado, la resolución de imports/exports y el comportamiento en Chromium (Playwright).

- **[2026-10-08 | v1.6.0] Por [Orchestrator & Frontend 3D Engineer]:**
  - **Cambio:** `AppRouter` gestiona la cuarta vista a pantalla completa `#conocenos` (`appRouterAbout.js`): hash (`#conocenos`, `#nosotros`), clic delegado, Escape, `checkInitialRoute()` y `route-about` en el `<head>`. El listener de clic se extrae a `appRouterTriggers.js`; `appRouter.js` queda en 230 líneas. `appRouterGallery.js` también cierra Conócenos al abrirse.
  - **Motivo:** Requerimiento de usuario: "Conócenos" deja de ser una sección del landing y pasa a ser una vista dedicada como `#galeria` y `#estudio`.
  - **Impacto:** Verificado en Chromium: Hero/navbar/menú móvil abren `#conocenos`; Escape, Volver y Atrás/Adelante regresan o avanzan; `#galeria` y `#estudio` cierran la vista; carga directa y F5 permanecen en la vista. `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm): ejecútalo localmente.

- **[2026-10-09 | v1.6.1] Por [Senior 3D WebGL Engineer & Frontend]:**
  - **Cambio:** `openStudio()` llama `engine.setStudioVisible(true)` y `closeStudio()` llama `setStudioVisible(false)` (NODE-005 v1.5.0): el bucle de Three.js corre solo con el estudio a la vista.
  - **Motivo:** `ShirtEngine` solo arrancaba el bucle si la carga inicial era `#estudio`; al entrar desde el landing no lo arrancaba nadie, y con el estudio cerrado no tiene sentido dibujar.
  - **Impacto:** Arranque y parada idempotentes (no cambian nada si el estado ya es el pedido). `appRouter.js` queda en 247 líneas (límite 300; cerca de 250: si crece, extraer el ciclo de vida del bucle). No se pudo ejecutar el router real con WebGL en este entorno; `npm run build` NO se pudo ejecutar: ejecútalo localmente.
