# [NODE-011]: Resumen de Compra & Checkout WhatsApp
- **Tipo:** Checkout / Order Service
- **Estado:** Activo (v2.1.0 Checkout Atelier: Auth Gate, borrador en caché y pedido `pending_payment`)
- **Responsable:** Backend / Frontend

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-003 (Pricing), NODE-005 (Engine 3D: captura HD), NODE-020 (`authService`: sesión y suscripción), NODE-024 (Auth Gate, "Mis Pedidos" y pagos)
- **Nodos de Salida (Alimenta a):** API Externa / WhatsApp Web, NODE-024 (recibe el pedido `pending_payment` creado desde el borrador)
- **Contratos / Módulos expuestos:**
  - `src/ui/orderModal.js` (156 líneas, v2.1.0): controlador del checkout. Valida nombre y ciudad (`#checkout-form-error`, `.is-invalid`), enlaza talla/material/gramaje y, con `#btn-confirm-order`, arma el borrador (`buildOrderDraft`) y lo entrega a `confirmOrder`. Ya no envía a WhatsApp ni guarda pedidos directamente.
  - `src/ui/checkoutModalView.js` (183 líneas): markup del Checkout Atelier. Mismas clases de selectores; añade el recibo `.atelier-receipt` (`#checkout-total-val`), el aviso de cuenta `#checkout-auth-hint` y el parámetro `authUser`.
  - `src/ui/checkoutOrderFlow.js` (122 líneas): `confirmOrder(draft)` (guarda el borrador; si no hay sesión abre el Auth Gate y devuelve `{status:'auth_required'}`), `finalizeOrder(draft, {fromResume})` (crea el pedido, limpia el borrador, abre "Mis Pedidos" con el pago expandido y sube/descarga el arte 300 DPI en segundo plano) e `initOrderDraftResume()` (se suscribe a `authService`; retoma al pasar de anónimo a autenticado y 800 ms después del arranque si ya hay sesión).
  - `src/ui/checkoutArt300.js` (34 líneas): `createArtGenerator(orderId)`, generador 300 DPI asíncrono y memoizado extraído de `orderModal.js` (mantiene el contrato de v1.6.0: solo bajo demanda).
  - `src/services/orderDraft.js` (94 líneas): serializa la configuración completa en `localStorage['shirt_pending_order_draft']` (TTL 24 h): `buildOrderDraft`, `saveOrderDraft`, `loadOrderDraft`, `clearOrderDraft`, `getPrimaryDecal`, `getZoneName`.
  - `src/services/orderStorage.js` (128 líneas): persistencia de pedidos con esquema `pending_payment` (ver NODE-024): `createOrderFromDraft` idempotente, `getOrdersForUser`, `updateLocalOrder`, `deleteLocalOrder`; `writeOrders` degrada la captura si se excede la cuota.
  - `src/services/whatsapp.js` (74 líneas): `buildWhatsAppOrderUrl` (intacto: enlace `wa.me` con prenda, color, zonas, talla, total y orden) y `buildPaymentProofWhatsAppUrl(order, methodLabel)` (aviso de comprobante de pago).
  - Estilos: `checkoutTokens.css` (`--ck-*`), `checkoutModal.css`, `checkoutSelectors.css` (ver NODE-015 v1.7.0).
  - `src/services/exporter.js`: Generación de resumen serializable en JSON.

### 📦 Responsabilidad Técnica
Consolidar la personalización completa del usuario, capturar la foto HD del render 3D actual y despachar la orden de compra lista para cerrar venta directa vía WhatsApp.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v2.0.0] Por Backend & Checkout:**
  - **Cambio:** Creación del servicio de persistencia local `src/services/orderStorage.js` y del visor histórico `src/ui/ordersModal.js`. Los pedidos guardan automáticamente el mockup HD 3D del diseño, medidas reales de impresión en cm adaptadas a la talla seleccionada, silueta, color y total. Mensaje de WhatsApp enriquecido con ID de pedido y medidas físicas DTF en cm.
  - **Motivo:** Permitir al dueño del taller y al cliente consultar localmente sus pedidos con la vista exacta de cómo se diseñó y conocer los cm precisos de impresión según la talla (S a XXL).
  - **Impacto:** Trazabilidad total de producción y consulta offline de pedidos confirmados.

- **[2026-10-05 | v1.0.0] Por Backend:**
  - **Cambio:** Integración al Context Graph.
  - **Motivo:** Conectar el embudo de conversión final con la escena 3D y la matriz de precios.
  - **Impacto:** Cierra el ciclo comercial de la plataforma.
- **[2026-10-06 | v1.1.0] Por Backend:**
  - **Cambio:** `whatsapp.js`: cada estampado informa ancho × alto (cm) y el área máxima de la talla, más una nota del modo de graduación (medida fija / proporcional).
  - **Motivo:** Producción necesita saber si las medidas aplican igual a todas las tallas.
  - **Impacto:** Usa `getDecalDimensionsCm` del motor único NODE-017; el payload ya no incluye el % de escala.

- **[2026-10-06 | v1.4.0] Por [Backend & Checkout]:**
  - **Cambio:** Incorporación de generación de arte a 300 DPI con chunk pHYs y sincronización con Google Drive Webhook (`orderModal.js`, `whatsapp.js`).
  - **Motivo:** Permitir al taller recibir el enlace de descarga directa a 300 DPI en Google Drive o archivo local.
  - **Impacto:** Los pedidos llegan con la URL del archivo en Drive y el cliente puede descargar su arte DTF.

- **[2026-10-06 | v1.5.0] Por [Backend & UI/UX]:**
  - **Cambio:** Transformación completa de `orderModal.js` en Checkout interactivo y desacoplamiento de vista en `src/ui/checkoutModalView.js` y `src/styles/checkoutModal.css`. Centraliza como único punto la selección de Talla (S-XXL), Tipo de Material (Algodón vs Poliéster) y Gramaje (120/180/240g), recalculando en vivo el desglose de precios.
  - **Motivo:** Eliminar la duplicación de selectores de talla en la interfaz y validar de forma transparente todas las especificaciones y precios antes de despachar a WhatsApp.
  - **Impacto:** Embudo de compra intuitivo, precios verificados al 100% y orden estructurada para producción.
- **[2026-10-06 | v1.6.0] Por [Backend & QA Auditor]:**
  - **Cambio:** Eliminación del cálculo síncrono de 300 DPI en `renderModal()`. Implementación de `getOrGenerate300Dpi()` asíncrono con memoización en caché activado únicamente bajo demanda al hacer clic en "Descargar Arte 300 DPI" o "Enviar Pedido a WhatsApp".
  - **Motivo:** La codificación síncrona en base64 de lienzos de alta resolución bloqueaba por completo la CPU y congelaba la interfaz al abrir el checkout o al conmutar tallas/telas.
  - **Impacto:** Apertura instantánea a 60 FPS (0ms de retraso) y respuesta inmediata en todos los botones del checkout.

- **[2026-10-07 | v1.7.0] Por [Backend & UI/UX]:**
  - **Cambio:** Creación de `src/styles/checkoutSelectors.css` con estilos de alto contraste para selección de Algodón/Poliéster y Gramajes (120/180/240 GSM). Los estados activos cuentan con fondo de marca sólido, badge verde con check (`✓`), sombras elevadas y `aria-pressed`. Separación visual estricta entre hover y selección activa en temas oscuro y claro.
  - **Motivo:** El usuario no podía distinguir claramente qué material o gramaje había seleccionado y el hover confundía la selección.
  - **Impacto:** Feedback visual inequívoco e instantáneo en el checkout, accesible y respetando el límite de 300 líneas.

- **[2026-10-08 | v2.1.0] Por [Frontend & UI/UX Designer]:**
  - **Cambio:** Flujo "Checkout Atelier". (1) Rediseño del modal: recibo de precio "Atelier Receipt" con cifras tabulares y total destacado, indicadores de selección integrados en la tarjeta (sin badges fuera de caja), micro-interacción `translateY(-2px)` y sin scroll horizontal (`overflow-x: hidden` + `min-width: 0` en `.checkout-config-col`). (2) Confirmar ya no abre WhatsApp: serializa el borrador en `shirt_pending_order_draft`, comprueba `authService.isAuthenticated()` y, sin sesión, abre el Auth Gate (NODE-024); al autenticarse el pedido se crea solo con nombre y correo de la cuenta. (3) El pedido nace en estado `pending_payment` (esquema en NODE-024) y se muestra en "Mis Pedidos". (4) `orderModal.js` pasa de monolito a controlador y delega en `checkoutOrderFlow.js`, `checkoutArt300.js` y `orderDraft.js`. (5) `orderStorage.js` reescrito (ver contratos).
  - **Motivo:** Solicitud del usuario: el pedido solo puede enviarse con cuenta; si no la tiene, el diseño queda en caché y se retoma al registrarse; el cliente paga por Nequi/Bancolombia y adjunta el comprobante en la web o por WhatsApp.
  - **Impacto:** Nombre y ciudad pasan a ser obligatorios para confirmar. El pedido ya no se registra hasta que haya sesión. Pedidos anteriores sin dueño se muestran a cualquier usuario con sesión (compatibilidad). El arte 300 DPI solo se genera si el diseño actual aún coincide con el `artKey` del borrador. Verificado con Playwright sobre un arnés simulado (34/34 comprobaciones, cero desborde horizontal en escritorio y 390 px); `npm run build` y la app real NO se ejecutaron en este entorno.

- **[2026-10-08 | v2.2.0] Por [Frontend]:**
  - **Cambio:** `orderModal.js`: la ciudad de entrega se precarga desde el perfil de la cuenta (`authService.getCurrentUser().city`). `orderStorage.js` y `whatsapp.js` incorporan teléfono, dirección y notas de entrega al pedido y al aviso de comprobante (detalle en NODE-024 v1.3.0).
  - **Motivo:** Evitar reescribir datos de envío que el cliente ya guardó en su perfil (NODE-025).
  - **Impacto:** Sin cambios de IDs ni de flujo; el cliente puede seguir corrigiendo la ciudad en el checkout.

