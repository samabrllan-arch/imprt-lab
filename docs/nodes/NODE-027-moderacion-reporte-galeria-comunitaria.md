# [NODE-027]: Moderación, Reporte de Contenido & Galería Comunitaria
- **Tipo:** UI Component / Moderation / Community
- **Estado:** Activo (v1.1.0)
- **Responsable:** Lead Architect, UI/UX Designer, Frontend WebGL & QA Auditor

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-013 (enrutador: ruta `#galeria`), NODE-014 (`lookbookCard.js`, `config/lookbook.js`), NODE-026 (diseños públicos de la Bóveda, `vault:changed`), NODE-009 (decal activo al "Estampar en 3D"), NODE-003 (`PRICING_CONFIG.supportPhone` para WhatsApp), NODE-015 (tokens visuales claro/oscuro), NODE-020 (alias `@usuario`)
- **Nodos de Salida (Alimenta a):** NODE-014 (Lookbook de la landing y tarjetas), NODE-026 (la pestaña "Comunidad" oculta lo reportado), NODE-013 (vista `#galeria`)
- **Contratos / Módulos expuestos:**
  - `src/services/reportService.js` (113 líneas): `REPORTS_KEY` (`shirt_reported_content`), `REPORT_CATEGORIES` (`illicit` 🚫 tolerancia cero, `copyright` ⚖️, `hate` 🛑, `violence` ⚠️, `other` 📝), `validateReport`, `addReport`, `getReports`, `getReport`, `isHidden`, `canReveal`, `revealReported`, `displayDesignId`, `buildReportWhatsAppUrl`. Lectura memoizada por el JSON crudo; máximo 200 reportes. Emite `reports:changed`.
  - `src/ui/reportModal.js` (136 líneas): `openReportModal(item, { onDone })`; overlay `#report-content-modal` con radios de categoría, textarea (obligatoria en "Otro", mínimo 10 y máximo 500 caracteres), foco atrapado, ESC y botón opcional de escalamiento a WhatsApp.
  - `src/ui/designCatalog.js` (13 líneas): `allDesigns()` (comunitarios por `createdAt` descendente y luego el orden curado de `config/lookbook.js`), `latestDesigns(n)`, `findDesign(id)`, `LANDING_LATEST = 4`.
  - `src/ui/lookbookActions.js` (47 líneas): `applyDesignToStudio(item)` y `bindCardActions(root, findItem)` (👕 Estampar en 3D y 🚩 Reportar, por delegación de eventos).
  - `src/ui/communityGalleryView.js` (165 líneas): `buildCategories`, `filterDesigns(items, { q, cat, sort })` e `initCommunityGalleryView(mount, router)` → `{ open, close }`. Búsqueda con debounce, filtros por categoría/estilo, orden y paginación por bloques de 12 (estado `state.page`; buscar, filtrar u ordenar vuelve a la página 1; `vault:changed`/`reports:changed` conservan la página actual).
  - `src/ui/galleryPagination.js` (54 líneas, lógica pura): `PAGE_SIZE` (12), `pageCount`, `clampPage`, `pageRange`, `sliceFor`, `pageItems` (con elipsis a partir de 8 páginas) y `renderPagination(page, total)` (`← Anterior`, números con `.active`/`aria-current="page"`, `Siguiente →` y `Mostrando registros 1–12 de 26 diseños`). La barra `#gallery-pagination` se oculta con ≤ 12 resultados o sin resultados.
  - `src/ui/appRouterGallery.js` (46 líneas): `openGallery(router, pushHash)` y `closeGallery(router, updateHash)`; la vista ocupa la pantalla completa como `#estudio` y `#login`.
  - Estilos: `reportModal.css` (56), `lookbookReport.css` (37) y `communityGalleryView.css` (87; enlazado también en el `<head>` de `index.html`).
  - Eventos: `reports:changed` (nuevo reporte o "Mostrar de todos modos"), `vault:changed` y `storage` (sincronizan pestañas).
- **Esquema de reporte (`localStorage['shirt_reported_content']`):**
  ```json
  [{
    "designId": "vault-VLT-AB12 | id oficial", "title": "Nombre del diseño", "authorAlias": "alias",
    "category": "illicit | copyright | hate | violence | other", "details": "texto libre (≤ 500)",
    "reporterId": "id de la cuenta o vacío", "createdAt": "ISO-8601"
  }]
  ```

### 📦 Responsabilidad Técnica
**Reportes.** Cada tarjeta pública (oficial o comunitaria) tiene `🚩 Reportar`. El modal guarda el reporte y **oculta preventivamente** la imagen (velo con aviso) en la landing, la galería y la pestaña "Comunidad" de la vitrina de autor. Los motivos de **tolerancia cero** (`illicit`) nunca se pueden volver a mostrar; los demás permiten "Mostrar de todos modos" solo durante la visita (`Set` en memoria). Escalamiento opcional por WhatsApp con la plantilla `🚩 REPORTE URGENTE: Diseño #[ID] por @[Alias] - Motivo: [Categoría]`.

**Lookbook y galería.** La landing muestra solo los últimos 4 diseños y el CTA `Explorar Galería Completa (X diseños) →`. La ruta `#galeria` abre la galería completa con búsqueda, filtros, orden y paginación por bloques de 12 (cada página reemplaza a la anterior, sin acumular tarjetas; al cambiar de página se sube al inicio con scroll suave; animaciones solo con `transform`/`opacity`, `content-visibility: auto`, sin `backdrop-filter` en la barra fija) para sostener 60 FPS en modo claro y oscuro.

**Seguridad.** Todo texto de usuario pasa por `escapeHtml`; los toasts usan `innerHTML`, por lo que nunca reciben texto de usuario.

### ⚠️ Limitaciones conocidas (decisiones de diseño)
- **Moderación local:** sin backend, el reporte solo oculta el diseño en el navegador del reportante; no lo retira para los demás. La escalación por WhatsApp es la vía para que el equipo actúe. Con backend, el reporte debe viajar al servidor y la revisión humana decidir el retiro.
- **"Últimos 4":** los drops oficiales no tienen fecha; se ordenan primero los comunitarios por `createdAt` y luego el orden curado de `config/lookbook.js`.
- **Los reportes son editables por el usuario** (`localStorage`); no son una prueba forense.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-08 | v1.0.0] Por [Lead Architect, UI/UX Designer, Frontend WebGL & QA Auditor]:**
  - **Cambio:** Creación del nodo: servicio y modal de reportes, botón `🚩 Reportar` en todas las tarjetas, ocultamiento preventivo, Lookbook de la landing limitado a 4 con CTA, vista `#galeria` (búsqueda, filtros, orden, paginación con `IntersectionObserver`) con `👕 Estampar en 3D` y `🚩 Reportar`, e integración con `appRouter.js` (vía `appRouterGallery.js`), `main.js` e `index.html` (`#gallery-view` y script de cabecera para la ruta).
  - **Motivo:** Requerimiento de usuario: moderación de contenido comunitario (tolerancia cero para material ilícito) y una galería completa sin saturar la landing.
  - **Impacto:** Nueva llave `shirt_reported_content` y evento `reports:changed`; `communityGallery.js` (NODE-026) y `lookbook*.js` (NODE-014) filtran lo reportado; `appRouter.js` (NODE-013 v1.5.0) gestiona `#galeria`. Verificado en Chromium (Playwright): reporte por categoría, validación de "Otro", velo y revelado (bloqueado en tolerancia cero), URL de WhatsApp, filtros, búsqueda, paginación, ruta `#galeria` con Atrás/Adelante, claro/oscuro, móvil 390 px y escritorio 1280×720. `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm, sin `node_modules`): ejecútalo localmente. Se verificó `node --check`, la resolución de imports/exports y el límite de líneas (todos los archivos < 250).

- **[2026-10-08 | v1.1.0] Por [Senior Frontend 3D & UI/UX Engineer]:**
  - **Cambio:** (A) `index.html` enlaza `src/styles/communityGalleryView.css` en el `<head>` (junto a `authFullscreen.css`), de modo que `html.route-gallery #landing-view { display: none !important }` y `html.route-gallery #gallery-view { display: flex !important }` existen en el CSS bloqueante del primer pintado. (B) El scroll infinito (`IntersectionObserver`, `appendPage`, centinela) se reemplaza por paginación en bloques de 12: nuevo `galleryPagination.js`, barra `#gallery-pagination` al pie de la cuadrícula y estilos Cyber-Luxury (píldoras, página activa con `var(--primary)`, estados hover/disabled, modo claro y móvil). Se elimina el `import` dinámico del CSS en `communityGalleryView.js`.
  - **Motivo:** Al recargar con F5 en `#galeria` se veía el landing hasta que `main.js` ejecutaba `checkInitialRoute()` (el CSS de la ruta solo llegaba con el JS), y el scroll acumulativo amontonaba las tarjetas.
  - **Impacto:** Verificado en Chromium con `main.js` bloqueado (primer pintado sin JS): antes `#landing-view` = `block` y `#gallery-view` = `none`; ahora `none` y `flex`; `#estudio` no cambia. Paginación con 26 diseños: 1–12, 13–24 y 25–26 (2 tarjetas), `Anterior` deshabilitado en la 1 y `Siguiente` en la última, `scrollTop = 0` al cambiar de página, búsqueda/filtro/orden vuelven a la página 1, ≤ 12 resultados oculta la barra y 0 resultados muestra `#gallery-empty`; claro/oscuro y móvil 390 px sin desborde horizontal. Pendiente: la barra no se refleja en la URL (recargar vuelve a la página 1). `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm): ejecútalo localmente.
