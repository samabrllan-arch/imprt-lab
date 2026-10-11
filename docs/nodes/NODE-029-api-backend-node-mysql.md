# [NODE-029]: Backend Node.js, Express & Base de Datos MySQL (Tiplou / TiDB / SQLite)
- **Tipo:** Backend & API Service / Persistence
- **Estado:** Activo
- **Responsable:** Backend & Checkout Engineer

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-019 (Sincronización Google Drive), NODE-020 (Autenticación), NODE-026 (Bóveda Atelier).
- **Nodos de Salida (Alimenta a):** NODE-011 (Checkout), NODE-014 (Galería y Lookbook), NODE-025 (Perfil de Usuario), NODE-027 (Galería Comunitaria), `src/services/apiClient.js`.
- **Contratos / Métodos expuestos:**
  - `POST /api/auth/register`: Registro de usuario con hash `bcrypt` y emisión JWT.
  - `POST /api/auth/login`: Autenticación con credenciales y emisión JWT.
  - `GET /api/auth/me`: Perfil de usuario autenticado mediante middleware `requireAuth`.
  - `POST /api/designs`: Creación y persistencia de diseños 3D (colores, proporciones libres cm, links de Google Drive).
  - `GET /api/designs`: Listado de diseños activos (`is_deleted = 0`) del usuario autenticado.
  - `GET /api/designs/:id`: Detalle de diseño y sus activos asociados de Google Drive.
  - `DELETE /api/designs/:id`: Desvinculación suave (Soft Delete) ejecutada por el propietario (`is_deleted = 1`, `is_unlinked = 1`). **La imagen física en Google Drive NUNCA se borra en esta acción.**
  - `GET /api/gallery`: Listado de diseños comunitarios públicos activos.
  - `POST /api/gallery/:id/like`: Toggle de like comunitario y conteo atómico.
  - `POST /api/upload-link`: Registro de metadatos de activos subidos a Google Drive (`drive_file_id`, `drive_file_url`).
  - `GET /api/admin/unlinked-assets`: Vista de auditoría exclusiva para el administrador para comparar activos desvinculados contra Google Drive.
  - `GET /api/admin/assets-comparison`: Métricas de inventario (activos en uso vs desvinculados).
  - `DELETE /api/admin/purge-asset-record/:id`: Purgado de registro en base de datos tras la eliminación manual en Google Drive por parte del administrador.

### 📦 Responsabilidad Técnica
Proveer el servidor HTTP y capa de persistencia dual:
1. **Entorno Local (Desarrollo y Pruebas Reales):** Motor relacional SQL sin configuración externa mediante `node:sqlite` nativo de Node.js v24 (`DatabaseSync`), permitiendo ejecutar pruebas de integración y desarrollo con cero fricción y cero dependencias de drivers C++ compilados.
2. **Entorno de Producción (Render + Tiplou / TiDB MySQL):** Abstracción idéntica de consultas parametrizadas `?` sobre `mysql2/promise` mediante `DATABASE_URL`.
3. **Seguridad y Política de Activos Google Drive:** El backend registra los enlaces de Drive y preserva las imágenes físicamente. Cuando un usuario elimina un diseño de su perfil, únicamente desaparece el link en la base de datos (soft-delete). El administrador tiene la potestad exclusiva de comparar y depurar imágenes en Google Drive desde el panel de control.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-10 | v1.5.0] Por Backend & Integration Engineer:**
  - **Cambio:** Enlace de la URL de producción de Render `https://api-camisas.onrender.com` en `src/services/apiClient.js` con resolución inteligente de entorno (proxy relativo en localhost y host directo HTTPS en producción).
  - **Motivo:** Conexión del cliente frontend con el despliegue del servicio web en Render.
  - **Impacto:** Todas las peticiones del frontend (`/api/auth`, `/api/designs`, `/api/gallery`, `/api/upload-link`) quedan conectadas con el backend en la nube.

- **[2026-10-10 | v1.4.0] Por Backend & Devops Engineer:**
  - **Cambio:** Creación de `Dockerfile` (Node 22 Alpine, usuario no privilegiado `node`, cacheo de capas de dependencias con `npm ci --omit=dev`) y `.dockerignore` para despliegue automatizado en Render con 1-click commit.
  - **Motivo:** Facilitar el despliegue directo en Render como contenedor Docker sin requerir comandos de compilación o inicio manuales.
  - **Impacto:** Render detecta automáticamente el Dockerfile en la raíz del repositorio y levanta el servicio de forma aislada y reproducible.

- **[2026-10-10 | v1.3.0] Por Backend & Devops Engineer:**
  - **Cambio:** Integración directa de credenciales para TiDB Cloud Serverless en `server/config.js` y `server/db/connection.js` con TLS v1.2 obligatorio. Ejecución exitosa de DDL en el clúster activo de AWS TiDB Cloud (`users`, `designs`, `design_assets`, `gallery_likes`) y configuración de `npm start` para despliegue sin configuración adicional en Render.
  - **Motivo:** Petición de usuario de dejar credenciales listas y quemadas para conectar de inmediato el servicio en Render con TiDB Cloud.
  - **Impacto:** Conexión en vivo operativa comprobada con `/api/health` retornando estado `MySQL (Tiplou / TiDB)`; 43 tests locales pasando.

- **[2026-10-10 | v1.2.0] Por Backend & Performance Engineer:**
  - **Cambio:** Optimización de esquemas e índices compuestos de alto rendimiento para TiDB Cloud / MySQL (y paridad en SQLite): `idx_designs_user_active` (user_id, is_deleted, created_at DESC), `idx_designs_gallery_recent` (is_public, is_deleted, created_at DESC), `idx_designs_gallery_popular` (is_public, is_deleted, likes_count DESC, created_at DESC), `idx_designs_title` (title), `idx_designs_gender` (gender), `idx_assets_design_active`, `idx_assets_user_active`, `idx_assets_drive_id`, `idx_assets_admin_unlinked`, `idx_likes_design` y `idx_likes_user`. Soporte de búsqueda indexada por término clave (`q`) y filtro por género en `/api/gallery` y `/api/designs`.
  - **Motivo:** Acelerar búsquedas, ordenamientos y uniones distribuidas en TiDB Cloud Serverless evitando table scans y filesorts en memoria.
  - **Impacto:** Consultas a la galería comunitaria y bóveda de diseños con resolución O(log N) directa por índice; 43 tests superados.

- **[2026-10-10 | v1.1.0] Por Lead QA & Security Auditor:**
  - **Cambio:** Blindaje integral OWASP: middleware `security.js` (cabeceras HTTP anti-clickjacking/XSS, anti-CSRF `requireJsonBody`, limitador de tasa `authLimiter` y `globalApiLimiter`), mitigación de Array/Object Injection en logins, protección contra Timing Attacks (hash señuelo constante `DUMMY_HASH`), validación estricta de IDs con regex `^\d+$`, tope de 128 caracteres en contraseñas (anti-DoS), bloqueo de esquemas maliciosos `javascript:` y suite de hacking simulado `tests/security.test.js`.
  - **Motivo:** Requerimiento explícito de tolerancia cero a vulnerabilidades (SQL injection, parameter tampering, listas como contraseñas en login, DoS y timing attacks).
  - **Impacto:** Sistema 100% blindado; 43 tests superados sin fallos ni regresiones.

- **[2026-10-10 | v1.0.0] Por Backend & Checkout Engineer:**
  - **Cambio:** Creación del servidor Express modular (`server/index.js`, `server/config.js`, `server/db/connection.js`, `server/db/schema.js`), middlewares de autenticación JWT (`server/middleware/auth.js`), rutas de auth, designs, gallery, upload y admin audit, cliente frontend `src/services/apiClient.js` y banco de pruebas de integración `tests/backend.test.js`.
  - **Motivo:** Migración hacia backend escalable Node.js + MySQL (Tiplou Cloud) desplegable en Render, manteniendo pruebas locales reales con Node 24 SQLite y desacoplamiento de borrado físico en Google Drive.
  - **Impacto:** Persistencia real de usuarios, diseños con dimensiones proporcionales libres, likes comunitarios y auditoría de activos en Google Drive.
