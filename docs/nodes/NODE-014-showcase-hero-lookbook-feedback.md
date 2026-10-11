# [NODE-014]: Showcase Hero, Lookbook & Retroalimentación
- **Tipo:** UI Showcase / Community
- **Estado:** Activo (v2.1.0)
- **Responsable:** Design / Frontend

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-002 (Config: `lookbook.js`), NODE-020 (sesión y `@alias`), NODE-024 (pedidos del usuario para el Buzón), NODE-026 (diseños públicos de la Bóveda), NODE-027 (reportes de contenido)
- **Nodos de Salida (Alimenta a):** NODE-013 (Router: botón "Personalizar Ahora", hash `#estudio` y vista `#galeria`), NODE-027 (galería completa y tarjetas con 🚩 Reportar), NODE-028 (vista `#conocenos`)
- **Contratos / Módulos expuestos:**
  - `src/ui/heroShowcase.js`: Visor 3D miniatura interactivo en el hero principal.
  - `src/ui/lookbook.js`: Carrusel de prendas prediseñadas por diseñadores.
  - `src/ui/lookbook.js` (144 líneas) + `src/ui/lookbookCard.js` (64): categoría **Comunidad** con los diseños públicos de la Bóveda (`communityItems()`), crédito `"<título> • por @alias"` (`creditTitle`), CTA "👕 Estampar en 3D", estado vacío y resincronización con los eventos `vault:changed` / `storage`. `src/styles/lookbookCommunity.css` (20).
  - `src/ui/feedbackForm.js` (183) controlador del Buzón + `feedbackView.js` (99, plantillas), `feedbackAttach.js` (72, captura opcional) y `src/services/feedbackInbox.js` (69, bandeja local `shirt_feedback_inbox` máx. 20 y mensaje de WhatsApp). `src/styles/feedbackExtras.css` (147) se suma a `feedback.css` (278, sin tocar).
  - `src/ui/authorDesignsModal.js`: Modal de colecciones y autores.

  - **Landing: últimos 4 + Galería completa (v1.8.0):**
    - `src/ui/lookbook.js` (72 líneas): muestra **únicamente los 4 diseños más recientes** (`latestDesigns(4)`) y, al pie, el CTA `Explorar Galería Completa (X diseños) →` (`a.btn-gallery-cta[href="#galeria"][data-action="open-gallery"]`, X = total de la biblioteca). Los filtros por categoría se mudaron a la vista `#galeria`; se conserva "✨ Subir a Biblioteca". Escucha `vault:changed`, `reports:changed` y `storage`.
    - `src/ui/designCatalog.js` (13): `allDesigns()`, `latestDesigns(n)`, `findDesign(id)`. Orden "más recientes primero": primero los públicos de la comunidad (por `createdAt` descendente) y luego los drops oficiales, que no tienen fecha y conservan el orden curado de `config/lookbook.js`.
    - `src/ui/lookbookActions.js` (47): `applyDesignToStudio(item)` (antes dentro de `lookbook.js`) y `bindCardActions(root, findItem)`: un solo listener delegado para 👕/🚀 Estampar, 🚩 Reportar y "Mostrar de todos modos"; lo comparten la landing y la galería.
    - `src/ui/lookbookCard.js` (83): cada tarjeta añade `.btn-report-design` y, si el diseño está reportado, `.is-reported` con velo `.card-reported-veil` y CTA desactivado. `communityItems()` incluye `createdAt`.
    - Estilos: `lookbookCommunity.css` (35; CTA y barra compacta) y `lookbookReport.css` (37; botón 🚩 y velo). Vista `#galeria`: ver NODE-027.

### 📦 Responsabilidad Técnica
Construir los componentes visuales de la página de inicio que exhiben las capacidades del producto, generan confianza social y canalizan a los usuarios hacia el taller 3D.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Design:**
  - **Cambio:** Incorporación al Context Graph.
  - **Motivo:** Evitar que los componentes de marketing de la landing queden desconectados del flujo del estudio 3D.
  - **Impacto:** Unifica la experiencia de marca en toda la plataforma.

- **[2026-10-06 | v1.1.0] Por UI/UX Designer:**
  - **Cambio:** Simplificación del hero showcase (`heroShowcase.js`, `hero.css`). Se removieron los selectores de material (Algodón/Poliéster) y gramaje (120/180/240g), dejando únicamente el conmutador de silueta `Hombre` / `Mujer`. Se actualizó la tipografía del titular a `Syne` de alto impacto editorial streetwear (`tokens.css`, `hero.css`).
  - **Motivo:** Reducir sobrecarga visual en la landing, unificar la configuración de tela exclusivamente al checkout y otorgar una presencia caligráfica más llamativa a la marca.
  - **Impacto:** Hero limpio, directo y enfocado en la comparación visual de siluetas Boxy vs Slim Fit.

- **[2026-10-07 | v1.2.0] Por [UI/UX Designer & Frontend]:**
  - **Cambio:** Rediseño estético completo del titular del Hero (`index.html`, `hero.css`, `tokens.css`): se eliminó la tipografía pesada en bloque y se incorporó caligrafía fluida de alto impacto (`Kaushan Script`) con gradiente luminoso (`.hero-title-calligraphy`) combinada con la fuente display refinada `Outfit`. Se actualizó el badge superior a `SILUETAS 3D • HOMBRE & MUJER` eliminando la referencia redundante a algodón/poliéster.
  - **Motivo:** La tipografía en bloque se sentía tosca y pesada ("súper fea") y el usuario solicitó caligrafía llamativa y presencia limpia de siluetas.
  - **Impacto:** Jerarquía visual moderna de alta costura streetwear y balance tipográfico impecable en ambos temas.

- **[2026-10-08 | v1.3.0] Por [UI/UX Designer & Frontend]:**
  - **Cambio:** Limpieza del Hero (`index.html`, `hero.css`) removiendo el pill badge de siluetas y la estadística de "+2.500 Prendas", consolidando la cuadrícula en 3 métricas clave (GSM, DTF Flex y Reseñas). Rediseño del Lookbook (`src/config/lookbook.js`, `src/ui/lookbook.js`, `src/styles/lookbook.css`) a 4 Drops de la comunidad con ilustraciones PNG transparentes de alta resolución (Bone Savage, Son Goku SSJ, Multiverse Rick & Morty, Cyber Oni Mask), eliminación de precios y especificaciones técnicas redundantes, e incorporación de la acción de subir diseños (Público / Privado) y prueba directa en el lienzo 3D.
  - **Motivo:** Simplificar el hero eliminando ruido, ofrecer 4 portadas estéticas urbanas listas para estampar en DTF y habilitar la biblioteca comunitaria de drops.
  - **Impacto:** Visualización limpia, carga instantánea de estampados transparentes en el modelo 3D y alineación con la paleta warm travertine marble.

- **[2026-10-08 | v1.4.0] Por [UI/UX Designer & Frontend]:**
  - **Cambio:** Incorporación de 8 nuevos drops ilustrados sin fondo (PNG RGBA transparente) y con 0 texto (sin letras en español ni inglés para total libertad tipográfica del usuario): Gentleman Wolf (sombrero de copa, aislado sin texto cómico), Shadow Mage 3D (ojos luminosos), Blood Sun Samurai, Kenshin Battōjutsu, Spider-Man Leap, Iron Man Arc Repulsor, Musashi Sumi-e Brush y Retro Spaceman Astronaut. Actualización del filtro de categorías en `src/ui/lookbook.js` con 'Fantasy'.
  - **Motivo:** Petición explícita del usuario de sumar ilustraciones llamativas sin fondo ni texto para permitir personalización de leyendas en el estudio.
  - **Impacto:** Catálogo de 12 drops temáticos de alta gama listos para probarse en 3D y estampar en DTF.

- **[2026-10-08 | v1.5.0] Por [UI/UX Designer & Frontend]:**
  - **Cambio:** Armonización cromática integral del Buzón de Sugerencias y Retroalimentación (`src/styles/feedback.css`), barra de navegación (`src/styles/navbar.css`) y cuerpo principal de la landing (`src/styles/landing.css`) en Modo Claro al tono cálido de mármol travertino alabastro (`#ede9e0` con bordes `#dcd7cc` e inputs `#faf8f5`).
  - **Motivo:** Eliminar la discrepancia cromática de fondos blancos fríos y azulados (`#f1f4f9`) reportada por el usuario en la sección inferior de sugerencias y la barra superior, asegurando continuidad con el mármol del resto del sitio.
  - **Impacto:** Fluidez visual homogénea, estética Cyber-Luxury / Streetwear de alta costura sin cortes de color abruptos.

- **[2026-10-08 | v1.6.0] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** Lookbook comunitario: los diseños que un usuario marca como 🌐 Público en su Bóveda aparecen en la categoría **Comunidad** de "Estilos & Drops" con el crédito `${título} • por @${authorAlias}`; al volver a 🔒 Privado o borrarlos desaparecen sin recargar. Cualquier visitante (con o sin sesión) puede pulsar **👕 Estampar en 3D** para cargar el arte en el frente de su prenda y abrir el estudio. "Subir a Biblioteca" abre la Bóveda (o el inicio de sesión si no hay sesión). `communityGallery.js` también acredita `@alias`. Todo texto de usuario pasa por `escapeHtml`.
  - **Motivo:** Requerimiento de usuario: Bóveda comunitaria con créditos de autor y pruebas en la propia camiseta.
  - **Impacto:** Verificado en Chromium: título con `• por @alias`, publicar/despublicar sincroniza en vivo, cambiar el alias actualiza los créditos, visitante sin sesión ve los públicos, XSS escapado, claro/oscuro y 390 px sin desborde. Limitación honesta: no hay backend; "público" significa visible dentro del mismo navegador/dispositivo. Lo que se comparte es la copia de trabajo (≤ 1024 px), no el máster de 300 DPI, que queda privado en el IndexedDB del autor. `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.

- **[2026-10-08 | v1.7.0] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** Buzón de Sugerencias: (1) con sesión autollena nombre, correo y muestra el `@alias` sin pisar lo que el usuario ya escribió (y retira lo autollenado al cerrar sesión); (2) selector opcional de pedidos propios `#ORD-XXXX · estado`; (3) adjunto visual opcional por arrastre o selección, comprimido con la rutina del comprobante de pago (JPEG ≤ 1280 px); (4) estrellas interactivas, validación en línea, micro-animación de éxito (check SVG con `stroke-dashoffset`, respeta `prefers-reduced-motion`) y botón **Enviar ahora por WhatsApp** con mensaje pre-armado (tipo, nombre, @alias, contacto, pedido, ★, mensaje, nombre de la captura). Botón primario y pestaña activa con degradado `#c2410c`→`#7c3aed` para contraste AA con texto blanco (≥ 5.18:1).
  - **Motivo:** Requerimiento de usuario: buzón con autollenado, historial de pedidos vinculado, captura opcional y derivación inmediata a WhatsApp.
  - **Impacto:** Sin backend: "Enviar al Equipo" guarda el mensaje en este navegador (`shirt_feedback_inbox`, máx. 20) y la pantalla de éxito lo dice; el canal que realmente llega al equipo es WhatsApp (+57 301 506 3187). WhatsApp no admite adjuntar imágenes por enlace, así que el mensaje avisa que la captura se envía aparte en el chat. Verificado en Chromium (autollenado, selector con 2 pedidos, adjunto, rechazo de archivos no imagen, validación, mensaje de WhatsApp, tope de 20, XSS, contraste claro/oscuro, 390 px). `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.

- **[2026-10-08 | v1.8.0] Por [Lead Architect, UI/UX Designer, Frontend WebGL & QA Auditor]:**
  - **Cambio:** La sección "Explora Estilos y Tendencias" de la landing muestra solo los **4 diseños más recientes** (drops oficiales + comunidad con crédito `@alias`) y cierra con el botón `Explorar Galería Completa (X diseños) →`, que abre la vista dedicada `#galeria` (NODE-013 / NODE-027). Se extrajo la lógica compartida de tarjetas (`designCatalog.js`, `lookbookActions.js`) y cada tarjeta incorpora 🚩 Reportar.
  - **Motivo:** Requerimiento de usuario: aligerar el scroll de la landing y ofrecer la biblioteca completa con buscador y filtros en su propia pantalla.
  - **Impacto:** Verificado en Chromium con 26 diseños (12 oficiales + 14 públicos de prueba): la landing pinta 4 tarjetas y el CTA dice "(26 diseños)"; claro/oscuro sin desbordes. Decisión de criterio: los drops oficiales no tienen fecha de subida, así que "más recientes" = comunidad por fecha y luego el orden curado de `config/lookbook.js`. Los filtros por categoría ya no están en la landing (viven en `#galeria`). `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm, por lo que no hay `node_modules`): ejecútalo localmente. En su lugar se verificó `node --check` de cada archivo tocado, la resolución de imports/exports y el comportamiento en Chromium (Playwright).

- **[2026-10-08 | v1.9.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Calibración milimétrica de visibilidad y contraste para el selector de color del Hero Showcase (`src/styles/hero.css`). El swatch blanco (`[data-key="white"]`) ahora cuenta con borde compuesto y sombra suave interior/exterior en ambos modos. La barra de swatches (`.showcase-color-bar`) en Modo Claro adoptó el tono de mármol travertino `#eae6dd` (idéntico al selector de género superior) con borde `#dcd7cc`, evitando que el botón blanco se pierda sobre fondos claros. En Modo Oscuro se reforzó el brillo periférico del blanco y el contorno del negro (`#121214`).
  - **Motivo:** Reporte visual del usuario: el círculo blanco resultaba invisible en la barra de selección en Modo Claro.
  - **Impacto:** Visibilidad perfecta de los 5 colores en ambos temas (Claro y Oscuro). `src/styles/hero.css` optimizado a 284 líneas respetando la Regla de las 300 Líneas. `npm run build` verificado con 0 errores (7.23s).

- **[2026-10-08 | v2.0.0] Por [Orchestrator, UI/UX Designer & Frontend 3D]:**
  - **Cambio:** (1) Integración del nuevo logo oficial de marca IMPRNT [LAB] (`public/assets/new_brand_logo.png`): procesado con croma key suave sin halo verde y configurado como el estampado predeterminado que aparece al entrar al estudio 3D (`DECAL_PRESETS[0]`, `src/main.js`, `heroShowcase.js` y topbar). (2) Creación de la sección "Conócenos" (`src/ui/aboutSection.js` y `src/styles/aboutSection.css`): tarjeta de identidad, misión, visión y declaración de cumplimiento de derechos de autor con licencia comercial de Midjourney (Midjourney Paid Terms) para la silueta femenina. (3) Soporte / Buzón de retroalimentación: eliminada la derivación a WhatsApp; ahora los mensajes se envían y almacenan directamente en el sistema (`shirt_feedback_inbox`) para ser gestionados por el futuro panel de administración.
  - **Motivo:** Requerimiento del usuario para institucionalizar la marca IMPRNT [LAB], dar transparencia legal sobre el modelo femenino de Midjourney y preparar el buzón para el panel administrativo.
  - **Impacto:** Cero errores en `npm run build` (211 módulos en 8.89s). Cumplimiento estricto de la Regla de las 300 Líneas en todos los módulos creados y modificados.

- **[2026-10-08 | v2.1.0] Por [Orchestrator, UI/UX Designer & Frontend 3D Engineer]:**
  - **Cambio:** (1) Rebranding a **IMPRNT [LAB]** en `index.html`: logo `/assets/new_brand_logo.png` (`width="24" height="24"`) en la navbar y en el topbar del Estudio, texto de marca `IMPRNT [LAB]` con badge `3D`/`ATELIER 3D`, `<title>` "IMPRNT [LAB] • Atelier 3D de Moda Streetwear & Personalización" y pie de página; la barra de la galería (`communityGalleryView.js`) también dice IMPRNT [LAB]. (2) "Conócenos" sale del landing: se retira `#about-mount` de `index.html` y `initAboutSection` de `main.js`; el Hero suma el botón terciario `.btn-hero-tertiary` (`🏛️ Quiénes Somos`) y la navbar y el menú móvil el enlace "Quiénes Somos", todos hacia la vista `#conocenos` (NODE-028). `aboutSection.js` y `aboutSection.css` quedan sin uso.
  - **Motivo:** `/assets/logo.svg` solo envolvía el PNG con `<image href>` y un SVG cargado con `<img>` no puede cargar recursos externos, por eso el logo no se veía; además el cliente quería el landing limpio y la marca unificada.
  - **Impacto:** En Chromium el logo carga en la navbar y el Estudio (1089 px naturales) y los textos de marca cambiaron. Siguen mencionando "Shirt Studio" a propósito los textos legales (`legalTerms.js`), el mensaje de WhatsApp, el preset `Shirt Studio 3D Official`, el alt de `heroShowcase.js` y las páginas `studio.html`, `auth-preview.html`, `bg-remover.html` y `photoshop-lab.html` (estas cuatro siguen usando `logo.svg`). `index.html` queda en 293 líneas (límite 300). `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm): ejecútalo localmente.
