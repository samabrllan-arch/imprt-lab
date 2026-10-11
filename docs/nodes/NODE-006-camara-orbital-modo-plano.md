# [NODE-006]: Cámara Orbital & Transición Modo Plano
- **Tipo:** Camera / Controls / WebGL
- **Estado:** Activo
- **Responsable:** Frontend (3D WebGL)

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** NODE-001 (Store), NODE-005 (Engine 3D)
- **Nodos de Salida (Alimenta a):** NODE-005 (Scene Loop), NODE-007 (CanvasDragController), NODE-009 (View Switcher)
- **Contratos / Métodos expuestos:**
  - `src/three/camera.js`:
    - `flyToView(viewName)`: Transición cinemática esférica (frente, espalda, cuello, mangas).
    - `setFlatMode(enabled, activeView)`: Bloquea OrbitControls y alinea la cámara ortogonalmente a 0° o 180° para permitir arrastre 2D directo.
    - `setAutoRotate(enabled)`: Giro continuo de exhibición.

### 📦 Responsabilidad Técnica
Gestionar la cámara en perspectiva, la interpolación esférica de posiciones, los límites de zoom orbital y la transición hacia el modo plano extendido.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Frontend:**
  - **Cambio:** Integración al Context Graph.
  - **Motivo:** Clarificar el punto exacto donde se bloquea la órbita al pasar a Modo Plano.
  - **Impacto:** Permite al usuario interactuar con la prenda como si fuera un lienzo de diseño sin que la cámara se desplace involuntariamente.

- **[2026-10-06 | v1.1.0] Por Frontend 3D Engineer:**
  - **Cambio:** Optimización del factor de interpolación orbital de cámara en `CameraManager.update` (tasa aumentada de `delta * 5.5` a `delta * 14.0`, acotado a un paso máximo de 0.45).
  - **Motivo:** El cambio entre vistas Frente, Espalda y Libre se percibía demasiado lento y aletargado (~2.5 segundos de retraso).
  - **Impacto:** Conmutación ultra ágil y fluida (~300ms) sin tirones visuales, manteniendo amortiguación suave.
