# [NODE-023]: Laboratorio de Preprensa DTF & Editor 3D Dual
- **Tipo:** Canvas Compositor / Image Processing / QA Suite / 3D Viewer
- **Estado:** Activo (Espacio de Pruebas Aislado en `dtf-lab.html`)
- **Responsable:** Frontend 3D Engineer & QA

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-012 (Modelos GLB Draco), NODE-002 (Paleta de Telas en `colors.js`)
- **Nodos de Salida (Alimenta a):** Entorno de pruebas `dtf-lab.html` (futura suite de preprensa industrial)
- **Contratos / Módulos expuestos:**
  - `src/dtf/dtfCoreAlgorithms.js`: Algoritmos puros de Choke separable (erosión horizontal/vertical), Knockout inteligente (`smoothstep`), Micro-Halftoning senoidal 2D (45/65/100 LPI), Simulación de planchado a 160°C y Auditoría pre-vuelo.
  - `src/dtf/dtf2dCanvas.js`: Mesa interactiva de trabajo 2D (arrastre, escala, rotación, composición de textura UV 2048x2048).
  - `src/dtf/dtf3dViewer.js`: Visor Three.js en vivo que refleja los cambios de posición y filtros en tiempo real sobre la silueta 3D (Hombre y Mujer).
  - `src/dtf/dtfLabApp.js`: Orquestador de controles, modal de diagnóstico y catálogo de drops.

### 📦 Responsabilidad Técnica
Permitir la experimentación y validación de técnicas avanzadas de preprensa textil DTF inspiradas en FlowGrafico conectadas con la manipulación espacial 2D del estampado y su proyección en tiempo real sobre el modelo 3D, garantizando que el código de producción de la tienda (`index.html`) permanezca 100% intacto y protegido.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-08 | v1.0.0] Por [Frontend 3D & QA]:**
  - **Cambio:** Creación del laboratorio independiente `dtf-lab.html` con arquitectura modular (`dtfCoreAlgorithms.js`, `dtf2dCanvas.js`, `dtf3dViewer.js`, `dtfLabApp.js`, `dtfLab.css`).
  - **Motivo:** Petición explícita del usuario para probar las herramientas de FlowGrafico en un espacio interactivo de pruebas entre el editor donde mueve la imagen y el estudio 3D sin tocar la lógica de producción existente.
  - **Impacto:** Permite al usuario mover y rotar el estampado, cambiar colores de camisa (Washed Terracotta default), alternar siluetas Hombre/Mujer, activar la Cama de Blanco con Choke ajustable (0 a 4 px), aplicar Knockout de negro para tacto cero, activar trama Micro-Halftone, simular planchado térmico y ejecutar diagnósticos pre-vuelo con semáforo de calidad.
