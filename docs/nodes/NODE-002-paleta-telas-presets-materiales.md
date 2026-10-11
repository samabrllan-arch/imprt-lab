# [NODE-002]: Paleta de Telas, Presets SVG & Materiales
- **Tipo:** Config / Presets / Assets
- **Estado:** Activo
- **Responsable:** Design / Frontend

### 🔗 Red de Conexiones (Grafo de Dependencias)
- **Nodos de Entrada (Depende de):** Ninguno
- **Nodos de Salida (Alimenta a):** NODE-001 (Store), NODE-004 (TextureComposer), NODE-005 (Engine 3D), NODE-009 (Decals UI)
- **Contratos / Módulos expuestos:**
  - `src/config/colors.js`: Paleta curada de telas (HEX, nombres y contrastes).
  - `src/config/presets.js`: Galería de gráficos vectoriales SVG embebidos y convertidor `svgToDataUrl`.
  - `src/config/materials.js`: Propiedades PBR de tejido (roughness, metalness, normal scales).

### 📦 Responsabilidad Técnica
Definir los activos estáticos y especificaciones de materiales textiles, colores de tela base y biblioteca de estampados predeterminados sin dependencias externas de red.

### 📝 Historial Atómico de Actualizaciones (Changelog)
- **[2026-10-05 | v1.0.0] Por Design:**
  - **Cambio:** Registro del nodo de activos y presets en el Context Graph.
  - **Motivo:** Centralizar el origen de datos cosméticos y textiles del sistema.
  - **Impacto:** Permite al compositor y al selector de color reaccionar inmediatamente a nuevas adiciones.

- **[2026-10-07 | v2.8.0] Por Design & Frontend:**
  - **Cambio:** Eliminación definitiva de `Rojo Carmesí` (`#b91c1c`) y posicionamiento de `Washed Terracotta` (`#874438`) como el color predeterminado inicial en `FABRIC_COLORS` y `initialState.selectedColor` (aplicado por defecto a silueta de hombre y mujer).
  - **Motivo:** Petición de especificación de color streetwear mineral por el usuario.
  - **Impacto:** Apertura del estudio y modelos 3D masculino y femenino renderizan inmediatamente en tono Washed Terracotta.

