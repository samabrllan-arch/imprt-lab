import { showToast } from './toast.js';
import { getSafestChromaColor, buildAiPrompt } from '../services/aiPromptHelper.js';

/**
 * Asistente de Prompt para IA del editor (desplegable, idioma y copiado).
 * Extraído de imageEditorModal.js para respetar la regla de las 300 líneas.
 *
 * @returns {{ analyzeImage: (imageData: ImageData) => void }}
 */
export function initAiPromptPanel(backdrop) {
  const $ = sel => backdrop.querySelector(sel);
  const btnToggleAi = $('#btn-toggle-ai-card'), aiBody = $('#ai-prompt-body'), aiArrow = $('#ai-toggle-arrow');
  const btnCopyPrompt = $('#btn-copy-prompt'), aiPromptInput = $('#ai-prompt-input');

  let currentChromaColor = null;
  let currentPromptLang = 'en';

  function updateAiPrompt() {
    if (!currentChromaColor) return;
    if (aiPromptInput) aiPromptInput.value = buildAiPrompt(currentChromaColor, currentPromptLang);
    const badge = $('#ai-chroma-badge');
    if (badge) {
      badge.textContent = currentChromaColor.name;
      badge.style.color = currentChromaColor.hex === '#FFFFFF' ? '#e2e8f0' : currentChromaColor.hex;
      badge.style.borderColor = currentChromaColor.hex;
    }
  }

  btnToggleAi?.addEventListener('click', () => {
    const isClosed = aiBody.style.display === 'none';
    aiBody.style.display = isClosed ? 'flex' : 'none';
    aiArrow.textContent = isClosed ? '▴' : '▾';
  });

  backdrop.querySelectorAll('.btn-prompt-lang').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-prompt-lang').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPromptLang = btn.getAttribute('data-lang') || 'en';
      updateAiPrompt();
    });
  });

  btnCopyPrompt?.addEventListener('click', async () => {
    if (!aiPromptInput) return;
    try {
      await navigator.clipboard.writeText(aiPromptInput.value);
      btnCopyPrompt.textContent = '¡Copiado! ✓';
      showToast('Prompt copiado al portapapeles', 'success');
      setTimeout(() => { btnCopyPrompt.textContent = '📋 Copiar Prompt'; }, 1800);
    } catch {
      aiPromptInput.select();
      document.execCommand('copy');
      showToast('Prompt copiado', 'success');
    }
  });

  return {
    /** Detecta el color croma más seguro (que no exista en la imagen) y refresca el prompt. */
    analyzeImage(imageData) {
      currentChromaColor = getSafestChromaColor(imageData);
      updateAiPrompt();
    }
  };
}
