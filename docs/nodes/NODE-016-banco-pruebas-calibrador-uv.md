# [NODE-016]: Banco de Pruebas & Calibrador UV Aislado
- **Tipo:** QA Suite / Test Bench
- **Estado:** Activo
- **Responsable:** QA / Frontend (3D WebGL)

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-004 (TextureComposer), NODE-012 (Modelos GLB)
- **Nodos de Salida (Alimenta a):** NODE-004 (TextureComposer: ajuste empírico de coordenadas), NODE-012 (Auditoría de mallas)
- **Contratos / Módulos expuestos:**
  - `test.html`: Interfaz aislada sin sobrecarga de estilos para calibración visual milimétrica.
  - `src/testApp.js`: Controlador directo con sliders numéricos de coordenadas X/Y para pecho y espalda en modelos de hombre y mujer.

### 📦 Responsabilidad Técnica
Proveer un banco de calibración técnica de alta precisión para aislar problemas de proyección UV, texturizado WebGL y geometrías 3D sin interferencia del estado global ni del resto de la interfaz de usuario.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-07 | v1.3.0] Por QA & Frontend 3D:**
  - **Cambio:** Integración de `shirt_woman_seam_draco.glb` (Opción 2: Seam Unwrap en Blender) como opción predeterminada primaria en `test.html` y `src/testApp.js`. Botón verde esmeralda `✨ Mujer Opción 2 (Seam Unwrap - Por Costuras)`, selector de vistas de cámara Frente/Espalda, y calibración de centros UV en `(564, 1220)` frontal y `(1536, 1220)` espalda.
  - **Motivo:** Permitir al usuario inspeccionar en vivo la solución de mapeo conforme en la silueta entallada femenina frente a la versión anterior con distorsión planar.
  - **Impacto:** Cero distorsión lateral en pliegues a 60 FPS.

- **[2026-10-05 | v1.1.0] Por QA & Frontend 3D:**
  - **Cambio:** Calibración milimétrica en banco de pruebas para el modelo femenino `shirt_woman_draco.glb` (Meshy). Determinación de centros ópticos: Pecho Central `(x: 548, y: 1220)`, Logo Pecho `(x: 420, y: 1100)` y Espalda `(x: 1536, y: 1220)`.
  - **Motivo:** Asegurar proyección plana sin deformación en silueta slim.
  - **Impacto:** Verificación visual exitosa a 60 FPS sin artefactos ni recortes.

- **[2026-10-06 | v1.2.0] Por QA & Frontend 3D:**
  - **Cambio:** Actualización integral del banco de pruebas (`test.html`, `testApp.js`). Integración del modelo comprimido Draco `shirt_woman_fitted_draco.glb` (Opción 1: silueta femenina basada en patronaje CLO3D), subida libre de imágenes del usuario (`input[type=file]`), selector de color de camiseta (Negro, Vinotinto, Blanco) y comparación interactiva de 3 vías: `Hombre CLO3D`, `Mujer Opción 1 CLO3D (Cero Láser)` y `Mujer Meshy (Con Láser)`.
  - **Motivo:** Permitir al usuario verificar visualmente y en tiempo real la eliminación del efecto láser en pliegues laterales antes de migrar el estudio principal.
  - **Impacto:** Banco de pruebas 100% interactivo, aislado y libre de riesgos.

- **[2026-10-05 | v1.0.0] Por QA:**
  - **Cambio:** Incorporación al Context Graph.
  - **Motivo:** Servir como entorno de diagnóstico prioritario para comprobar correcciones en el modelo femenino y proyecciones UV.
  - **Impacto:** Permite verificar mallas y texturas en menos de 5 segundos.
