def add(path, entry):
    t = open(path, encoding='utf-8').read()
    key = '### 📝 Historial Atómico de Actualizaciones (Changelog)\n'
    assert key in t, path
    t = t.replace(key, key + entry + '\n', 1)
    open(path, 'w', encoding='utf-8').write(t)

add('docs/nodes/NODE-018-motor-color-key-matting.md', """- **[2026-10-07 | v5.1.0] Por Frontend:**
  - **Cambio:** Nuevo `src/services/autoBackground.js`: el botón "Quitar Fondo en 1 Clic" ahora borra en dos pasadas (1: fondo exterior por inundación desde el perímetro con la tolerancia del usuario; 2: bolsillos internos solo con tolerancia estricta 4-10%). `ImageEditorEngine.runErase` enruta el tipo `auto` a este módulo. Tests en `tests/autoBackground.test.js`.
  - **Motivo:** El modo automático borraba globalmente con tolerancia 30%: se comía zonas oscuras del arte (azul marino, sombras internas) y dejaba restos de la sombra exterior.
  - **Impacto:** La sensibilidad sigue actuando en tiempo real (rerun de la acción `auto`). Los botones por color (Verde/Cian) y la varita no cambian.
""")
add('docs/nodes/NODE-012-modelos-3d-glb-topologia-uv.md', """- **[2026-10-07 | v2.3.1] Por Frontend 3D:**
  - **Cambio:** Recalibración de `ZONES.front/back.canvasAreaBySilhouette.woman` en `src/config/zones.js`: frente (570, 990) y espalda (1536, 990), con límites ampliados (minY 640 / maxY 1230).
  - **Motivo:** Con la UV por costuras el centro anterior (y=1220) dejaba el estampado pegado al cuello y recortado por la zona neutra del escote.
  - **Impacto:** Estampado completo y centrado en pecho/espalda de la silueta femenina; arrastre posible dentro de la isla UV válida.
""")
print('ok')
