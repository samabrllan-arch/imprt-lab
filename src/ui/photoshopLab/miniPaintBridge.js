/**
 * PUENTE DE INTEGRACIÓN PARA MINIPAINT (PHOTOSHOP GITHUB) (<140 Líneas)
 * Embebe la suite de miniPaint y conecta la exportación hacia la camiseta 3D
 */
export function mountMiniPaint(container, onUpdate3dCallback) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; position: relative;">
      <!-- Barra Superior Informativa de miniPaint -->
      <div style="height: 42px; background: #161b26; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.85rem; font-weight: 700; color: #38bdf8;">🖌️ miniPaint Suite (GitHub Open Source)</span>
          <span style="font-size: 0.68rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 8px; border-radius: 999px;">Photoshop Web Client</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="background: #2563eb; color: #fff; font-size: 0.74rem; font-weight: 700; padding: 5px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span>📥 Cargar PNG Guardado a la Camisa</span>
            <input type="file" id="input-minipaint-export" accept="image/*" style="display: none;" />
          </label>
        </div>
      </div>

      <!-- Iframe de miniPaint Oficial de GitHub -->
      <div style="flex: 1; position: relative; width: 100%; height: calc(100% - 42px);">
        <iframe 
          id="minipaint-iframe" 
          src="https://viliusle.github.io/miniPaint/" 
          style="width: 100%; height: 100%; border: none; background: #222;"
          title="miniPaint Photoshop Clone">
        </iframe>
      </div>
    </div>
  `;

  const inputExport = container.querySelector('#input-minipaint-export');
  inputExport.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (onUpdate3dCallback) {
        onUpdate3dCallback(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
  });
}
