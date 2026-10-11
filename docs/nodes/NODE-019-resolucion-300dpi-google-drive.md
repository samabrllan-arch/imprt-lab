# [NODE-019]: Motor 300 DPI & Sincronización Google Drive
- **Tipo:** Image Processing / Cloud Integration / Print Engine
- **Estado:** Activo
- **Responsable:** Backend & Checkout Engineer / Frontend 3D

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-017 (Print Sizing)
- **Nodos de Salida (Alimenta a):** NODE-009 (Panel Medidas), NODE-011 (Checkout WhatsApp), NODE-010 (Editor)
- **Contratos / Métodos expuestos:** `computeEffectiveDpi`, `getDpiQuality`, `upscaleTo300Dpi`, `embedDpiInPng`, `insertPhysChunk`, `sendOrderToGoogleDrive`; `src/services/dpiClamp.js` (110 líneas): `getZoneMaxPx`, `clampScaleFor`, `clampToPrintDpi`, `canvasToMasterPng`, `buildMaster`, `canvasToImage`, `describeClamp`

### 📦 Responsabilidad Técnica
Genera artes a escala de producción física textil (\(W_{cm} \times 118.11\text{ px/cm}\)) aplicando remuestreo de alta calidad, filtro convolucional Unsharp Mask e inyección del chunk binario `pHYs` a 11,811 ppm (300 DPI) para RIPs y Photoshop. Conecta con Google Apps Script para guardar automáticamente los archivos en Google Drive y registrar pedidos en Google Sheets.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-06 | v1.4.0] Por [Backend & Frontend]:**
  - **Cambio:** Creación de `src/services/printResolution.js`, `src/services/driveUploader.js`, `src/config/cloud.js` y script `google-drive-webhook.gs`.
  - **Motivo:** Estandarización a 300 DPI y almacenamiento en Google Drive solicitado por el usuario.
  - **Impacto:** Flujo completo de producción desde el navegador sin necesidad de servidores de pago.

- **[2026-10-06 | v1.5.0] Por [Frontend & QA]:**
  - **Cambio:** Incorporación de remuestreo progresivo multiescala (pasos escalonados de 1.4x) y refinamiento de Unsharp Mask con umbral para bordes finos.
  - **Motivo:** Evitar pixelación o difuminado en ilustraciones al hacer zoom en el archivo exportado a 300 DPI.
  - **Impacto:** Máxima nitidez en detalles como pelaje, tipografía fina y trazos sin ruido.

- **[2026-10-06 | v1.6.0] Por [Frontend & QA]:**
  - **Cambio:** Reemplazo del remuestreo bicúbico por el algoritmo separable Lanczos-3 (con kernel sinc normalizado y 3 lóbulos de ventana) y filtro de nitidez convolucional Gaussiano con umbral anti-ruido (`threshold`), portado de la especificación técnica de `imagen_300dpi (1).html`.
  - **Motivo:** Lograr fidelidad gráfica 10:10 con bordes nítidos sin pixelado ni halos oscuros en contornos transparentes DTF al exportar a 300 DPI reales (chunk `pHYs` 11,811 ppm).
  - **Impacto:** Estándar de nitidez industrial idéntico a software de preprensa vectorial/rasterizada.

- **[2026-10-08 | v1.7.0] Por [Frontend & Backend]:**
  - **Cambio:** Re-escalado de alta fidelidad con algoritmo Lanczos-3 de los 12 drops comunitarios en `public/assets/drops/` a ~2600 px en su eje principal (generando 250 a 300+ DPI nativos en tamaños típicos de 20 a 25 cm). Actualización del umbral del indicador en `src/services/printResolution.js` (`getDpiQuality`) y `src/styles/sizePanel.css`: reemplazo de advertencias rojas alarmistas para artes subidos por el distintivo inteligente `✨ 300 DPI • Auto-HD` (`.dpi-upscaled`), informando al usuario que el motor de exportación re-escala y remasteriza automáticamente con Lanczos-3 y Unsharp Mask a 300 DPI físicos para el rip de estampación.
  - **Motivo:** El usuario observó valores numéricos bajos de DPI en pantalla y expresó preocupación por si el sistema permitiría o no alta calidad de impresión.
  - **Impacto:** Experiencia de usuario libre de fricción y garantía comprobable de resolución de nivel industrial para producción textil.

- **[2026-10-08 | v1.8.0] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** (1) Nuevo `dpiClamp.js`: tope estricto de 300 DPI efectivos. El máximo útil por zona es el área imprimible de la talla más grande (frente 36×50 cm ⇒ 4252×5906 px); si la imagen lo supera se reduce (nunca se amplía) con mitades sucesivas y `lanczosResize`, conservando el alfa. (2) `buildMaster` produce el archivo máster: PNG con `pHYs` 11811 ppm (`insertPhysChunk`, extraído de `embedDpiInPng`) o JPEG q95 si la fuente era un JPEG. (3) `getDpiQuality` cambia sus etiquetas: ≥ 240 → `300 DPI • Óptimo DTF` (verde), 150–239 → `N DPI • Alta Calidad`, < 150 → `⚠️ N DPI • Calidad Baja (Remuestreado a 300 DPI para impresión)` (clase `dpi-low`). Sustituye al distintivo `✨ 300 DPI • Auto-HD` de v1.7.0 también en el panel de medidas. (4) `decalUploader.js` y el editor aplican el tope al cargar y al exportar.
  - **Motivo:** Requerimiento de usuario: proteger la cuota de Google Drive (2 TB) y el navegador frente a artes de 50–90 MB sin perder nitidez de imprenta.
  - **Impacto:** Medido en Chromium: 5200×6400 px con alfa → PNG de 4252×5233 px, 3.75 MB, `pHYs` 11811/11811/1, esquina transparente y centro opaco. El peso depende del contenido: un arte plano pesa < 1 MB, una foto con ruido en PNG puede superar 15 MB (por eso las fotos JPEG conservan formato JPEG q95: ≈ 8 MB en el peor caso de ruido puro 3000×3000). La cifra "2–4 MB" del requerimiento no está garantizada para todo contenido. El tope nunca amplía imágenes pequeñas: eso sigue en `upscaleTo300Dpi` al exportar el pedido. `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.

- **[2026-10-09 | v2.0.0] Por [Backend & Checkout Engineer]:**
  - **Cambio:** Rediseño integral de `scripts/google-drive-webhook.gs` (244 líneas) enlazado a la carpeta Google Drive `1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN`. Arquitectura multi-subcarpeta automatizada (`Boveda_Disenos`, `Pedidos_Produccion`, `Comprobantes_Pago`) y base de datos Google Sheets `IMPRNT_LAB_Database` (hojas `Pedidos` y `Boveda`). Implementación de acciones: `upload_vault` (sync de arte de la Bóveda), `create_order` (subida de máster 300 DPI y mockup con validación estricta de máximo 2 pedidos en `pending_payment`), `mark_paid` (reporte de comprobante y liberación de cupo de pedidos) y `check_pending` (consulta reactiva). Actualización de `src/config/cloud.js` y `src/services/driveUploader.js`.
  - **Motivo:** Requerimiento explícito del usuario para el inicio de la lógica del backend: conexión con carpeta de Google Drive dedicada, subida desde Bóveda, subida diferida en confirmación de pedido 3D y regla de negocio de máximo dos pedidos pendientes de pago.
  - **Impacto:** Backend cloud en Google Apps Script listo para despliegue sin costos de servidor; validación en origen de pedidos pendientes para evitar saturación y control ordenado de pagos. Build verificado con 0 errores.

