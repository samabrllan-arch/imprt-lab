# [NODE-028]: Vista Fullscreen "Conócenos" (#conocenos)
- **Tipo:** UI Component / View / Content
- **Estado:** Activo (v1.1.0)
- **Responsable:** Orchestrator, Frontend 3D Engineer, UI/UX Designer & QA Auditor

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-013 (enrutador: hash `#conocenos`/`#nosotros`, Escape, `data-action="open-about"`), NODE-015 (tokens, `[data-theme]` y `themeToggle.js`), NODE-014 (botón terciario del Hero y enlaces de navbar/footer que lo abren), NODE-012 (la silueta femenina que declara la tarjeta de licencias)
- **Nodos de Salida (Alimenta a):** NODE-013 (vista `#about-view` registrada con `setAboutController`)
- **Contratos / Módulos expuestos:**
  - `src/ui/aboutFullscreenView.js`: `class AboutFullscreenView { constructor(mount, router); open(); close() }`.
  - `src/config/aboutContent.js`: `ABOUT_TITLE_LEAD`, `ABOUT_TITLE_GLOW`, `ABOUT_LEAD`, `ABOUT_CARDS`.
  - `src/ui/appRouterAbout.js`: `openAbout(router, pushHash = true)` / `closeAbout(router, updateHash = true)`.
  - `src/ui/appRouterTriggers.js`: `bindViewTriggers(router)`.
  - `src/styles/aboutFullscreenView.css`: vista, tarjetas, skeleton/shimmer, botón terciario `.btn-hero-tertiary`.
  - Ilustraciones generadas en `public/assets/about/`: `about_identity.png`, `about_mision.png`, `about_vision.png`, `about_licencia.png`.
- **Estructura de cada imagen:** `<div class="about-card-image-box"><img class="about-card-img" onload="…is-ready" onerror="…is-loading"></div>`.

### 📦 Responsabilidad Técnica
Presentar "Quiénes Somos" como una vista dedicada a pantalla completa (igual que `#galeria`, `#estudio` y `#login`) y no al final del landing, que queda limpio.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-08 | v1.0.0] Por [Orchestrator, Frontend 3D Engineer, UI/UX Designer & QA Auditor]:**
  - **Cambio:** Creación del nodo: vista `#conocenos` (`aboutFullscreenView.js`, `aboutContent.js`, `aboutFullscreenView.css`), integración en `AppRouter` mediante `appRouterAbout.js` y `appRouterTriggers.js`.
  - **Motivo:** Requerimiento de usuario: dejar el landing limpio y convertir "Quiénes Somos" en una vista completa.
  - **Impacto:** Navegación fluida y sin parpadeos.

- **[2026-10-08 | v1.1.0] Por [Lead UI/UX Designer & Graphic Artist]:**
  - **Cambio:** Generación e integración en alta fidelidad (16:9) de las 4 ilustraciones de marca en `/public/assets/about/`:
    1. `about_identity.png`: Atelier y laboratorio de diseño streetwear 3D en Colombia.
    2. `about_mision.png`: Fotografía macro del tejido de algodón pesado 240g con estampación DTF Ultra HD sin tacto plástico.
    3. `about_vision.png`: Micro-factoría inteligente en Medellín con pantallas holográficas y corte láser.
    4. `about_licencia.png`: Silueta femenina en 3D con retícula de mapeo UV y certificación de licencia comercial.
    Eliminación de archivos obsoletos (`src/ui/aboutSection.js` y `src/styles/aboutSection.css`).
  - **Motivo:** Requerimiento del usuario para sustitución de placeholders por arte editorial oficial.
  - **Impacto:** Eliminación del 100% de advertencias de red 404, transición automática del shimmer skeleton a la ilustración real en 60 FPS.

- **[2026-10-09 | v1.2.0] Por [Legal & UI/UX Designer]:**
  - **Cambio:** Actualización de la tarjeta de cumplimiento y derechos de autor (`src/config/aboutContent.js`): se reemplaza la mención a Midjourney por la declaración exacta de generación mediante **Meshy.ai** en modalidad gratuita (Free Tier), complementada con la retopología, costuras, mapeo UV conforme y optimización para renderizado en Three.js a 60 FPS realizada por el equipo de ingeniería. Chips actualizados: `Generador 3D Meshy.ai`, `Topología & UV Calibrados`, `100% Transparente & Legal`.
  - **Motivo:** Solicitud explícita del usuario para reflejar con total veracidad y transparencia el origen del modelo 3D de la silueta femenina.
  - **Impacto:** Cumplimiento ético de atribución y transparencia en el uso de IA generativa. Build verificado con 0 errores.


