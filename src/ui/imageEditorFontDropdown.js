import { fontById } from './imageEditorTextRender.js';

/**
 * Desplegable de caligrafías de la pestaña Textos (NODE-010). Extraído de imageEditorTextLayer.js.
 * @param {(sel:string)=>HTMLElement|null} q buscador dentro del editor
 * @param {() => void} onPick se llama cuando el usuario elige una fuente (el menú ya quedó cerrado)
 */
export function bindFontDropdown(q, onPick) {
  const trigger = q('#font-dropdown-trigger');
  const menu = q('#font-dropdown-menu');
  const triggerText = q('#font-trigger-text');
  const triggerBadge = q('#font-trigger-badge');

  trigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  menu?.addEventListener('click', (e) => {
    const item = e.target.closest('.font-dropdown-item');
    if (!item) return;
    menu.querySelectorAll('.font-dropdown-item').forEach((i) => i.classList.toggle('active', i === item));
    const font = fontById(item.dataset.font);
    if (triggerText) {
      triggerText.textContent = font.label;
      triggerText.style.fontFamily = font.family;
    }
    if (triggerBadge) triggerBadge.textContent = font.group;
    menu.style.display = 'none';
    onPick();
  });

  document.addEventListener('click', (e) => {
    if (menu && menu.style.display === 'block' && !e.target.closest('#font-dropdown-container')) {
      menu.style.display = 'none';
    }
  });
}
