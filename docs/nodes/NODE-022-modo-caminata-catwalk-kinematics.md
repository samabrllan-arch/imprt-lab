# [NODE-022]: Modo Caminata 3D & Simulación Textil (Catwalk Kinematics)
- **Tipo:** WebGL Engine / Animation / Shader Simulation
- **Estado:** Activo (Banco de Pruebas Aislado en `caminata.html`)
- **Responsable:** Frontend (Senior 3D WebGL Engineer) & QA

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-012 (Modelos GLB Draco `shirt_clo_draco.glb` & `shirt_woman_seam_draco.glb`), NODE-002 (Colores de tela en `colors.js`)
- **Nodos de Salida (Alimenta a):** Entorno de pruebas `caminata.html` (futura integración opcional a NODE-005)
- **Contratos / Módulos expuestos:**
  - `src/walk/walkShader.js`: Hook de vertex shader sobre `MeshStandardMaterial` para deformación aerodinámica, inercia de caída de tela y micro-pliegues de zancada.
  - `src/walk/runwayScene.js`: Escena Three.js con pasarela deslizante sincronizada, sombras de contacto reactivas e iluminación PBR de pasarela.
  - `src/walk/textureRenderer.js`: Compositor 2D de texturas UV (2048x2048) con renderizado dinámico de color base y estampados frente/espalda.
  - `src/walk/walkKinematics.js`: Modelo cinemático de locomoción humana (rebote vertical pélvico, bamboleo roll/yaw/pitch y pulso por BPM).
  - `src/walk/walkApp.js`: Orquestador principal del laboratorio interactivo.

### 📦 Responsabilidad Técnica
Proveer un entorno aislado de alta fidelidad para simular el comportamiento visual y cinemático de una prenda de vestir en movimiento (pasarela de moda / caminata urbana), permitiendo evaluar la caída de la tela y la proyección de estampados en movimiento sin comprometer el código de la tienda principal.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-08 | v1.0.0] Por Frontend 3D & QA:**
  - **Cambio:** Creación del laboratorio independiente `caminata.html` y suite modular en `src/walk/` (`walkShader.js`, `runwayScene.js`, `textureRenderer.js`, `walkKinematics.js`, `walkApp.js`, `caminata.css`).
  - **Motivo:** Petición del usuario para explorar un "modo caminata" en siluetas de hombre y mujer de forma aislada sin riesgo de alterar el código en producción.
  - **Impacto:** Permite al usuario interactuar a 60 FPS con órbita 360°, probar ambas siluetas (Hombre y Mujer), cambiar colores (Washed Terracotta default), aplicar estampados (Goku, Rick & Morty, Oni, o propios) y ajustar sliders de cadencia, rebote, bamboleo, inercia y viento.
