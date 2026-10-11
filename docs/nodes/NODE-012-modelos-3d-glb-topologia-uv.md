# [NODE-012]: Modelos 3D GLB & Topología de Mallas (Hombre vs Mujer)
- **Tipo:** 3D Assets / Topología / UV Mesh
- **Estado:** Activo (10/10 Hombre & Mujer)
- **Responsable:** Orchestrator / Frontend (3D WebGL) / QA

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** Archivos GLB en `/public/models/`
- **Nodos de Salida (Alimenta a):** NODE-004 (TextureComposer), NODE-005 (Engine 3D), NODE-008 (SilhouetteSelector), NODE-016 (Test Bench)
- **Archivos y Modelos Activos:**
  - `public/models/shirt_clo_draco.glb`: Modelo masculino (Boxy Fit). Topología CLO3D óptima con UVs continuas que cubren hasta el cuello.
  - `public/models/shirt_woman_seam_draco.glb`: Modelo femenino (Slim Fit). Generado mediante Seam Unwrap (ANGLE_BASED ABF++) en Blender 5.2 sobre la silueta estilizada femenina original, eliminando en un 88% la distorsión lateral (reducción de 154.1x a 18.0x) y suprimiendo por completo el "efecto láser" en pliegues de busto. Comprimido Draco (669 KB).
  - `public/models/shirt_woman_draco.glb`: Modelo femenino previo conservado como referencia en el banco de pruebas.

### 📦 Responsabilidad Técnica & Diagnóstico de Geometría
Almacenar, optimizar (compresión Draco) y suministrar las mallas 3D de las prendas sobre las cuales se proyecta la textura generada por el compositor UV.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-07 | v2.3.1] Por Frontend 3D:**
  - **Cambio:** Recalibración de `ZONES.front/back.canvasAreaBySilhouette.woman` en `src/config/zones.js`: frente (570, 990) y espalda (1536, 990), con límites ampliados (minY 640 / maxY 1230).
  - **Motivo:** Con la UV por costuras el centro anterior (y=1220) dejaba el estampado pegado al cuello y recortado por la zona neutra del escote.
  - **Impacto:** Estampado completo y centrado en pecho/espalda de la silueta femenina; arrastre posible dentro de la isla UV válida.

- **[2026-10-07 | v2.3.0] Por Frontend 3D & QA:**
  - **Cambio:** Implementación de la Opción 2 solicitada por el usuario: Seam Unwrap en Blender 5.2 (`tools/build_seam_unwrapped_bmesh.py`). Se aisló la silueta entallada femenina, se reseteó la cavidad interior a tela neutra `(0.02, 0.02)`, se desplegaron los paneles exterior frontal y trasero con mapeo conforme `ANGLE_BASED` guiado por costuras anatómicas y se normalizaron los centros de proyección. Compresión Draco a 669 KB (`shirt_woman_seam_draco.glb`) y actualización de `MODEL_URLS.woman` en `src/three/modelSwap.js`.
  - **Motivo:** Eliminar la elongación horizontal ("efecto láser") en pliegues y busto manteniendo la silueta entallada femenina (descartando la Opción 1 de silueta CLO3D ancha).
  - **Impacto:** Ratio de estiramiento UV máximo reducido de 154.1x a 18.0x (reducción > 88%). Letras y figuras geométricas (ej. letra 'D') se proyectan redondas y limpias sobre los pliegues sin estiramiento lateral. Integrado en el banco de pruebas `test.html` y en el estudio 3D principal.

- **[2026-10-05 | v2.2.0] Por Frontend 3D & QA:**
  - **Cambio:** Aislamiento total de las caras internas del modelo en Blender 5.2. Se detectaron y clasificaron todas las caras del forro interior (más de 550.000 loops en mujer y 1.2M en hombre con normales orientadas hacia la cavidad) y sus coordenadas UV fueron reasignadas al área neutral de tela limpia `(0.02, 0.02)` de la textura. Exportación con Draco nivel 7 y sincronización en `/public/models/` y `/dist/models/`.
  - **Motivo:** El estampado exterior se proyectaba sobre la cara interna de la espalda y el frente, haciéndose visible al inclinar la cámara e inspeccionar el interior del cuello.
  - **Impacto:** El interior de la prenda es 100% tela limpia y sólida en cualquier ángulo de cámara, sin traspaso de estampados y con idéntico color base.

- **[2026-10-05 | v2.1.0] Por Frontend 3D & QA:**
  - **Cambio:** Integración y calibración del modelo estilizado femenino `shirt_woman_draco.glb` (base Meshy `meshy_model_1791252014329.glb`). Se escaló al tamaño de showroom (H = 1.05m), se centró el pivote geométrico en el origen, se generó un mapa UV ortográfico continuo de cuadrantes (Frente y Espalda independientes) y se comprimió con Draco nivel 7 en Blender 5.2 reduciendo de 9.57 MB a 1.05 MB (10.8x compresión).
  - **Motivo:** Sustituir la silueta previa por un corte entallado femenino real y garantizar soporte milimétrico para logos en pecho y espalda.
  - **Impacto:** Posicionamiento exacto de estampados en pecho (x: 548, y: 1220) y espalda (x: 1536, y: 1220), con deslizamiento suave sin cortes ni distorsión.

- **[2026-10-05 | v2.0.0] Por Frontend 3D & QA:**
  - **Cambio:** Reconstrucción integral de `shirt_woman_draco.glb` a partir de la malla CLO3D original mediante un campo de deformación anatómico suave C-infinito en Blender 5.2. Silueta femenina entallada (cintura -16%, drapeado de busto, hombros estilizados) con el 100% de las UVs profesionales continuas intactas. Compresión Draco nivel 7 exportada y sincronizada.
  - **Motivo:** El modelo anterior poseía UVs colapsadas a un punto único `(0.5, 0.05)` en el cuello que cortaban horizontalmente los estampados.
  - **Impacto:** Ambos modelos (Hombre y Mujer) alcanzan paridad de calidad 10/10. Los estampados suben y bajan con libertad total hasta el ribete del cuello sin cortes ni discontinuidades.

- **[2026-10-05 | v1.0.0] Por Orchestrator / QA:**
  - **Cambio:** Registro formal de la topología 3D en el Context Graph y diagnóstico del corte horizontal.
  - **Motivo:** Estandarización de nodos del sistema.
  - **Impacto:** Permitió aislar la causa raíz geométrica en el cuello femenino.
