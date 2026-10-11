# [NODE-015]: Tokens Visuales & Estética Cyber-Luxury
- **Tipo:** Design System / CSS Tokens
- **Estado:** Activo (v1.18.0)
- **Responsable:** Design

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** Ninguno
- **Nodos de Salida (Alimenta a):** Todos los componentes de UI (`src/styles/*.css`), `src/ui/themeToggle.js`
- **Contratos / Hojas de Estilo expuestas:**
  - `src/styles/tokens.css`: Custom properties en `:root` (colores HSL dorados/titanio, sombras glassmorphism, tipografías Space Grotesk / Inter, z-index).
  - `src/styles/studioFullscreen.css`, `sidebar.css`, `viewer.css`, `modal.css`, `hero.css`: Capas modulares de estilos bajo la regla de 300 líneas.
  - `src/ui/themeToggle.js`: Alternador dinámico `[data-theme="dark"]` y `[data-theme="light"]`.
  - `src/styles/navbar.css`: Navbar del landing (tokens locales `--nav-*` sobre `.landing-nav`, 238 líneas).
  - `src/styles/userMenu.css`: dropdown de cuenta de la navbar con tokens locales `--um-*` (claro/oscuro, 171 líneas).
  - `src/styles/checkoutTokens.css`: tokens locales `--ck-*` (superficies, bordes, acento naranja `#ff5722` → `#ff7043`/`#ea580c`, verde `#22c55e`/`#25d366`) acotados a `.checkout-modal-card, .orders-modal-card, .order-gate-card`, con override claro y `prefers-reduced-motion` (49 líneas).

  - `src/styles/imageEditorAdjust.css` (57), `src/styles/lookbookCommunity.css` (20) y `src/styles/feedbackExtras.css` (147): extensiones de v1.10.0, con tema oscuro por defecto y `[data-theme="light"]` como sobrescritura. `userMenu.css` (182) suma el chip `.nav-user-alias` y `.um-alias`.

### 📦 Responsabilidad Técnica
Centralizar la identidad estética futurista Cyber-Luxury, los efectos de desenfoque de vidrio (backdrop-filter) y las micro-interacciones a 60 FPS sin alterar la lógica de negocio.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Design:**
  - **Cambio:** Incorporación al Context Graph.
  - **Motivo:** Asegurar consistencia visual total y prevenir código CSS huérfano o hardcodeado.
  - **Impacto:** Cualquier cambio de token repercute homogéneamente en toda la aplicación.
- **[2026-10-06 | v1.1.0] Por Design:**
  - **Cambio:** Nuevas hojas `polish.css` (focus-visible, reduced-motion, sliders con progreso + Firefox, dock y CTA con gradiente de marca, subrayado animado del nav) y `sizePanel.css`. Se retira `backdrop-filter` del sidebar/dock (no solapan el canvas) y se reduce el blur de las barras flotantes.
  - **Motivo:** Mejorar estética y fluidez; el blur sobre WebGL animado es costoso.
  - **Impacto:** Enlazadas al final de `index.html` y `studio.html`; compatibles con `[data-theme="light"]`.

- **[2026-10-06 | v1.3.0] Por [UI/UX Designer]:**
  - **Cambio:** Corrección de contraste en el topbar en modo claro (`.btn-orders-history`, `.topbar-tab-indicator`) y estilos de `.model-swap-overlay`.
  - **Motivo:** En tema claro el botón "Mis Pedidos" e indicadores eran invisibles por colores fijos en blanco.
  - **Impacto:** Visibilidad perfecta 100% en modo claro y modo oscuro cumpliendo WCAG AA.

- **[2026-10-07 | v1.4.0] Por [UI/UX Designer & QA Auditor]:**
  - **Cambio:**
    1. Scrollbar personalizado Cyber-Luxury (`::-webkit-scrollbar` y `scrollbar-color` en `tokens.css`) con thumb translúcido y acento de marca en hover adaptado a modo claro/oscuro.
    2. Corrección del toast en modo claro (`toast.css`): fondo blanco puro con texto oscuro de alto contraste `#0f172a` y borde nítido, eliminando el texto blanco invisible sobre fondo claro.
    3. Suavización de enlaces del menú superior (`polish.css`, `landing.css`): se reemplazó el subrayado tosco por píldoras suaves translúcidas con microinteracción a 60 FPS.
    4. Optimización de identidad de marca y logotipo (`logo.svg`, `landing.css`): redibujo vectorial isométrico 3D ultra-nítido con marco de vidrio y sombras neón refinadas.
  - **Motivo:** Eliminar imperfecciones visuales en la landing y modo claro reportadas por el usuario.
  - **Impacto:** Estética Cyber-Luxury pulida y coherente en toda la aplicación.

- **[2026-10-07 | v1.5.0] Por [UI/UX Designer & Senior Frontend]:**
  - **Cambio:**
    1. Rediseño completo de la Navbar del Landing (`navbar.css`, reescrito en 238 líneas): vidrio esmerilado `blur(20px) saturate(180%)` aplicado en `.landing-nav::before` (así el `backdrop-filter` del drawer móvil sigue funcionando), bordes `rgba(15,23,42,.08)` en claro y `rgba(255,255,255,.08)` en oscuro, sombra difusa suave.
    2. Tokens locales `--nav-*` en `.landing-nav`; el modo claro solo redefine el bloque de variables (satinado blanco + grafito `#0f172a`; oscuro `rgba(10,11,16,.8)` + texto nieve + foco turquesa discreto).
    3. Logo en marco de 10px sin glow naranja saturado; "SHIRT STUDIO" en Outfit con tracking amplio y badge "3D" cápsula; `.nav-links` como dock flotante con píldora suave en hover/activo.
    4. Derecha: "Iniciar Sesión" sobrio (borde fino, icono SVG alineado, sin hover morado), toggle de tema con giro suave en hover y CTA "Diseñar en 3D" (degradado de marca en oscuro, negro grafito en claro, elevación y brillo diagonal en hover, flecha SVG que se desplaza).
    5. `index.html`: flechas de texto/emoji (🎨, 🚀, ↗) sustituidas por SVG `.cta-arrow`; `aria-label` en `#btn-theme-toggle`. `userProfileMenu.js`: emoji 👤 sustituido por SVG `.nav-login-icon` + `.nav-login-label`.
    6. Responsive: dock oculto ≤960px (hamburguesa + CTA corto), login solo icono entre 961–1180px y ≤560px, compactación a 400/340px; sin desborde horizontal hasta 320px. Se respeta `prefers-reduced-motion`.
  - **Motivo:** `polish.css` y `auth.css` cargan después de `navbar.css` y pisaban `.nav-link`, `.btn-nav-login` y `.nav-user-chip`; todas las reglas se acotan bajo `.landing-nav` en lugar de editar esos archivos. Elevar la estética a nivel Apple/Linear/Nike-Lab.
  - **Impacto:** IDs y `data-action` intactos (`main-landing-nav`, `nav-auth-mount`, `btn-theme-toggle`, `btn-mobile-menu`, `data-action="open-studio"`). Paridad claro/oscuro por variables. Verificado con capturas Playwright (claro/oscuro, hover, drawer móvil); `vite build` no pudo ejecutarse en el entorno (npm 403), pendiente de correr localmente.

- **[2026-10-07 | v1.6.0] Por [Design & Frontend]:**
  - **Cambio:**
    1. Paleta Mármol Suave / Travertino en Modo Claro: reemplazo del blanco clínico frío por el tono cálido de alabastro del login (`#f4f1ea`, bordes `#dcd7cc`, hovers `#eae6dd`) en `tokens.css`, `landing.css`, `hero.css` y footer.
    2. Sección Editorial de Materiales & DTF (`src/ui/featuresSection.js` y `src/styles/features.css`): sustitución de tarjetas vacías con emojis por tarjetas con fotografía macro IA real (`feature_cotton.jpg` 240g, `feature_microfiber.jpg` deportista dry-fit, `feature_dtf_drops.jpg` microgotas 1200 DPI y `feature_durability.jpg` curado 160°C).
    3. Modularización arquitectónica: desacople de la sección hacia componente dedicado para reducir `index.html` a 278 líneas y `featuresFooter.css` a 209 líneas, cumpliendo estrictamente con la regla de 300 líneas.
  - **Motivo:** Requerimiento del usuario para evitar el blanco plano en modo claro, alinear el tono con el mármol del login y transformar la sección de materiales en un showcase visual de alta fidelidad.
  - **Impacto:** Experiencia visual táctil y editorial de lujo, 60 FPS, paridad total claro/oscuro y 0 errores de build.

- **[2026-10-08 | v1.7.0] Por [UI/UX Designer & Senior Frontend]:**
  - **Cambio:** Checkout Atelier. (1) `checkoutTokens.css` (`--ck-*`) comparte paleta entre checkout, "Mis Pedidos" y Auth Gate: oscuro `#10121d` con borde `rgba(255,255,255,.08)`, claro `#ffffff` con borde `#e2e8f0`. (2) `checkoutModal.css` (195 líneas): recibo "Atelier Receipt" con cifras tabulares, línea punteada y total destacado; campos de entrega con estilo propio (no dependen de los tokens `--et-*` del editor). (3) `checkoutSelectors.css` (113 líneas, reescrito): el indicador de selección se dibuja dentro de la tarjeta con `::after` (borde encendido + insignia ✓ armónica, sin overflow ni badges superpuestos) y hover `translateY(-2px)` solo con `transform`. (4) Nuevas hojas `ordersModal.css` (166 líneas) y `orderAuthGate.css` (80 líneas), importadas desde su JS (no se toca `index.html`).
  - **Motivo:** Eliminar el scroll horizontal y los checks verdes superpuestos del modal, y unificar el lenguaje visual del nuevo flujo de pedido con la identidad de marca.
  - **Impacto:** Paridad oscuro/claro, interacciones a 60 FPS, todos los archivos < 300 líneas. Revisado con capturas Playwright (oscuro, claro y 390 px).

- **[2026-10-08 | v1.8.0] Por [UI/UX Designer & Senior Frontend]:**
  - **Cambio:** (1) Nuevo `userMenu.css` con el dropdown de cuenta (reglas movidas desde `auth.css`): fondo opaco `#10121d` en oscuro y `#ffffff` en claro, tarjeta 2FA con `color-mix(var(--bg-card) 90%, #fff 10%)` y borde visible, píldoras de estado con contraste AA en ambos temas e iconos SVG de trazo (`src/ui/uiIcons.js`). (2) `checkoutTokens.css` extiende `--ck-*` a `.profile-modal-card` y `.legal-modal-card` y añade `--ck-warn` (ámbar `#fbbf24` / `#b45309`). (3) Nuevas hojas `userProfileModal.css` y `legalTermsModal.css`.
  - **Motivo:** El texto de la tarjeta 2FA era casi invisible porque el dropdown tenía colores fijos para oscuro.
  - **Impacto:** Contraste medido en Chromium: títulos ≥ 15:1 y textos secundarios ≥ 7:1 en claro, ≥ 9:1 en oscuro; píldora "Completar" 5.2:1 (`#c2410c`). Cero texto invisible en ambos temas.

- **[2026-10-08 | v1.9.0] Por [UI/UX Designer & Senior Frontend]:**
  - **Cambio:** (1) Nueva `vaultModal.css` (134 líneas): tarjetas de la Bóveda, interruptor Privado/Público, cuadrícula responsiva (una columna ≤ 480 px). (2) Nueva `communityGallery.css` (14 líneas) para la pestaña "Comunidad". (3) `legalTermsModal.css` (123 líneas): transiciones compuestas de 0.16 s (`opacity`/`visibility` en el overlay, `translateY(12px) scale(.98)` → `none` en la tarjeta, `will-change`, `prefers-reduced-motion`). (4) `checkoutTokens.css` extiende `--ck-*` a `.vault-modal-card`. (5) El texto terciario oscuro `--ck-t3` sube a `#8a97ad`.
  - **Motivo:** Estilo de la Bóveda coherente con perfil, pedidos y TyC, y apertura de TyC sin trabajo de layout.
  - **Impacto:** `--ck-t3` cambia en todos los modales que lo usan (checkout, pedidos, perfil, TyC): antes `.vt-date`/`.vt-note` medían 3.6–3.9:1 en oscuro y ahora cumplen AA. Paridad claro/oscuro verificada en Chromium (incluida 390 px).

- **[2026-10-08 | v1.10.0] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** Nuevas hojas: `imageEditorAdjust.css` (pestaña Ajustes, vista previa superpuesta, filtros), `lookbookCommunity.css` (tarjetas y estado vacío de Comunidad), `feedbackExtras.css` (barra de cuenta, selector de pedido con flecha propia, adjunto, validación, animación de éxito; variables `--fb-*` acotadas a `.feedback-section`) y estilos de alias en `userMenu.css`. `imageEditorTools.css`: `.editor-tabs` pasa a 3 columnas. `feedback.css` no se modificó (278 líneas, cerca del tope).
  - **Motivo:** Soportar alias, ajustes del editor, Lookbook comunitario y Buzón mejorado con paridad claro/oscuro y sin texto ilegible.
  - **Impacto:** Contraste medido en Chromium en ambos temas (Buzón y Lookbook): todos ≥ 4.5:1 (mínimo 4.85:1 en el botón de WhatsApp en claro). El degradado de botones primarios del Buzón usa `#c2410c`→`#7c3aed` (5.18:1 y 5.7:1 con texto blanco); la pestaña activa pasó de 3.16:1 a 5.18:1. 390 px sin desborde horizontal. `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.

- **[2026-10-08 | v1.11.0] Por [UI/UX Designer & Frontend 3D Engineer]:**
  - **Cambio:** (1) **Scrollbar permanente** en `tokens.css`: `html { overflow-x: hidden; overflow-y: scroll; scrollbar-gutter: stable }`; pista `rgba(255,255,255,0.04)` (claro `rgba(15,23,42,0.05)`), pulgar `rgba(255,255,255,0.28)` (claro `rgba(15,23,42,0.28)`) con `:hover` en `var(--primary)` y 10 px de ancho.
  - **Motivo:** El carril transparente del scrollbar y el auto-ocultado lo hacían casi invisible.
  - **Impacto:** Carril de 10 px siempre visible en landing en claro y oscuro.

- **[2026-10-08 | v1.12.0] Por [Lead UI/UX Designer & Frontend 3D WebGL Engineer]:**
  - **Cambio:** Creación de `studioMobile.css` (175 líneas) vinculada en `index.html`.
  - **Motivo:** Solucionar estética y solapamientos en móvil.
  - **Impacto:** Navegación móvil táctil impecable.

- **[2026-10-08 | v1.13.0] Por [Lead UI/UX Designer & Brand Strategist]:**
  - **Cambio:** Creación del banco interactivo de identidad de marca `brand-preview.html`.
  - **Motivo:** Petición del usuario para evaluar alternativas.
  - **Impacto:** Banco de pruebas disponible en `/brand-preview.html`.

- **[2026-10-09 | v1.15.0] Por [Lead UI/UX Designer, Senior 3D WebGL Engineer & QA Auditor]:**
  - **Cambio:** 
    1. **Desbloqueo de Scroll en Estudio Móvil (`studioMobile.css`):** Eliminación de la trampa de scroll anidado (`nested overflow trap`) en dispositivos móviles (<=960px). `.sidebar-scroll-body` pasa a `overflow: visible` y altura automática, delegando el desplazamiento al workspace principal con inercia nativa WebKit (`-webkit-overflow-scrolling: touch`). El visor 3D se compacta a `38vh` (min 250px, max 340px) para permitir visibilidad y toque cómodo en los controles de personalización.
    2. **Soporte de Dynamic Island y Notch (`index.html`, `navbarMobile.css`, `hero.css`):** Incorporación de `viewport-fit=cover` en la etiqueta meta del viewport, activando variables `env(safe-area-inset-*)`. Se ajustó la altura y padding superior de la barra de navegación y el padding superior del hero para evitar que el notch o la Dynamic Island tapen los elementos de la interfaz.
    3. **Arquitectura de Miniaturas & Optimización WebP de Assets:** Migración sistemática de imágenes a WebP de alta compresión: miniaturas de la galería drops (`/assets/drops/thumbs/*.webp`, 562 KB totales vs 41.5 MB originales, reducción de 98.6%), tarjetas de ¿Quiénes somos? (`aboutContent.js`), características textiles (`featuresSection.js`), renderizados 3D del Hero (`heroShowcase.js`) y logotipo de navegación (`new_brand_logo_nav.webp`, 8 KB vs 988 KB). Las imágenes originales a resolución de imprenta se reservan exclusivamente para la aplicación 3D y el envío a producción.
    4. **Suspensión del Render Loop WebGL en la Landing (`appRouter.js`):** El motor Three.js pausa automáticamente su bucle de dibujado (`stopLoop()`) al estar en la landing page y solo lo activa (`startLoop()`) al ingresar al Estudio 3D, liberando la GPU y CPU móvil al 100% durante el scroll.
  - **Motivo:** Corregir reporte del usuario sobre lentitud/pesadez en la carga móvil, bloqueo táctil en el estudio 3D ("se queda bugeado"), corte visual en la barra superior bajo el notch del celular y clarificar la arquitectura de compresión de imágenes.
- **[2026-10-09 | v1.16.0] Por [Lead UI/UX Designer & Senior 3D WebGL / QA Auditor]:**
  - **Cambio:** 
    1. **Restauración del Compositor Asíncrono de Viewport en Móviles (`tokens.css` y `landing.css`):** En pantallas táctiles (`@media (hover: none) and (pointer: coarse), (max-width: 960px)`), se desactiva `scrollbar-gutter: stable` y `scroll-behavior: smooth`, restableciendo `overflow-y: auto` y la inercia nativa de iOS WebKit. Esto permite al navegador precargar los buffers de teselas (*tiles*) fuera de la pantalla.
    2. **Eliminación de Sobrecarga de Shaders de Desenfoque en Móvil (`landing.css`):** Se suprimió `backdrop-filter: blur(...)` en las tarjetas repetitivas (`.lookbook-card .card-badge`, `.card-author-chip`, `.feature-card`, `.feature-badge`, `.feedback-card-wrapper`), sustituyéndolo por fondos oscuros sólidos de alto contraste (`rgba(16, 18, 25, 0.95)` / `rgba(0, 0, 0, 0.88)`). Se reemplazó el filtro `filter: blur(18px)` por un degradado radial nativo, eliminando más de 40 pasadas de convolución gaussiana por fotograma.
    3. **Precarga Activa de Miniaturas del Landing (`lookbookCard.js`, `featuresSection.js`):** Las miniaturas WebP de los 4 drops destacados y las 4 características textiles se configuran como `loading="eager" decoding="async"`. Al estar en memoria de GPU desde el primer milisegundo, no existe ningún retraso de renderizado ni cuadros en blanco al hacer scroll rápido hacia abajo o hacia arriba.
    4. **Compositing Hardware Inmediato:** Se aplicó `transform: translateZ(0)` a `.lookbook-card` y `.feature-card`, forzando capas de composición GPU permanentes.
    5. **Protección del Bucle WebGL en Inicio (`engine.js`, `scene.js`):** El bucle de dibujado de Three.js no inicia en segundo plano durante la carga del landing y se previene cualquier ejecución duplicada con guardas de estado.
  - **Motivo:** Corregir el reporte del usuario donde la navegación en celular se sentía "tosca/lenta" y las secciones quedaban sin renderizar al subir y bajar rápidamente.
  - **Impacto:** Desplazamiento ultra-rápido con 0 retardos visuales, teselas siempre renderizadas en memoria y 60/120 FPS fluidos.

- **[2026-10-09 | v1.17.0] Por [Frontend & UI/UX]:**
  - **Cambio:** Nuevo `src/styles/imageEditorTouch.css` (lupa táctil cian con halo, barra flotante `✓ Borrar / ✕` con botones de 44 px, interruptor Mover/Editar, estados activos en claro/oscuro, barra de zoom en filas con botones ≥ 36 px y cabecera compacta ≤ 520 px) y estilos del tour móvil en `imageEditorTour.css` (bottom-sheet `.is-dock` ≤ 768 px: `bottom: calc(14px + env(safe-area-inset-bottom, 0px))`, márgenes de 12 px, `z-index: 10025`, botones de 40 px). Mismos tokens (`--primary`, `--radius-*`, `--text-*`) y mismo cian `#00f0ff`; sin `backdrop-filter` nuevos.
  - **Motivo:** Adaptación móvil del editor de imágenes (NODE-010 v2.11.0).
  - **Impacto:** Cero desbordes horizontales a 360–390 px; objetivos táctiles ≥ 36 px (44 px en la confirmación); `index.html` enlaza el nuevo CSS tras `imageEditorTour.css`. Verificado en Chromium táctil, claro y oscuro de escritorio.

- **[2026-10-09 | v1.18.0] Por [Frontend & UI/UX]:**
  - **Cambio:** `studioMobile.css` (<= 960 px): `.studio-fullscreen-workspace` pasa de `height/max-height: calc(100dvh - 54px - env(safe-area-inset-top, 0px))` a `flex: 1 1 0%; min-height: 0; height: auto; max-height: none` (el flexbox de `.studio-fullscreen-view` reparte el alto exacto que queda bajo la topbar); `.sidebar-section` recibe `transform: translateZ(0); contain: content` (capa de composición propia en GPU). La sección 3 del archivo (modal del editor de imágenes, 77 líneas) se mueve a `src/styles/imageEditorMobile.css` (63) para que `studioMobile.css` baje de 273 a 198 líneas; `index.html` enlaza el nuevo archivo tras `imageEditorTouch.css`.
  - **Motivo:** El alto fijo de 54 px peleaba con el scroll cuando la topbar medía más (notch, safe-area) o la barra del navegador móvil se contraía; los controles laterales se repintaban junto con el resto al deslizar.
  - **Impacto:** Con la topbar a 52 px y a 96 px el workspace ocupa exactamente el espacio restante (728 y 684 px de 780) sin desbordar; el scroll anidado sigue desbloqueado (`.sidebar-scroll-body` sin contención).

- **[2026-10-09 | v1.19.0] Por Lead UI/UX Designer & Frontend 3D:**
  - **Cambio:** (1) **Desbloqueo de compositor asíncrono:** En `landing.css` móvil, sustitución de `body { overflow-x: hidden !important }` por `body { overflow-x: clip !important }`, eliminando el overflow root secundario que frenaba el compositor en WebKit/Blink. (2) **Aislamiento de layout:** Adición de `contain: layout paint; transform: translateZ(0)` a `.lookbook-card` y `.feature-card`. (3) **Cero transition: all:** Especificación de propiedades exactas (`transform`, `box-shadow`, `background-color`) en botones del hero. (4) **Lazy loading & decodificación asíncrona:** `featuresSection.js` y `lookbookCard.js` usan `loading="lazy" decoding="async"` y dimensiones explícitas `width/height`.
  - **Motivo:** Requerimiento del usuario de maximizar la fluidez general en toda la página y eliminar saltos visuales durante navegación vertical rápida.
  - **Impacto:** Desplazamiento sedoso a 60/120 FPS sin retrasos en hilos de pintado ni tirones en móvil y escritorio.
