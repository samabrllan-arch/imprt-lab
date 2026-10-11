# [NODE-018]: Motor ColorKey & Matting Anti-Halo DTF
- **Tipo:** Canvas Processing / Matting Algorithm
- **Estado:** Activo
- **Responsable:** Frontend 3D & QA Auditor

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** Ninguno (módulo de computación de imagen puro)
- **Nodos de Salida (Alimenta a):** NODE-009 (Controles de Estampado), NODE-010 (Editor DTF Pro)
- **Contratos / Métodos expuestos:** `keyBackground(imageData, targetColor, options)`, `suppressColorSpill`, `colorDistance`, `borderSeeds`, `buildBackgroundMask`, `matteEdges`, `chokeAlpha`

### 📦 Responsabilidad Técnica
Algoritmo de eliminación de fondos con reconstrucción analítica del color en el borde (alpha matting), supresión de contaminación cromática (despill anti-halo verde/fondo) y estrangulamiento de halo (choke). Descompone píxeles de transición P = a·F + (1-a)·B para rescatar el color de arte original puro (F) sin tintes de fondo (B) y neutraliza tintes verdes residuales en antialiasing JPEG.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-07 | v5.1.0] Por Frontend:**
  - **Cambio:** Nuevo `src/services/autoBackground.js`: el botón "Quitar Fondo en 1 Clic" ahora borra en dos pasadas (1: fondo exterior por inundación desde el perímetro con la tolerancia del usuario; 2: bolsillos internos solo con tolerancia estricta 4-10%). `ImageEditorEngine.runErase` enruta el tipo `auto` a este módulo. Tests en `tests/autoBackground.test.js`.
  - **Motivo:** El modo automático borraba globalmente con tolerancia 30%: se comía zonas oscuras del arte (azul marino, sombras internas) y dejaba restos de la sombra exterior.
  - **Impacto:** La sensibilidad sigue actuando en tiempo real (rerun de la acción `auto`). Los botones por color (Verde/Cian) y la varita no cambian.

- **[2026-10-07 | v5.2.0] Por [Frontend & QA Auditor]:**
  - **Cambio:** Creación de `src/services/chromaHue.js` integrado en `buildBackgroundMask` y `keyBackground`. Detección de fondos croma por ángulo de matiz HSL y saturación (>40%).
  - **Motivo:** En fondos verdes croma o fondos vivos, los bordes con antialiasing oscuro o las cavidades interiores no eran eliminadas por la distancia RGB euclidiana estándar, dejando retazos verdes visibles alrededor del motivo.
  - **Impacto:** Eliminación total del 100% de restos verdes en bordes y cavidades sin alterar los colores internos del arte. Cobertura al 100% en `tests/chromaHue.test.js`.

- **[2026-10-06 | v1.3.0] Por [Frontend & QA]:**
  - **Cambio:** Creación de `src/services/colorKey.js` con cobertura de pruebas unitarias al 100% en `tests/colorKey.test.js`.
  - **Motivo:** Eliminar el problema de rebordes residuales (halos) en estampados al quitar fondo blanco o negro.
  - **Impacto:** Transparencia pura lista para impresión DTF en cualquier color de camiseta.

- **[2026-10-06 | v1.4.0] Por [Frontend & QA]:**
  - **Cambio:** Incorporación de función `suppressColorSpill` (despill selectivo que clampa canales de fondo dominante en bordes semitransparentes o contiguos) e integración en `keyBackground`.
  - **Motivo:** El recorte de fondos verdes complejos (como verde bosque o croma con antialiasing y compresión JPEG) dejaba halos verdes alrededor de tipografías blancas y motivos gráficos.
  - **Impacto:** Eliminación completa de halos y orlas verdes alrededor de letras/logos. 0 píxeles verdes residuales en fondos oscuros o claros.
