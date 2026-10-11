# [NODE-020]: Módulo de Autenticación Multicanal & 2FA Telegram
- **Tipo:** Auth / Security / External API Service
- **Estado:** Activo
- **Responsable:** Backend & UI/UX Designer

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-015 (Tokens Cyber-Luxury)
- **Nodos de Salida (Alimenta a):** NODE-011 (Checkout & Órdenes), NODE-024 (Auth Gate de pedidos: usa `authModal.open` y `authService.subscribe`/`isAuthenticated`), NODE-025 (perfil, datos de envío y TyC: usa `updateUserProfile`), NODE-026 (Bóveda: entrada de menú `open-vault`), `index.html` (Navbar / Menú de Usuario)
- **Contratos / Métodos expuestos:**
  - `src/services/userAlias.js` (61 líneas): `ALIAS_MIN/MAX` (3–20), `normalizeAlias`, `formatAlias` (antepone `@`), `validateAlias(alias, taken)`, `suggestAlias(seed, taken)`, `ensureAliases(users)`, `takenAliases(users, exceptId)`. `src/services/profileUpdate.js` (35): `applyProfileUpdate`. `src/services/jwtDecode.js` (16): `decodeJwt`.
  - `src/services/authService.js`: `register()`, `login()`, `loginWithGoogle()`, `complete2faLogin()`, `logout()`, `update2faSettings()`, `updateUserProfile({ name, phone, city, address, deliveryNotes, termsAccepted })` (v2.6.0, ver NODE-025), `getCurrentUser()`.
  - `src/services/telegram2fa.js`: `sendVerificationCode()`, `verifyCode()`, `clearChallenge()`.
  - `src/ui/authModal.js`: `authModal.open('login' | 'register' | '2fa')`, `authModal.close()`.
  - `src/ui/authFullscreenView.js`: Vista dedicada a pantalla completa con showcase de beneficios atelier, formulario reactivo y OTP 2FA.
  - `src/ui/userProfileMenu.js`: `initUserProfileMenu(mountElement, router)`.

### 📦 Responsabilidad Técnica
Gestionar el ciclo completo de identidad de los usuarios de la tienda mediante inicio de sesión local (email/contraseña), Google Sign-In (OAuth / Google Identity Services) y una capa de seguridad con Verificación en Dos Pasos (2FA) que despacha tokens de seguridad de 6 dígitos mediante el bot de Telegram `@Notificaciones_inc_bot` a través del webhook de Render (`https://wsp-x3j7.onrender.com/webhook/2fa`).

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-07 | v1.0.0] Por [Backend & UI/UX Designer]:**
  - **Cambio:** Creación del servicio de autenticación (`authService.js`), integración con el webhook 2FA de Render (`telegram2fa.js`), interfaz de login/registro/OTP (`authModal.js`, `authTemplates.js`, `auth.css`) y componente de perfil en el navbar (`userProfileMenu.js`).
  - **Motivo:** Requerimiento de usuario para permitir inicio de sesión dual (cuenta propia y Google) con verificación en dos pasos asistida por Telegram.
  - **Impacto:** Protección de cuenta de clientes, persistencia de sesiones seguras y autofill automático en el flujo de pedidos y checkout.

- **[2026-10-07 | v1.1.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Reconstrucción total del Header/Navbar (`src/styles/navbar.css`) con estética flotante Cyber-Luxury, perfecto contraste adaptativo Dark/Light y botón de inicio de sesión de alta gama. Implementación de la vista dedicada a pantalla completa (`src/ui/authFullscreenView.js`, `src/styles/authFullscreen.css`) con showcase atelier, propuesta de valor VIP y flujo OTP 2FA integrado a 60 FPS sin recarga de página.
  - **Motivo:** Solicitud del usuario para una experiencia visual envolvente tipo estudio 3D que invite al registro manteniendo total fluidez.
  - **Impacto:** Experiencia visual uniforme, navegación ultra-fluida y tasa de conversión superior.

- **[2026-10-07 | v1.2.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Creación del banco de pruebas interactivo `auth-preview.html` (`src/ui/authPreviewApp.js`, `src/styles/authPreview.css`, `src/styles/authPreviewVariants.css`) con 4 prototipos interactivos en vivo a 60 FPS: 1) Doble Panel Deslizante (Sliding Overlay con cruce de imagen y formulario), 2) Quantum Parallax 3D (3D Flip en eje Y), 3) Minimalist Luxury Runway (Atelier editorial), y 4) Cyberpunk HUD Terminal (Láser y telemetría).
  - **Motivo:** Solicitud explícita del usuario para evaluar y comparar en vivo múltiples pantallas de login interactivas de alta gama con máxima fluidez y animación de deslizamiento lateral.
  - **Impacto:** Banco de evaluación interactivo en tiempo real para selección del diseño definitivo.

- **[2026-10-07 | v1.3.0] Por [UI/UX Designer & Fullstack 3D]:**
  - **Cambio:** Adopción oficial definitiva del **Doble Panel Deslizante (Sliding Dual Overlay)** en la aplicación principal (`src/ui/authFullscreenView.js`, `src/styles/authFullscreen.css`), perfeccionamiento tipográfico ('Outfit' / tracking fino), reemplazo de términos por "Bienvenido de Nuevo" / "Entrar a Diseñar →", física fluida `cubic-bezier(0.65, 0.05, 0.36, 1)` y flujo 2FA integrado.
  - **Motivo:** Aprobación explícita del usuario del Concepto 1 con requerimiento de ajuste tipográfico y eliminación de "Acceso al taller".
  - **Impacto:** Experiencia de autenticación ultra-fluida de estándar mundial incorporada de forma permanente.

- **[2026-10-07 | v1.4.0] Por [Frontend 3D & UI/UX Designer]:**
  - **Cambio:** Transformación radical del layout deslizante a **Pantalla Completa Real Edge-to-Edge (100vw x calc(100vh - 64px))**, eliminando por completo cualquier marco flotante o tarjeta modal centrada. División al 50%/50% en toda la superficie de la ventana con parallax interno, contenedores de contenido estricto (`.form-content-wrap` a 440px y `.overlay-content-wrap` a 460px) y soporte móvil reactivo.
  - **Motivo:** Requerimiento imperativo del usuario: *"la idea es que sea la pantalla completa, no un modal volando ahí en el aire"*.
  - **Impacto:** Inmersión total idéntica a la vista de Estudio 3D, sin bordes vacíos, con aceleración por GPU a 60 FPS.

- **[2026-10-07 | v1.5.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Integración completa de **Modo Oscuro / Modo Claro (Dark/Light Mode)** en la vista de autenticación a pantalla completa. Se incorporó el botón selector de tema en la barra superior (`#btn-auth-theme-toggle`), sincronización reactiva con `initThemeToggle()` mediante delegación de eventos, y paleta completa de tokens de modo claro en `authFullscreen.css` (fondos limpios, inputs con alto contraste, Google Sign-in card style y banner editorial de alta costura).
  - **Motivo:** Solicitud del usuario: *"Veo que el login no tiene el modo oscuro y claro..."*.
  - **Impacto:** Coherencia visual 100% fluida en toda la aplicación; el usuario puede alternar entre modo oscuro y claro dentro de la pantalla de login sin perder estado.

- **[2026-10-07 | v1.6.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Desacoplamiento modular en `src/ui/authFullscreenTemplates.js` y `src/ui/authFullscreenView.js` respetando la regla estricta de 300 líneas.
  - **Motivo:** Refactor arquitectónico previo.
  - **Impacto:** Cumplimiento de modularidad y separación limpia de responsabilidades.

- **[2026-10-07 | v1.7.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Doble panel deslizante con fondo cinemático parallax a 60 FPS, eliminación de tarjetas flotantes en la columna del formulario, eliminación de botones redundantes de pestañas y simplificación de insignias.
  - **Motivo:** Solicitud del usuario de mantener imagen de fondo con parallax, sin botones duplicados ni marcos toscos.
  - **Impacto:** Fluidez visual continua y eliminación de ruido en pantalla.

- **[2026-10-07 | v1.8.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Eliminación de barra superior fija, controles flotantes minimalistas, arte líquido hiperdefinido y gradación dinámica de color por tema.
  - **Motivo:** Requerimiento del usuario para un lienzo continuo sin cortes horizontales.
  - **Impacto:** Fluidez y estética cinematográfica.

- **[2026-10-07 | v1.9.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Remoción definitiva de barra/dock inferior, integración de escultura de arte fluido 3D hiperdefinido y motor de partículas reactivo (`authParticles.js`) en el fondo del formulario.
  - **Motivo:** Solicitud del usuario para eliminar toda barra residual y ambientar "Bienvenido de nuevo" con partículas.
  - **Impacto:** Interfaz 100% limpia y futurista.

- **[2026-10-07 | v2.0.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Supresión del borde de 1px e intento preliminar de difuminado.
  - **Motivo:** Solicitud del usuario para eliminar la separación dura entre paneles.
  - **Impacto:** Eliminación de la línea sólida.

- **[2026-10-07 | v2.1.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:** Disolución alfa Hermite de 190px y halo perimetral tenue sin filtros de blur locales.
  - **Motivo:** Eliminación de la franja borrosa para lograr una mezcla natural y fotográfica.
  - **Impacto:** Transición limpia y continua.

- **[2026-10-07 | v2.2.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:**
    1) **Eliminación del Blanco Hospitalario Cegador**: Se retiró el `#ffffff` directo del fondo del formulario y la vista general en Modo Claro.
    2) **Adopción de Paleta Editorial Alabastro Cálido (`#f4f1ea`)**: Tono mate antideslumbrante estilo algodón 240g/papel de autor que descansa la vista y resalta los campos de entrada sin quemar los ojos.
    3) **Selector Flotante de Tonalidades Claras en Vivo**: Se integraron 3 micro-chips junto al selector de tema para probar en tiempo real: 1) *Alabastro Cálido* (`#f4f1ea`), 2) *Titanio Platino* (`#edf1f7`) y 3) *Perla Amatista* (`#f2eff7`), con persistencia en `localStorage`.
  - **Motivo:** Solicitud explícita del usuario: *"¿Podemos probar otros tonos claros? Es que siento que es muy blanco y me ciega"*.
  - **Impacto:** Confort visual absoluto, cero fatiga ocular y estética editorial de alta costura.

- **[2026-10-07 | v2.3.0] Por [Frontend 3D & Orchestrator]:**
  - **Cambio:**
    1) **Resolución Definitiva del Bug F5 (Recarga en Login/Registro)**: Se agregó la detección inmediata en `<head>` de `index.html` para aplicar la clase `.route-auth` al elemento raíz `<html>` antes del primer render de pintura del navegador.
    2) **Reglas de Pintura Inmediata en CSS**: Definición de `html.route-auth #landing-view { display: none !important; }` y `html.route-auth #auth-view { display: flex !important; opacity: 1 !important; }` con prioridad de capa (`z-index: 6000`), eliminando cualquier parpadeo o caída a la landing page ("Inicio").
    3) **Ciclo de Vida Limpio en `main.js` & `appRouter.js`**: `checkInitialRoute()` se ejecuta tras el enlace del controlador `AuthFullscreenView`, garantizando que `switchTab` responda con el controlador instanciado y restaurando con fidelidad 1:1 el formulario activo (Login o Crear Cuenta).
    4) **Sincronización Bidireccional de Pestañas**: `switchTab()` actualiza en tiempo real tanto `history.replaceState` (`#login` / `#registro`) como `sessionStorage.setItem('shirt_auth_tab')`.
  - **Motivo:** Solicitud del usuario: *"cuando doy F5 estando desde el login, me muestra la pestaña de inicio, lo que no tiene mucho sentido realmente"*.
  - **Impacto:** Persistencia robusta de estado tras refrescar con F5, 0 errores en consola y navegación predecible.

- **[2026-10-07 | v2.4.0] Por [UI/UX Designer & Frontend 3D]:**
  - **Cambio:**
    1) **Fijación Oficial de Alabastro Cálido Atelier (`#f4f1ea`)**: Se consagró definitivamente el tono Alabastro Cálido como el fondo único y permanente del modo claro para la vista de autenticación.
    2) **Retiro de Micro-Chips Flotantes de Tonalidad**: Se removió el selector de tres puntos (`.light-tone-picker`, `.btn-tone-dot`) tanto de la plantilla HTML (`authFullscreenTemplates.js`) como de la lógica del controlador (`authFullscreenView.js`) y del CSS (`authFullscreen.css`), conservando únicamente el botón circular flotante de cambio entre Modo Oscuro y Claro.
  - **Motivo:** Solicitud explícita del usuario: *"deja el alabastro y quita los botoncitos mejor"*.
  - **Impacto:** Interfaz minimalista, reducción de código superfluo y confort visual garantizado en modo claro sin elementos distractores.

- **[2026-10-07 | v2.4.1] Por [UI/UX Designer & Senior Frontend]:**
  - **Cambio:** `src/ui/userProfileMenu.js`: el botón `#btn-open-login` reemplaza el emoji 👤 por un SVG `.nav-login-icon` y envuelve el texto en `.nav-login-label` (permite modo solo-icono en pantallas estrechas).
  - **Motivo:** Alineación óptica del icono y consistencia con el rediseño de la Navbar (NODE-015 v1.5.0).
  - **Impacto:** Sin cambios de lógica ni de IDs. Los estilos de `.nav-user-chip` en `auth.css` no se tocaron; la navbar los acota bajo `.landing-nav`.

- **[2026-10-08 | v2.5.0] Por [Frontend & QA Auditor]:**
  - **Cambio:** Sin cambios de código en este nodo. El Auth Gate del checkout (NODE-024, `src/ui/orderAuthGate.js`) abre `authModal.open('login' | 'register')` y `checkoutOrderFlow.js` se suscribe con `authService.subscribe` para retomar el borrador `shirt_pending_order_draft` en la transición anónimo → autenticado. Se documenta un hallazgo abierto: `src/ui/authFullscreenView.js` no coincidía con `authService`.
  - **Motivo:** El flujo de pedido depende de que registrarse o iniciar sesión funcione; por eso el Auth Gate usa el modal, que sí es compatible con el servicio.
  - **Impacto:** Registrado para corrección inmediata.

- **[2026-10-08 | v2.5.1] Por [Orchestrator & Fullstack 3D]:**
  - **Cambio:** 
    1) Corrección integral de `src/ui/authFullscreenView.js`: las llamadas a `authService.login({ email, password })`, `authService.register({ ... })` y `authService.complete2faLogin(userId, otp)` ahora usan las firmas correctas de objeto y bloques `try/catch`. 
    2) Enriquecimiento de `src/ui/userProfileMenu.js`: se incorporó el botón `#btn-dropdown-orders` ("📦 Mis Pedidos") dentro del menú desplegable del usuario logueado en la Navbar, conectado a `openOrdersModal()`.
  - **Motivo:** Alinear al 100% la pantalla completa de login/registro con `authService` y permitir al usuario acceder a su historial de pedidos y pagos desde cualquier lugar de la tienda.
  - **Impacto:** Vista fullscreen totalmente funcional y accesible; experiencia de usuario completa y robusta. Build pasa con 0 errores.

- **[2026-10-08 | v2.6.0] Por [UI/UX Designer, Frontend 3D & Backend/Legal Engineer]:**
  - **Cambio:** (1) Rediseño del dropdown de cuenta (`userProfileMenu.js`, 194 líneas): encabezado VIP (avatar con gradiente atelier o foto de Google, nombre y correo escapados con `escapeHtml`), tarjeta "Seguridad 2FA Telegram" con contraste reparado y píldora `✓ ACTIVO` / `✕ INACTIVO`, y cinco acciones con iconos SVG (`data-action`: `open-profile`, `open-orders`, `toggle-2fa`, `open-terms`, `logout`). Se conservan los ids `btn-dropdown-orders`, `btn-toggle-2fa`, `btn-logout` y el flujo 2FA existente. El chip es accesible por teclado (Enter/Espacio, Esc cierra, `aria-expanded`). (2) Las reglas del dropdown salen de `auth.css` (288 → 234 líneas) hacia el nuevo `src/styles/userMenu.css` (tokens `--um-*`, claro/oscuro, anclaje `fixed` en ≤560 px). (3) `authService.updateUserProfile()` persiste nombre, celular, ciudad, dirección y notas en `shirt_studio_users_v1` y en la sesión `shirt_studio_session_v1`, y notifica a los suscriptores (la navbar refresca el nombre sin recargar). Validación pura en `src/services/profileValidation.js`.
  - **Motivo:** Requerimiento de usuario: el texto de la tarjeta 2FA era casi ilegible, los emojis se recortaban y el cliente no tenía dónde editar sus datos de contacto y despacho.
  - **Impacto:** El requerimiento nombraba las llaves `shirt_current_user` / `shirt_users_db`, pero el proyecto usa `shirt_studio_session_v1` / `shirt_studio_users_v1`; se respetaron las reales para no abandonar las sesiones existentes. El correo es de solo lectura (es la llave de acceso y de propiedad de los pedidos). `authService.js` queda en 274 líneas (> 250 recomendadas por CLAUDE.md): candidato a modularizar. Ver NODE-025.

- **[2026-10-08 | v2.7.0] Por [UI/UX Designer, Frontend 3D & Backend/Legal Engineer]:**
  - **Cambio:** `userProfileMenu.js` (198 líneas) queda con las 6 opciones pedidas, con iconos SVG y `data-action`: Mi Perfil & Datos de Envío (`open-profile`), **Mi Bóveda de Diseños** (`open-vault`, nueva: `openVaultModal({ router })`), Mis Pedidos (`open-orders`), 2FA Telegram (`toggle-2fa`), Términos & Propiedad Intelectual (`open-terms`) y Cerrar Sesión (`logout`). `init()` llama a `warmLegalTermsModal()` para que el visor de TyC ya esté montado al abrirlo. Nuevos iconos en `uiIcons.js` (vault, shirt, palette, download, upload, trash, lock, globe).
  - **Motivo:** Requerimiento de usuario: acceso a la Bóveda desde el menú de cuenta y apertura instantánea de los TyC.
  - **Impacto:** Se conservan los ids `btn-dropdown-orders`, `btn-toggle-2fa` y `btn-logout` y el flujo 2FA. La etiqueta de la fila 2FA sigue siendo contextual ("Configurar" / "Desactivar 2FA Telegram"); la tarjeta de estado conserva "Seguridad 2FA Telegram". Ver NODE-025 v1.1.0 y NODE-026 v1.0.0.

- **[2026-10-08 | v2.8.0] Por [Lead 3D Engineer, UI/UX Designer & Frontend WebGL / Backend Specialist]:**
  - **Cambio:** **Alias único `@usuario`.** Se guarda en minúscula y sin arroba (`[a-z0-9_.]`, 3–20, empieza y termina alfanumérico, lista de reservados como `admin`). Al registrarse (correo o Google) se autogenera desde el correo (`pepito@gmail.com` → `@pepito`; si está tomado, `pepito2`…). Las cuentas existentes sin alias se migran en el constructor de `AuthService` (`migrateAliases`). `updateUserProfile` delega en `profileUpdate.js`, valida unicidad contra las demás cuentas y, si el alias cambió, llama a `renameVaultAuthor` para que los diseños de la Bóveda y el Lookbook muestren el nombre nuevo. Para mantener `authService.js` en 251 líneas se extrajeron `jwtDecode.js`, `profileUpdate.js` y `finishLogin(user)` (lógica común de 2FA/sesión). `userProfileMenu.js` (200) muestra el chip `.nav-user-alias` en la barra (oculto ≤ 720 px) y `.um-alias` en el dropdown.
  - **Motivo:** Requerimiento de usuario: identidad pública de autor para la Bóveda comunitaria.
  - **Impacto:** Verificado en Chromium: migración de 3 cuentas antiguas con alias únicos (`laura.gomez`, `laura.gomez2`, `admin2`), alias reservado rechazado, duplicado rechazado, chip y dropdown se actualizan al guardar. La unicidad es LOCAL (usuarios de este navegador, sin backend): dos navegadores distintos pueden elegir el mismo alias. `updateUserProfile` lanza un `Error` con el mensaje de validación (alias en uso, reservado, formato). `npm run build` NO se pudo ejecutar en este entorno (sin acceso al registro npm): ejecútalo localmente.
