# [NODE-026]: Bóveda Segura de Diseños (Atelier Vault)
- **Tipo:** Storage / User Content / UI
- **Estado:** Activo (v1.2.0)
- **Responsable:** UI/UX Designer, Frontend 3D & Backend/Legal Engineer

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-015 (tokens `--ck-*`), NODE-020 (sesión: `authService.getCurrentUser`, `subscribe`; menú de cuenta), NODE-024 (pedidos: `archivePurchasedDesign` se invoca desde `checkoutOrderFlow`), NODE-025 (consentimiento de TyC vigente para publicar), NODE-010 (editor de imágenes: "Editar Arte"), NODE-009 (decals: "Estampar en 3D")
- **Nodos de Salida (Alimenta a):** NODE-009 (pestaña "Comunidad" de la vitrina de autor), NODE-020 (entrada de menú), NODE-024 (recibe el pedido para archivar)
- **Contratos / Módulos expuestos:**
  - **v1.1.0 — Máster 300 DPI:** `src/services/vaultMasterStore.js` (58): IndexedDB `shirt_studio_vault_masters` / `masters` (`putMaster`, `getMaster`, `deleteMaster`; devuelven `null`/`false` sin lanzar si IndexedDB no está disponible). `src/ui/vaultAssets.js` (49): `storeMaster`, `loadItemImage`, `downloadItemHd` → `{ kind: 'master' | 'preview', bytes }` (archivo `<nombre>_300DPI.png|jpg`). El máster NO cabe en `localStorage` (cupo ≈ 5 MB): `localStorage` conserva metadatos, miniatura 320 px y copia de trabajo ≤ 1024 px; el máster (PNG con alfa y `pHYs` 300 DPI, JPEG q95 si la fuente era JPEG, SVG rasterizado) vive en IndexedDB. Campos nuevos del ítem: `hasMaster`, `masterW`, `masterH`, `masterBytes`, `masterType`, `authorAlias`. Cada escritura exitosa emite `vault:changed`.
  - `src/services/vaultStorage.js` (126 líneas; v1.1.0: `newVaultId`, `toggleItemPrivacy(id, authorAlias)`, `renameVaultAuthor(userId, alias)`, `deleteVaultItem` también borra el máster): `VAULT_KEY` (`shirt_user_vault_db`), `FREE_SLOTS` (5), `getVaultItems(userId)`, `getVaultUsage(userId)` → `{ free, max, left, purchased }`, `saveVaultItem(item)` → `{ ok, item }` | `{ ok: false, error }` (`invalid`, `no_slots`, `storage_full`), `updateVaultItem(id, patch)`, `toggleItemPrivacy(id)`, `deleteVaultItem(id)` (solo gratuitos; los impresos devuelven `purchased_protected`), `getPublicVaultItems()`, `archivePurchasedDesign(order)` (asíncrona, idempotente por `orderId`).
  - `src/services/vaultImage.js` (89 líneas; `imageToVault(source, { alpha, master, opaque, svg })` también devuelve el máster): `loadImage`, `imageToVault(source, { alpha })` → `{ image, thumb, width, height }` (WebP, ≤ 1024 px y ≤ 600 000 caracteres con bucle de reducción; miniatura 320 px; lado mínimo 480 px), `fileToVault(file)`.
  - `src/ui/vaultModal.js` (167 líneas): `openVaultModal({ router })`. Overlay `#vault-modal-overlay`; delegación de eventos por `data-action`; subida de archivos, confirmación de borrado, toasts y bloqueo mientras comprime.
  - `src/ui/vaultModalView.js` (88 líneas; línea de especificación `HD W×H px · 300 DPI · peso` y `@alias` en cada tarjeta): `renderVaultHtml({ items, usage, confirmId, busy })`. Todo dato de usuario pasa por `escapeHtml`.
  - `src/ui/communityGallery.js` (47 líneas; acredita `@authorAlias`): `renderCommunity(container, onApplied)` para la pestaña "Comunidad" de `authorDesignsModal.js` (NODE-009 v1.7.0).
  - Lookbook comunitario: `src/ui/lookbook.js` / `lookbookCard.js` listan los públicos (NODE-014 v1.6.0).
  - Estilos: `vaultModal.css` (138 líneas) y `communityGallery.css` (14 líneas) (ver NODE-015 v1.9.0).
- **Esquema de ítem (`localStorage['shirt_user_vault_db']`):**
  ```json
  {
    "id": "VLT-XXXXXX", "userId": "id-de-la-cuenta (user.id)", "type": "free | purchased",
    "name": "Mi logo", "image": "data:image/webp;base64,…", "thumb": "data:image/webp;base64,…",
    "isPublic": false, "createdAt": "ISO-8601",
    "orderId": "ORD-XXXX (solo purchased)", "ownerName": "(solo si es público)"
  }
  ```

  - **Reemplazar y Guardar como Copia desde el editor (v1.2.0):** `src/ui/vaultEditorSave.js` (56 líneas): `replaceVaultArt(itemId, dataUrl)` sobrescribe `image`, `thumb` y máster (IndexedDB) de un ítem sin consumir cupos; `saveVaultCopy(dataUrl, nombre)` crea un ítem `free` nuevo `<nombre> (copia)` (valida sesión y cupos: errores `no_session`, `no_slots`, `storage_full`; si el cupo falla revierte el máster); `vaultSlotsLeft()`; `copyName()`. `vaultModal.js` (171) reutiliza `replaceVaultArt` en "Editar Arte" y pasa `ctx.onReplace` al editor (NODE-010 v2.10.0). `communityGallery.js` (49) oculta los diseños reportados (NODE-027).

### 📦 Responsabilidad Técnica
Dar a cada cliente registrado un archivo personal de diseños, 100% frontend. **Cupos:** hasta 5 diseños gratuitos (`type: 'free'`); borrar uno libera el cupo al instante. **Prendas impresas:** al crear/confirmar un pedido, el mockup de la prenda se archiva como "Prenda Impresa #ORD-XXXX" (`type: 'purchased'`) y **no consume** cupos. **Privacidad:** cada ítem es privado por defecto; el interruptor lo publica en la pestaña "Comunidad" de la Vitrina de Diseños de Autor. Publicar exige haber aceptado la versión vigente de los TyC (`user.termsVersion === LEGAL_TERMS_VERSION`, NODE-025); si no, se abre el modal de perfil. **Tarjeta:** miniatura, insignia `Gratis (n/5)` o `Impreso`, interruptor Privado/Público y botones Estampar en 3D (aplica el arte a la zona activa y cierra la Bóveda), Editar Arte (abre el editor de imágenes y guarda el resultado en el mismo ítem), Descargar HD y Eliminar (solo gratuitos, con confirmación). **Indicador:** "Cupo de la Bóveda: X / 5 gratuitos utilizados (+ Y prendas impresas)".

### ⚠️ Limitaciones conocidas (decisiones de diseño)
- **No es un límite de seguridad:** la cuota de 5 cupos se valida solo en el navegador; cualquiera puede alterar `localStorage`. Si la Bóveda se vuelve de pago o crítica, la cuota debe validarse en un backend.
- **"Público" es local:** sin backend, un diseño público solo se ve en el mismo navegador. No hay moderación ni reporte de contenido; con un backend habría que añadirlos antes de mostrar diseños entre usuarios.
- **Descargar HD** entrega la copia de trabajo almacenada (≤ 1024 px), no el archivo original, por los límites de `localStorage` (~5 MB por origen).
- **Prendas impresas:** guardan el mockup de la prenda (JPEG), no el arte; por eso no ofrecen Estampar, Editar ni Eliminar.
- **Momento del archivo:** ocurre al crear/confirmar el pedido (y se completa al abrir la Bóveda si faltara alguno), no en el estado `paid`, que hoy no tiene interfaz.
- **Cuota del navegador:** si `localStorage` está lleno, `saveVaultItem` devuelve `storage_full` y la UI avisa; el archivo automático falla en silencio sin afectar el pedido.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-08 | v1.0.0] Por [UI/UX Designer, Frontend 3D & Backend/Legal Engineer]:**
  - **Cambio:** Creación del nodo: `vaultStorage.js`, `vaultImage.js`, `vaultModal.js`, `vaultModalView.js`, `vaultModal.css`, `communityGallery.js` y `communityGallery.css`; entrada "Mi Bóveda de Diseños" en el menú (NODE-020 v2.7.0); archivo automático desde `checkoutOrderFlow.js` (NODE-024 v1.4.0); pestaña "Comunidad" en la vitrina de autor (NODE-009 v1.7.0).
  - **Motivo:** Requerimiento de usuario ("Atelier Safe Vault"): 5 espacios gratuitos, archivo ilimitado de prendas compradas y control de privacidad por diseño.
  - **Impacto:** Nueva llave `shirt_user_vault_db` en `localStorage` (no toca las existentes). Verificado con Playwright en Chromium (64 de 64 comprobaciones: cupos y liberación, archivo idempotente sin consumir cupos, privacidad y bloqueo por TyC, pestaña Comunidad, ruta de almacenamiento lleno, escape de HTML, claro/oscuro y móvil 390 px). `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.

- **[2026-10-08 | v1.1.0] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** **Corrección de calidad de descarga.** Antes "Descargar HD" entregaba la copia reducida (≤ 1024 px) porque `localStorage` no admite masters de varios MB. Ahora, al subir, se genera el máster con el tope de 300 DPI (`dpiClamp.buildMaster`) y se guarda en IndexedDB; la tarjeta usa la miniatura de 320 px y "Descargar HD" entrega el PNG máster (alfa + `pHYs` 300 DPI). "Editar Arte" y "Estampar en 3D" cargan el máster; si la subida de metadatos falla por cuota, se revierte el máster (sin huérfanos). Eliminar un ítem borra su máster. Si el navegador ya no tiene el máster, la descarga entrega la copia reducida y lo avisa con un toast (`kind: 'preview'`). Al publicar se fija `authorAlias`; `renameVaultAuthor` lo actualiza si el usuario cambia su alias. Los públicos alimentan el Lookbook comunitario (NODE-014).
  - **Motivo:** Requerimiento de usuario: conservar el archivo máster a 300 DPI con alfa y mostrar el crédito `@alias` en diseños públicos.
  - **Impacto:** Verificado en Chromium (logo de 4800×3200 → máster PNG 4252×2835 con alfa, descarga `Logo_Grande_300DPI.png` de 4252×2835 con `pHYs` 11811; JPEG → máster JPEG; SVG rasterizado a 4252×2126; borrar libera IndexedDB; cuota agotada → cero ítems y cero másteres huérfanos). Limitaciones: el máster es por navegador (IndexedDB no se sincroniza entre dispositivos ni sobrevive a "borrar datos del sitio"); el peso real depende del arte (0.3 MB en un logo plano, 3.75 MB en un degradado con alfa de 4252×5233, más en fotos con ruido); lo público es solo la copia ≤ 1024 px. `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.

- **[2026-10-08 | v1.2.0] Por [Lead Architect, UI/UX Designer, Frontend WebGL & QA Auditor]:**
  - **Cambio:** Nuevo `vaultEditorSave.js` con `replaceVaultArt` y `saveVaultCopy`; `vaultModal.js → edit()` pasa a usar `replaceVaultArt` y expone `ctx.onReplace` al editor para **💾 Reemplazar Imagen**; **➕ Guardar como Copia** crea un ítem gratuito nuevo con máster 300 DPI. La pestaña "Comunidad" de la vitrina de autor (`communityGallery.js`) no muestra diseños reportados.
  - **Motivo:** Requerimiento de usuario: guardar los cambios del editor sobre el original o como copia (respetando los 5 cupos gratuitos) sin pasar por la camiseta.
  - **Impacto:** Verificado en Chromium: la copia ocupa un cupo (3→4→5), con 5/5 el botón se deshabilita y no se crean ítems ni másteres huérfanos; el original no cambia. Reemplazar no consume cupos. `npm run build` NO se pudo ejecutar en este entorno (la política de red bloquea el registro npm, por lo que no hay `node_modules`): ejecútalo localmente. En su lugar se verificó `node --check` de cada archivo tocado, la resolución de imports/exports y el comportamiento en Chromium (Playwright).

- **[2026-10-09 | v1.3.0] Por [Backend & UI/UX Designer]:**
  - **Cambio:** Respaldo y sincronización automática de artes de la Bóveda hacia Google Drive (`src/ui/vaultModal.js` y `src/services/driveUploader.js`). Al subir un diseño (`upload`), tras el almacenamiento local e IndexedDB, se envía asíncronamente a Google Apps Script (`action: 'upload_vault'`), guardando el archivo en la subcarpeta `Boveda_Disenos/` con permisos públicos de visualización y registrando los metadatos en la hoja `Boveda` de Google Sheets.
  - **Motivo:** Requerimiento del usuario para iniciar la persistencia cloud de la Bóveda en Google Drive.
  - **Impacto:** Respaldo en la nube sin ralentizar la interfaz local. Verificado con tests de red en vivo contra el webhook desplegado. Build verificado con 0 errores.

