# 📐 Arquitectura de Posicionamiento, Recorte (Clipping) y Arrastre en Modo Plano

Documento técnico para auditoría e integración (verificado y preparado para análisis con Claude Sonnet 3.5).

---

## 📋 Resumen del Flujo y Problema Analizado

1. **Problema Reportado:**
   - En la silueta femenina (`shirt_woman_draco.glb`), el estampado se cortaba con una línea horizontal recta al intentar subirlo hacia el cuello/pecho alto (a la altura de las axilas), tanto en la aplicación principal (`/#estudio`) como en el banco de pruebas (`/test.html`).
   - La silueta masculina (`shirt_clo_draco.glb`) funciona correctamente con amplio rango vertical hacia el cuello.
   - En el **Modo Plano** (`viewMode === 'flat'`), se requiere conocer la cadena completa de archivos reales que capturan el clic, orientan la cámara y trasladan el estampado.

---

## 🗂️ Mapa de Archivos Reales Intervinientes

| # | Archivo | Rol Principal | Componente / Capa |
|---|---|---|---|
| **1** | [`src/config/zones.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/config/zones.js) | Coordenadas UV base por silueta y límites permitidos | Capa 1: Configuración |
| **2** | [`src/state/actions.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/state/actions.js) | Mutación de estado reactivo y clamps de seguridad (`offsetY`) | Capa 1: Estado Central |
| **3** | [`src/textures/textureComposer.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/textures/textureComposer.js) | Generación de la textura 2D en Canvas, recorte `ctx.clip()` y pintado | Capa 3: Texturas UV |
| **4** | [`src/three/canvasDragController.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/three/canvasDragController.js) | Captura de eventos del ratón para arrastre interactivo en Modo Plano | Capa 2: Motor 3D & WebGL |
| **5** | [`src/ui/decalControls.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/ui/decalControls.js) | Sliders numéricos de Posición X/Y, Escala y Rotación | Capa 4: UI Components |
| **6** | [`src/three/camera.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/three/camera.js) | Método `setFlatMode()`: bloquea rotación orbital y encuadra la vista frontal/espalda fija | Capa 2: Motor 3D & WebGL |
| **7** | [`src/three/engine.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/three/engine.js) | Conecta el evento reactivo `viewMode === 'flat'` con `cameraManager.setFlatMode()` | Capa 2: Motor 3D & WebGL |
| **8** | [`src/ui/viewSwitcher.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/ui/viewSwitcher.js) | Botones de la barra flotante inferior (`[3D]` vs `[Plano]`, `[Frente]`, `[Espalda]`) | Capa 4: UI Components |
| **9** | [`test.html`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/test.html) / [`src/testApp.js`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/src/testApp.js) | Entorno aislado de calibración directa de coordenadas UV | Banco de Pruebas |
| **10** | [`public/models/shirt_woman_draco.glb`](file:///c:/Users/samab/OneDrive/Documentos/Camisas/public/models/shirt_woman_draco.glb) | Malla 3D y coordenadas UV nativas de la silueta femenina | Assets 3D |

---

## 🔍 Detalle Técnico por Archivo

### 1. `src/config/zones.js`
- **Ubicación:** Define la matriz de áreas para el canvas de 2048×2048 píxeles.
- **Variables Clave:**
  ```javascript
  // Zona frontal:
  canvasAreaBySilhouette: {
    man: { x: 548, y: 720, width: 440, height: 440 },
    woman: { x: 548, y: 1530, width: 380, height: 380 }
  },
  limits: { minScale: 0.2, maxScale: 2.5, minOffset: -1.8, maxOffset: 1.5 }
  ```
- **Responsabilidad:** Proporciona el punto central `(x, y)` inicial sobre el cual se suman los desplazamientos (`offsetX`, `offsetY`).

---

### 2. `src/state/actions.js`
- **Ubicación:** Despachador de acciones reactivas del store.
- **Código Clave:**
  ```javascript
  export function updateDecalTransform(zoneId, { scale, offsetX, offsetY, rotation }) {
    const state = store.getState();
    const zone = state.customizations[zoneId];
    if (!zone) return;

    if (scale !== undefined) zone.scale = Math.max(0.2, Math.min(2.5, scale));
    if (offsetX !== undefined) zone.offsetX = Math.max(-1.5, Math.min(1.5, offsetX));
    if (offsetY !== undefined) zone.offsetY = Math.max(-1.5, Math.min(1.5, offsetY));
    if (rotation !== undefined) zone.rotation = ((rotation % 360) + 360) % 360;

    store.notify(`transform:${zoneId}`);
  }
  ```
- **Responsabilidad:** `offsetY` está restringido estrictamente por `Math.max(-1.5, Math.min(1.5, offsetY))`. Si un slider o un arrastre intenta enviar un valor fuera de ese rango, esta función lo bloquea.

---

### 3. `src/textures/textureComposer.js`
- **Ubicación:** Ensambla la textura completa que Three.js mapea sobre la prenda 3D.
- **Código de Recorte (Clipping) y Posición:**
  ```javascript
  drawDecal(ctx, decal, area, silhouette = 'man') {
    const img = decal.imageElement;
    if (!img) return;

    ctx.save();

    // 1. MÁSCARA DE RECORTE:
    // Si este rectángulo es pequeño, corta el diseño en una línea horizontal recta:
    ctx.beginPath();
    ctx.rect(
      area.x - area.width * 0.90,
      area.y - area.height * 2.20,
      area.width * 1.80,
      area.height * 4.40
    );
    ctx.clip();

    // 2. DIRECCIÓN VERTICAL:
    // Ajuste de signo según la orientación de las coordenadas UV:
    const isWoman = silhouette === 'woman';
    const vertSign = isWoman ? -1 : 1;
    const centerX = area.x + decal.offsetX * (area.width * 0.42);
    const centerY = area.y + (decal.offsetY * vertSign) * (area.height * 0.50);

    // 3. TRANSFORMACIÓN:
    ctx.translate(centerX, centerY);
    ctx.scale(1, -1); // Compensación de Three.js flipY
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);

    ctx.restore();
  }
  ```
- **Responsabilidad:** Es el lugar donde ocurre el corte visual (`ctx.clip()`) si el diseño rebasa los límites definidos.

---

### 4. `src/three/canvasDragController.js` (Arrastre del Mouse)
- **Ubicación:** Controlador de arrastre por puntero sobre el lienzo WebGL.
- **Mecanismo en Modo Plano:**
  ```javascript
  const onPointerDown = (e) => {
    const state = store.getState();
    const isFlat = state.viewMode === 'flat';
    const isDragAllowed = isFlat || e.altKey || e.shiftKey;
    if (!isDragAllowed) return;

    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.initOffsetX = activeDecal.offsetX || 0;
    this.initOffsetY = activeDecal.offsetY || 0;
  };

  const onPointerMove = (e) => {
    if (!this.isDragging) return;
    const state = store.getState();
    const rect = this.container.getBoundingClientRect();
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    const scaleFactor = 2.4 / (rect.height || 600);
    const isBack = state.activeView === 'back';

    const newX = this.initOffsetX + (isBack ? -deltaX : deltaX) * scaleFactor;
    const newY = this.initOffsetY + deltaY * scaleFactor;

    const clampedX = Math.max(-1.5, Math.min(1.5, newX));
    const clampedY = Math.max(-1.8, Math.min(1.4, newY));

    updateDecalTransform(state.activeZone, {
      offsetX: clampedX,
      offsetY: clampedY
    });
  };
  ```
- **Responsabilidad:** Permite al usuario arrastrar el estampado libremente con el mouse cuando la prenda está en vista plana extendida.

---

### 5. `src/ui/decalControls.js`
- **Ubicación:** Componente UI de la barra lateral de edición.
- **Sliders de Posición:**
  ```html
  <input type="range" id="posx-slider" min="-1.4" max="1.4" step="0.02" value="${decal.offsetX}" class="range-slider" />
  <input type="range" id="posy-slider" min="-1.8" max="1.4" step="0.02" value="${decal.offsetY}" class="range-slider" />
  ```
- **Responsabilidad:** Escucha el evento `input` y envía `updateDecalTransform(zoneId, { offsetY: val })`.

---

### 6. `src/ui/viewSwitcher.js` (Barra Flotante Inferior)
- **Ubicación:** Barra dock inferior con botones `[Frente]`, `[Espalda]`, `[Libre 360°]`, y los modos `[3D]` y `[Plano]`.
- **Código Clave:**
  ```javascript
  const modeBtns = container.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode'); // '3d' o 'flat'
      setViewMode(mode);
    });
  });
  ```
- **Responsabilidad:** Dispara `setViewMode('flat')` al hacer clic en el botón `[Plano]`.

---

### 7. `src/three/engine.js` y `src/three/camera.js` (Cámara en Modo Plano)
- **En `src/three/engine.js`:**
  ```javascript
  if (changeKey === 'viewMode') {
    const isFlat = state.viewMode === 'flat';
    this.cameraManager.setFlatMode(isFlat, state.activeView);
  }
  ```
- **En `src/three/camera.js` (`setFlatMode`):**
  ```javascript
  setFlatMode(enabled, activeView = 'front') {
    this.isFlatMode = enabled;
    this.controls.enableRotate = !enabled; // Desactiva la órbita libre 360°
    if (enabled) {
      const isBack = activeView === 'back';
      this.targetRadius = 2.20;
      this.targetTheta = isBack ? Math.PI : 0;
      this.targetPhi = Math.PI * 0.50; // Orientación perpendicular frontal plana
      this.targetTargetY = 0.0;
      this.isTransitioning = true;
    }
  }
  ```
- **Responsabilidad:** Al cambiar a Modo Plano, congela la rotación 3D para que el usuario pueda hacer clic y arrastrar el estampado como si fuera un editor 2D.

---

### 8. Banco de Pruebas: `test.html` y `src/testApp.js`
- **Ubicación:** Calibrador aislado para comprobar la textura en GPU sin pasar por la UI completa.
- **Código Clave:**
  ```javascript
  const coords = {
    man: { chest: { x: 548, y: 720, scale: 1.0 }, back: { x: 1536, y: 720, scale: 1.0 } },
    woman: { chest: { x: 548, y: 1530, scale: 0.9 }, back: { x: 1530, y: 1530, scale: 0.9 } }
  };
  ```

---

### 9. Geometría 3D: `public/models/shirt_woman_draco.glb`
- **Detalle de la Malla y UVs:**
  - El torso frontal de la prenda femenina está mapeado entre `Z = -0.92` (ruedo) y `Z = +0.41` (pecho alto / base de clavícula).
  - Por encima de `Z = +0.41` (el cuello/ribete y escote superior), los vértices tienen sus coordenadas UV colapsadas a `(0.5, 0.05)`.
  - Esta característica física de la malla determina el límite absoluto donde la textura 2D se proyecta sobre el modelo tridimensional.
