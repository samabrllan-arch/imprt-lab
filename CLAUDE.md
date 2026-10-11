# 🛡️ CLAUDE CODE INSTRUCTIONS & CONTEXT SYSTEM - 3D SHIRT STUDIO

Bienvenido a **3D Shirt Studio**, una aplicación web de personalización de camisetas streetwear en 3D (Three.js, WebGL y Canvas 2D).

---

## 📌 1. REGLAS CARDINALES OBLIGATORIAS (NUNCA ROMPER)

1. **PROHIBIDO POWERSHELL PARA I/O DE ARCHIVOS:**
   - En Windows, la redirección de PowerShell (`>`, `>>`, `Out-File`, `Set-Content`) corrompe la codificación UTF-8 (convierte a UTF-16LE o Windows-1252 y daña tildes y caracteres).
   - Usa herramientas nativas de lectura/escritura de Claude o comandos inline de Python con `encoding="utf-8"`:
     ```bash
     python -c "with open('archivo.txt', 'w', encoding='utf-8') as f: f.write('texto')"
     ```
2. **LÍMITE ESTRICTO DE 300 LÍNEAS POR ARCHIVO:**
   - Ningún archivo `.js`, `.css` ni `.html` puede exceder **300 líneas**.
   - Si un archivo se aproxima a 250 líneas, debe ser modularizado en submódulos de responsabilidad única.
3. **DOCUMENTACIÓN OBLIGATORIA EN EL CONTEXT GRAPH:**
   - Queda prohibido modificar código sin actualizar su nodo en `/docs/nodes/` y su fila en `/docs/CONTEXT_GRAPH.md`.
   - Cada cambio debe incluir un bloque de changelog con: Fecha, Versión, Rol, Cambio, Motivo e Impacto.

---

## 🗺️ 2. ARQUITECTURA DE CONTEXTO (CONTEXT GRAPH)

Para entender el sistema sin leer historiales de chat, consulta estos archivos:

- **Mapa Maestro de Módulos y Estados:**
  👉 [`docs/CONTEXT_GRAPH.md`](./docs/CONTEXT_GRAPH.md) — Índice tabular con los 21 nodos del sistema, sus dependencias y conexiones.
- **Definiciones Atómicas por Nodo (`/docs/nodes/`):**
  - `NODE-001`: Store Reactivo & Acciones (`src/state/`)
  - `NODE-002`: Paleta de Telas, Presets SVG & Materiales (`src/config/`)
  - `NODE-003`: Matriz de Costos & Precios en Vivo (`src/config/pricing.js`)
  - `NODE-004`: Compositor de Texturas UV & Clipping (`src/textures/textureComposer.js`)
  - `NODE-005`: Motor 3D Three.js & Render Loop (`src/three/`)
  - `NODE-006`: Cámara Orbital & Modo Plano (`src/three/camera.js`)
  - `NODE-007`: Arrastre Interactivo de Estampados (`src/three/canvasDragController.js`)
  - `NODE-008`: Selector de Silueta (Hombre vs Mujer) (`src/three/modelSwap.js`)
  - `NODE-009`: Controles de Transformación UI (`src/ui/decalControls.js`)
  - `NODE-010`: Editor de Imágenes & Varita Mágica (`src/ui/imageEditorEngine.js`)
  - `NODE-011`: Checkout & Resumen WhatsApp (`src/ui/checkoutModalView.js`)
  - `NODE-012`: Modelos 3D GLB & Topología UV (`public/models/`)
  - `NODE-013`: Enrutador de Vistas (`src/studio.js`)
  - `NODE-015`: Tokens Visuales Cyber-Luxury (`src/styles/tokens.css`)
  - `NODE-016`: Banco de Pruebas UV (`test.html`)
  - `NODE-017`: Motor de Dimensiones por Talla (`src/config/decalDimensions.js`)
  - `NODE-018`: Motor ColorKey & Matting DTF (`src/services/colorKey.js`)
  - `NODE-019`: Resolución 300 DPI (`src/services/printResolutionService.js`)
  - `NODE-020`: Autenticación 2FA Telegram (`src/services/authTelegramService.js`)
  - `NODE-021`: Laboratorio Gráfico & Photoshop (`photoshop-lab.html`, `src/ui/photoshopLab/`, `src/services/cutoutMask.js`, `src/services/imageEnhancerService.js`)
- **Reglamento del Sistema Multi-Agente:**
  👉 [`AGENTS.md`](./AGENTS.md) — Descripción de los 5 roles y definición de terminado (DoD).

---

## 🛠️ 3. COMANDOS ÚTILES

- **Servidor de Desarrollo:** `npm run dev` (Vite, puerto 3000)
- **Compilación de Producción:** `npm run build` (verifica tipos, empaquetado y cero errores)
- **Entrada Principal:** `http://localhost:3000/` (`index.html`)
- **Estudio Gráfico / Photoshop:** `http://localhost:3000/photoshop-lab.html`
- **Banco de Pruebas de Calibración:** `http://localhost:3000/test.html`

---

## 📌 4. FLUJO DE TRABAJO PARA CLAUDE CODE

1. **Leer antes de editar:** Consulta primero `docs/CONTEXT_GRAPH.md` y el `NODE-XXX` del módulo a tocar.
2. **Modificar código:** Respeta estrictamente el límite de 300 líneas.
3. **Verificar build:** Ejecuta `npm run build` y asegura 0 errores.
4. **Actualizar el nodo:** Agrega la entrada en el Changelog del nodo `NODE-XXX` y sincroniza su estado en `docs/CONTEXT_GRAPH.md`.
