/**
 * Mini tour guiado del editor (NODE-010): spotlight + tooltip en 6 pasos.
 * Se abre solo la primera vez (flag en localStorage) y siempre con el botón "💡 ¿Cómo funciona? / Tour".
 *
 * Escritorio: la tarjeta flota junto al elemento enfocado. Móvil (<= 768 px): la tarjeta es un dock inferior
 * (bottom-sheet con safe-area), el elemento se trae a la vista con scrollIntoView (la ventana del editor hace
 * scroll vertical) y el foco SIGUE al elemento mientras dura el desplazamiento suave. En pantallas táctiles los
 * textos hablan de gestos (pellizco, dedo, lupa) en lugar de rueda del ratón y barra espaciadora.
 */
const STORAGE_KEY = 'shirtStudio.imageEditorTour.v1';
const PAD = 6;       // margen del foco alrededor del elemento
const CARD_W = 300;
const DOCK_MAX = 768;   // <= 768 px: tarjeta anclada abajo (ver imageEditorTour.css .is-dock)

const STEPS = [
  { target: '#editor-viewport', tab: 'bg', place: 'right', title: 'Lienzo de Trabajo',
    text: 'Aquí ves tu arte sobre el color de la prenda (👕 Prenda) o sobre una cuadrícula transparente (🏁). Rueda del ratón = zoom · barra espaciadora + arrastrar = mover.',
    touchText: 'Pellizca con 2 dedos para zoom y desliza para mover el arte. Cambia el fondo para ver cómo luce sobre tu camiseta.' },
  { target: '#editor-hero-card', tab: 'bg', place: 'left', title: 'Quitar Fondo en 1 Clic',
    text: 'Pulsa ✨ Quitar Fondo en 1 Clic: la detección inteligente encuentra el fondo (del color que sea, incluido el verde croma), lo elimina y afina el borde sin dejar halos.' },
  { target: '#editor-manual-block', tab: 'bg', place: 'left', title: 'Retoque Manual',
    text: 'La 🪄 Varita borra la zona que tocas (o todo ese color) y te marca en rojo qué se va a borrar antes del clic. La 🧹 Goma sirve para los detalles finos.',
    touchText: 'Apunta con el dedo: una lupa flota sobre él para que lo veas todo. Con la 🪄 Varita, al soltar se tiñe en rojo lo que se borra y confirmas con ✓ Borrar. 🖐️ Mover desplaza el arte sin borrar.' },
  { target: '#panel-adjust', tab: 'adjust', place: 'left', title: 'Ajustes, Giro & Filtros',
    text: 'Brillo, contraste, saturación y nitidez con vista previa en vivo; giro libre de 360°, volteos y filtros streetwear (Street, Duotone, Halftone DTF y Vintage). Todo se puede deshacer.' },
  { target: '#panel-text', tab: 'text', place: 'left', title: 'Textos & Caligrafías',
    text: 'Agrega títulos, elige tipografías urbanas (cursivas, góticas, graffiti y bold), cúrvalos en arco y arrástralos sobre el lienzo.' },
  { target: '.editor-actions-stack', tab: 'text', place: 'left', title: 'Aplicar, Guardar o Descargar',
    text: 'Aplicar a Camiseta proyecta el arte en 3D. Con 💾 Reemplazar, ➕ Copia y 📥 Descargar (PNG 300 DPI) lo conservas sin salir del editor.' }
];

/** Pantalla táctil o ventana estrecha: se muestran gestos en lugar de atajos de ratón. */
const touchUi = () => window.innerWidth <= DOCK_MAX || !!window.matchMedia?.('(pointer: coarse)').matches;
const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const tourFlag = {
  seen() { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; } },
  mark() { try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* modo privado: se ignora */ } }
};

/** @param {{backdrop:HTMLElement, switchTab:(tab:string)=>void}} ed */
export function createEditorTour({ backdrop, switchTab }) {
  const root = document.createElement('div');
  root.className = 'editor-tour';
  root.hidden = true;
  root.innerHTML = `
    <div class="tour-spot"></div>
    <div class="tour-card" role="dialog" aria-live="polite">
      <button type="button" class="tour-x" aria-label="Cerrar tour">✕</button>
      <div class="tour-count"></div><h4 class="tour-title"></h4><p class="tour-text"></p>
      <div class="tour-dots"></div>
      <div class="tour-nav">
        <button type="button" class="tour-skip">Omitir</button><span class="tour-spacer"></span>
        <button type="button" class="tour-back">Atrás</button>
        <button type="button" class="tour-next">Siguiente</button>
      </div>
    </div>`;
  backdrop.appendChild(root);

  const q = (s) => root.querySelector(s);
  const spot = q('.tour-spot'), card = q('.tour-card');
  let index = 0, token = 0, trackId = 0, lastW = 0;

  const isDock = () => window.innerWidth <= DOCK_MAX;

  /** Escritorio: tarjeta flotante junto al elemento. Móvil: el CSS la ancla abajo, así que se limpian left/top. */
  function place(step, r) {
    if (isDock()) { card.style.left = ''; card.style.top = ''; return; }
    const ch = card.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
    let left, top;
    if (step.place === 'right' && r.right + CARD_W + 28 <= vw) {   // a la derecha: el arte queda a la vista
      left = r.right + 16;
      top = r.top + (r.height - ch) / 2;
    } else if (step.place === 'right') {                           // sin sitio: dentro del lienzo, abajo
      left = r.left + (r.width - CARD_W) / 2;
      top = r.bottom - ch - 16;
    } else {                                       // 'left': a la izquierda del elemento
      left = r.left - CARD_W - 16;
      top = r.top + (r.height - ch) / 2;
      if (left < 12) left = Math.min(vw - CARD_W - 12, r.right + 16);
    }
    card.style.left = `${Math.max(12, Math.min(vw - CARD_W - 12, left))}px`;
    card.style.top = `${Math.max(12, Math.min(vh - ch - 12, top))}px`;
  }

  /** Coloca el foco sobre el elemento; devuelve su posición como clave para detectar que ya dejó de moverse. */
  function setSpot(el) {
    const r = el.getBoundingClientRect();
    Object.assign(spot.style, {
      left: `${r.left - PAD}px`, top: `${r.top - PAD}px`,
      width: `${r.width + PAD * 2}px`, height: `${r.height + PAD * 2}px`
    });
    return `${Math.round(r.left)}|${Math.round(r.top)}|${Math.round(r.width)}|${Math.round(r.height)}`;
  }

  /** El scroll suave mueve el elemento durante ~400 ms: el foco lo sigue fotograma a fotograma hasta que se asienta. */
  function track(el, myToken) {
    cancelAnimationFrame(trackId);
    const t0 = performance.now();
    let last = '', still = 0;
    const tick = () => {
      if (myToken !== token || root.hidden) return;
      const key = setSpot(el);
      still = key === last ? still + 1 : 0;
      last = key;
      if (still < 10 || performance.now() - t0 < 350) trackId = requestAnimationFrame(tick);
      else place(STEPS[index], el.getBoundingClientRect());
    };
    tick();
  }

  /** Trae el elemento a la vista, por encima del dock: centrado si es pequeño, alineado arriba si es muy alto. */
  function bringIntoView(el) {
    const free = window.innerHeight - card.offsetHeight - 80;       // altura útil sobre el dock
    const tall = el.getBoundingClientRect().height > free * 0.8;
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: tall ? 'start' : 'center' });
  }

  function render() {
    const step = STEPS[index];
    const dock = isDock();
    const myToken = ++token;
    lastW = window.innerWidth;
    root.classList.toggle('is-dock', dock);
    backdrop.classList.toggle('tour-dock-open', dock && !root.hidden);
    switchTab(step.tab);
    requestAnimationFrame(() => {                 // espera a que la pestaña esté visible
      if (myToken !== token) return;
      const el = backdrop.querySelector(step.target);
      if (!el) return;
      q('.tour-count').textContent = `Paso ${index + 1} de ${STEPS.length}`;
      q('.tour-title').textContent = step.title;
      q('.tour-text').textContent = (touchUi() && step.touchText) || step.text;
      q('.tour-dots').innerHTML = STEPS.map((_, i) => `<i class="${i === index ? 'on' : ''}"></i>`).join('');
      q('.tour-back').disabled = index === 0;
      q('.tour-next').textContent = index === STEPS.length - 1 ? '¡Listo!' : 'Siguiente';
      place(step, el.getBoundingClientRect());
      if (dock) {
        bringIntoView(el);
        requestAnimationFrame(() => { if (myToken === token) track(el, myToken); }); // coordenadas tras el primer fotograma de scroll
      } else {
        setSpot(el);
      }
    });
  }

  /** Girar el móvil o abrir el teclado dispara resize: solo se recoloca si cambió el ANCHO (la barra del navegador no cuenta). */
  const onResize = () => { if (window.innerWidth !== lastW || !isDock()) render(); };

  function stop() {
    if (root.hidden) return;
    root.hidden = true;
    token++;
    cancelAnimationFrame(trackId);
    backdrop.classList.remove('tour-dock-open');
    tourFlag.mark();
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onResize);
    switchTab('bg');
  }

  const go = (delta) => {
    const next = index + delta;
    if (next >= STEPS.length) { stop(); return; }
    index = Math.max(0, next);
    render();
  };

  function onKey(e) {
    if (e.key === 'Escape') { e.stopPropagation(); stop(); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  }

  q('.tour-next').addEventListener('click', () => go(1));
  q('.tour-back').addEventListener('click', () => go(-1));
  q('.tour-skip').addEventListener('click', stop);
  q('.tour-x').addEventListener('click', stop);

  return {
    shouldAutoStart: () => !tourFlag.seen(),
    start() {
      index = 0;
      root.hidden = false;
      window.addEventListener('keydown', onKey, true);
      window.addEventListener('resize', onResize);
      render();
    },
    stop
  };
}
