# [NODE-024]: Pedidos del Cliente, Auth Gate & Pagos
- **Tipo:** Orders / Auth Gate / Payments
- **Estado:** Activo (v1.0.0)
- **Responsable:** Frontend & UI/UX Designer

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-011 (borrador y confirmación del checkout), NODE-015 (tokens `--ck-*`), NODE-020 (`authService`, `authModal`)
- **Nodos de Salida (Alimenta a):** NODE-011 (cierre del checkout y arte 300 DPI en segundo plano), NODE-020 (consume sesión), NODE-026 (archiva la prenda del pedido en la Bóveda), `src/main.js` (`initOrderDraftResume()`)
- **Contratos / Módulos expuestos:**
  - `src/config/paymentConfig.js` (67 líneas): `ORDER_STATUS` (`pending_payment`, `proof_submitted`, `paid`), `ORDER_STATUS_META`, `PAYMENT_METHODS` (nequi, bancolombia; el campo `value` está VACÍO y debe completarlo el dueño), `getPaymentMethod`, `getStatusMeta`, `isPayable`.
  - `src/services/orderDraft.js` (94 líneas): borrador en `localStorage['shirt_pending_order_draft']`, TTL 24 h, con copia en memoria para conservar la captura si se excede la cuota.
  - `src/services/orderStorage.js` (128 líneas): `getLocalOrders`, `getLocalOrderById`, `getOrdersForUser(user)`, `createOrderFromDraft(draft, user)` → `{ok, order, existed?}` (idempotente), `updateLocalOrder`, `deleteLocalOrder`, `saveLocalOrder` (compat). Máximo 30 pedidos; `writeOrders` reintenta 4 veces quitando capturas de forma progresiva.
  - `src/services/paymentProof.js` (50 líneas): `validateProofFile`, `compressProofImage` (JPEG ≤ 1280 px, q 0.78, fondo blanco).
  - `src/ui/orderAuthGate.js` (63 líneas): `openOrderAuthGate(draft)` / `closeOrderAuthGate()`. Overlay `#order-auth-gate-overlay` "Inicia Sesión o Regístrate para Continuar tu Pedido"; `#og-login` / `#og-register` abren `authModal`; `#og-cancel` o clic fuera descartan el borrador.
  - `src/ui/ordersModal.js` (144 líneas) y `src/ui/ordersModalView.js` (133 líneas): "Mis Pedidos". `openOrdersModal({highlightId, expandPayment})`; delegación de eventos por `data-action` (`close`, `login`, `toggle-pay`, `select-method`, `submit-proof`, `send-whatsapp`, `copy`, `download-photo`, `delete`). Los datos de usuario se escapan con `escapeHtml`.
  - Estilos: `orderAuthGate.css`, `ordersModal.css` (ver NODE-015 v1.7.0).
- **Esquema de pedido (`orderStorage`):**
  ```json
  {
    "id": "ORD-XXXX", "createdAt": "ISO-8601", "status": "pending_payment",
    "paymentMethod": null, "paymentProof": null,
    "customer": { "name": "", "email": "", "city": "" },
    "garment": { "silhouette": "", "size": "", "color": "", "material": "", "grammage": "" },
    "pricing": { "total": 0, "formatted": "" },
    "screenshot": "data:image/png;base64,…"
  }
  ```
  Campos adicionales: `decals[{zone, zoneName, name, widthCm, heightCm}]`, `owner` (correo) y, tras el pago, `paymentProof = { channel: 'web' | 'whatsapp', image, submittedAt, whatsappSentAt? }`; `driveUrl` / `hasLocalFile` cuando se genera el arte 300 DPI.

### 📦 Responsabilidad Técnica
Exigir cuenta para enviar un pedido sin perder el diseño: el borrador se guarda en caché, se solicita iniciar sesión o registrarse y, al autenticarse, el pedido se crea automáticamente (estado `pending_payment`) con el nombre y correo de la cuenta. En "Mis Pedidos" el cliente ve los datos de Nequi/Bancolombia, sube el pantallazo del comprobante en la web o lo notifica por WhatsApp (`proof_submitted`). El estado `paid` lo fija el dueño y no tiene interfaz.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-08 | v1.1.0] Por [Frontend & UI/UX Designer]:**
  - **Cambio:** Incorporación de la acción y botón `✓ Marcar como pagado` en el panel de pago de "Mis Pedidos" (`ordersModal.js`, `ordersModalView.js`, `ordersModal.css`). Se actualizó el estado a `En Validación` con promesa de verificación en menos de 24 horas (`paymentConfig.js`), banner explicativo (`.mp-validation-banner`) con indicador `⏳`, subida de comprobante opcional/flexible y persistencia en `localStorage`. Lógica 100% frontend.
  - **Motivo:** Requerimiento del usuario: *"que haya una opción como Marcar pagado, entonces ahí entra en validación. Y en menos de 24 horas se te notificará"*.
  - **Impacto:** Experiencia sin fricción; el cliente puede reportar su transferencia de inmediato con o sin imagen y recibe retroalimentación clara de validación. Build de Vite verificado con 0 errores.

- **[2026-10-08 | v1.2.0] Por [Frontend & UI/UX Designer]:**
  - **Cambio:** Implementación de la Línea de Tiempo y Tracker de Producción del Pedido (`src/config/orderTimeline.js`, `src/ui/orderTimelineView.js`, `src/styles/orderTimeline.css`). Contiene las 6 fases: 1) El pago está siendo validado, 2) Tu estampado está siendo impreso, 3) Se estampó tu camiseta, 4) Se está empacando el pedido, 5) El pedido ya salió, 6) Entregado. Incluye botón interactivo de prueba `Simular paso siguiente ⏩` (`advanceStage`) para recorrer y pulir el ciclo completo desde el frontend.
  - **Motivo:** Solicitud explícita del usuario: *"quisiera que cuando yo le dé a Marcar como pagado, vea la lista... para ir viendo y puliendo la lógica y ya después sea más fácil solo hacerlo del backend"*.
  - **Impacto:** Simulación visual y funcional completa en el frontend; listo para enlazar a webhooks/sockets en la fase de backend. Build verificado con 0 errores.

- **[2026-10-08 | v1.3.0] Por [Frontend & Backend/Legal Engineer]:**
  - **Cambio:** `orderStorage.createOrderFromDraft` copia al pedido los datos de despacho del perfil (NODE-025): `customer.phone`, `customer.address`, `customer.deliveryNotes`, y usa `user.city` si el borrador no trae ciudad. `buildPaymentProofWhatsAppUrl` añade las líneas "Dirección" y "Celular" cuando existen. `orderModal.js` precarga la ciudad del checkout desde el perfil (el nombre ya se precargaba).
  - **Motivo:** Que los datos de "Mi Perfil & Datos de Envío" se usen de verdad al liquidar y despachar el pedido, sin volver a escribirlos.
  - **Impacto:** Campos nuevos y opcionales en el esquema de pedido (vacíos si el cliente no completó su perfil); los pedidos anteriores no cambian. El pedido guarda una copia: editar el perfil después no altera pedidos ya creados.

- **[2026-10-08 | v1.4.0] Por [Frontend & Backend/Legal Engineer]:**
  - **Cambio:** `checkoutOrderFlow.js` (124 líneas) llama a `archivePurchasedDesign(order)` (NODE-026) justo después de crear el pedido, tanto en el flujo directo como al reanudar el borrador tras iniciar sesión. El archivo es idempotente por `orderId`. "Mis Pedidos" no cambia.
  - **Motivo:** Requerimiento de usuario: toda prenda pedida debe quedar archivada en la Bóveda como "Prenda Impresa #ORD-XXXX" sin consumir cupos gratuitos.
  - **Impacto:** El archivo ocurre al crear/confirmar el pedido (y se completa al abrir la Bóveda si faltara alguno), no en el estado `paid`, que hoy no tiene interfaz. Guarda el mockup de la prenda (JPEG comprimido), no el arte original. Si `localStorage` está lleno el archivo falla en silencio y el pedido no se ve afectado.

- **[2026-10-09 | v1.5.0] Por [Backend & Checkout Engineer]:**
  - **Cambio:** Conexión en vivo con el backend de Google Apps Script (`src/config/cloud.js`, `src/services/driveUploader.js`, `src/ui/checkoutOrderFlow.js` y `src/ui/ordersModal.js`). Aplicación de la regla de negocio de máximo 2 pedidos pendientes de pago (`pending_payment`): `finalizeOrder` audita y bloquea nuevos intentos si el cliente tiene 2 órdenes pendientes, redirigiendo a "Mis Pedidos". `deliverPrintArt` sube diferidamente el arte 300 DPI y mockup a `Pedidos_Produccion/` en Google Drive y Google Sheets. Al reportar pago (`markPaid` o WhatsApp), `reportPaymentToGoogleDrive` sincroniza el estado a `proof_submitted`, liberando el cupo para nuevos pedidos.
  - **Motivo:** Integración con webhook de Apps Script desplegado por el usuario (`AKfycbwixHbpoJH0MulyLlL1SPU50V-85Y4wPdlfPag7FDnpH-U33G3FS43HO6BCovvzpBmF`) y control de saturación de pedidos pendientes.
  - **Impacto:** Flujo end-to-end verificado en vivo mediante tests de red: creación de orden, rechazo con `LIMIT_REACHED` al 3er pedido, liberación tras marcar como pagado y reintento exitoso. Build verificado con 0 errores.

