import { setDecal } from '../state/actions.js';
import { store } from '../state/store.js';
import { ZONES } from '../config/zones.js';
import { showToast } from './toast.js';
import { initImageEditorModal } from './imageEditorModal.js';
import { initAuthorDesignsModal } from './authorDesignsModal.js';
import { clampToPrintDpi, canvasToImage, describeClamp } from '../services/dpiClamp.js';
import { computeEffectiveDpi } from '../services/printResolution.js';

export function initDecalUploader(container) {
  function render() {
    const state = store.getState();
    const zoneConfig = ZONES[state.activeZone] || { name: state.activeZone.toUpperCase() };

    const html = `
      <div class="control-card decal-upload-card">
        <div class="card-header-clean">
          <span class="card-eyebrow">ARTE Y ESTAMPADOS</span>
          <span class="zone-badge-tag">${zoneConfig.name}</span>
        </div>

        <!-- Área de Carga Satinada con Drag & Drop -->
        <div class="modern-dropzone" id="dropzone">
          <input type="file" id="file-input" accept="image/png, image/jpeg, image/webp, image/svg+xml" class="file-hidden-input" />
          <label for="file-input" class="modern-dropzone-label">
            <div class="dropzone-icon-box">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 4v12M8 8l4-4 4 4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
              </svg>
            </div>
            <div class="dropzone-meta">
              <span class="dropzone-primary-text">Subir arte o pegar imagen</span>
              <span class="dropzone-secondary-text">PNG / JPG • Aplicación directa en tiempo real</span>
            </div>
          </label>
        </div>

        <!-- Botón para Abrir Galería de Diseños de Autor en Modal -->
        <div class="author-collection-cta">
          <div class="author-cta-texts">
            <div class="author-cta-badge-line">
              <span class="author-cta-dot"></span>
              <span class="author-cta-title">Diseños de Autor</span>
            </div>
            <span class="author-cta-desc">Colección Cápsula • 6 Artes Exclusivos</span>
          </div>
          <button type="button" class="btn-open-author-gallery" id="btn-open-author-gallery" title="Abrir catálogo completo de diseños de autor">
            <span>Ver Galería</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
    bindEvents(container);
  }

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Selecciona un archivo de imagen válido (PNG, JPG o WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      const img = new Image();
      img.onload = async () => {
        const cleanName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Estampado';
        const activeZone = store.getState().activeZone;

        // Tope de 300 DPI: una imagen gigante (50–90 MB) no se imprime mejor, solo satura memoria y Drive
        let art = img, artSrc = src;
        try {
          const fit = clampToPrintDpi(img, activeZone);
          if (fit.clamped) {
            art = await canvasToImage(fit.source);
            artSrc = art.src;
            showToast(describeClamp(fit, computeEffectiveDpi(fit.from.w, fit.max.wCm)), 'info', 6500);
          }
        } catch (err) {
          console.warn('[DecalUploader] No se pudo reducir a 300 DPI:', err);
        }

        setDecal(activeZone, {
          name: cleanName,
          src: artSrc,
          imageElement: art
        });
        showToast(`¡"${cleanName}" cargado en ${activeZone.toUpperCase()}!`, 'success');

        try {
          const editor = initImageEditorModal();
          editor.open(art, cleanName, (processedDataUrl, processedImg, finalName) => {
            const currentZone = store.getState().activeZone;
            setDecal(currentZone, {
              name: finalName || cleanName,
              src: processedDataUrl,
              imageElement: processedImg
            });
            showToast('Estampado acondicionado y actualizado', 'success');
          }, {
            // 💾 Reemplazar Imagen: sobrescribe el arte del lienzo sin cerrar el editor
            onReplace: async (dataUrl, processedImg, finalName) => {
              setDecal(store.getState().activeZone, { name: finalName || cleanName, src: dataUrl, imageElement: processedImg });
              return { ok: true, message: 'Arte del lienzo reemplazado.' };
            }
          });
        } catch (err) {
          console.error('Error al abrir editor automático:', err);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  function bindEvents(wrapper) {
    const fileInput = wrapper.querySelector('#file-input');
    const dropzone = wrapper.querySelector('#dropzone');
    const btnAuthorGallery = wrapper.querySelector('#btn-open-author-gallery');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
        fileInput.value = '';
      });
    }

    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('is-dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (btnAuthorGallery) {
      btnAuthorGallery.addEventListener('click', () => {
        const modal = initAuthorDesignsModal();
        modal.open();
      });
    }
  }

  render();

  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        handleFile(blob);
        break;
      }
    }
  });

  store.subscribe((state, changeKey) => {
    if (changeKey === 'activeZone') {
      const tag = container.querySelector('.zone-badge-tag');
      const zoneConfig = ZONES[state.activeZone] || { name: state.activeZone.toUpperCase() };
      if (tag) tag.textContent = zoneConfig.name;
    }
  });
}
