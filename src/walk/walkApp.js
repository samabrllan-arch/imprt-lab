import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { createRunwayScene } from './runwayScene.js';
import { createTextureRenderer } from './textureRenderer.js';
import { attachWalkShader } from './walkShader.js';
import { WalkKinematics } from './walkKinematics.js';
import { FABRIC_COLORS } from '../config/colors.js';

const MODEL_URLS = {
  woman: '/models/shirt_woman_seam_draco.glb?v=4',
  man: '/models/shirt_clo_draco.glb?v=17'
};

const DROPS = [
  { id: 'goku', name: 'Son Goku SSJ', path: '/assets/drops/goku.png' },
  { id: 'rick', name: 'Rick & Morty', path: '/assets/drops/rick.png' },
  { id: 'oni', name: 'Cyber Oni', path: '/assets/drops/oni.png' },
  { id: 'bone', name: 'Bone Savage', path: '/assets/drops/bone.png' },
  { id: 'wolf', name: 'Gentleman Wolf', path: '/assets/drops/wolf.png' },
  { id: 'iron', name: 'Iron Man Arc', path: '/assets/drops/iron.png' }
];

export function initWalkStudio() {
  const container = document.getElementById('viewport-3d');
  const badgeLoading = document.getElementById('badge-loading');
  if (!container) return;

  const runway = createRunwayScene(container);
  const textureRenderer = createTextureRenderer('#874438'); // Washed Terracotta default
  const kinematics = new WalkKinematics('catwalk');

  // Material PBR con shader inyectado
  const shirtMaterial = new THREE.MeshStandardMaterial({
    map: textureRenderer.texture,
    roughness: 0.86,
    metalness: 0.03,
    side: THREE.DoubleSide
  });
  const shaderUniforms = attachWalkShader(shirtMaterial, {
    isWalking: true,
    walkSpeed: 1.0,
    ...kinematics.params
  });

  // Loader GLTF con Draco
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const loadedModels = { woman: null, man: null };
  const rootGroup = new THREE.Group();
  runway.scene.add(rootGroup);

  let activeSilhouette = 'woman';

  function loadSilhouette(silKey) {
    if (badgeLoading) {
      badgeLoading.style.display = 'block';
      badgeLoading.textContent = `Cargando silueta ${silKey === 'man' ? 'Hombre Boxy' : 'Mujer Slim'}...`;
    }

    if (loadedModels[activeSilhouette]) {
      loadedModels[activeSilhouette].visible = false;
    }
    activeSilhouette = silKey;
    textureRenderer.setSilhouette(silKey);

    if (loadedModels[silKey]) {
      loadedModels[silKey].visible = true;
      if (badgeLoading) badgeLoading.style.display = 'none';
      return;
    }

    gltfLoader.load(MODEL_URLS[silKey], (gltf) => {
      const raw = gltf.scene;
      const bbox = new THREE.Box3().setFromObject(raw);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const center = new THREE.Vector3();
      bbox.getCenter(center);

      const targetHeight = 1.05;
      const scaleFactor = targetHeight / (size.y || 1);
      raw.position.set(-center.x, -center.y, -center.z);

      const group = new THREE.Group();
      group.scale.setScalar(scaleFactor);
      group.add(raw);

      raw.traverse((child) => {
        if (child.isMesh) {
          child.material = shirtMaterial;
          child.castShadow = true;
        }
      });

      rootGroup.add(group);
      loadedModels[silKey] = group;
      if (badgeLoading) badgeLoading.style.display = 'none';
    });
  }

  // Carga inicial
  loadSilhouette('woman');

  // Cargar drop inicial (Goku)
  const defaultImg = new Image();
  defaultImg.onload = () => textureRenderer.setDecalImage(defaultImg);
  defaultImg.src = DROPS[0].path;

  // Render loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    runway.controls.update();
    kinematics.update(dt, rootGroup, runway.contactShadow, runway.runwayTexture, shaderUniforms);
    runway.renderer.render(runway.scene, runway.camera);
  }
  animate();

  bindUiControls(kinematics, loadSilhouette, textureRenderer, runway);
}

function bindUiControls(kinematics, loadSilhouette, textureRenderer, runway) {
  // 1. Selector de silueta
  document.querySelectorAll('.btn-sil').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-sil').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      loadSilhouette(btn.dataset.sil);
    });
  });

  // 2. Presets de caminata
  document.querySelectorAll('.btn-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-preset').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;
      kinematics.setPreset(preset);
      syncSliders(kinematics.params);
    });
  });

  // 3. Play / Pause
  const btnToggle = document.getElementById('btn-toggle-walk');
  btnToggle?.addEventListener('click', () => {
    kinematics.isWalking = !kinematics.isWalking;
    btnToggle.innerHTML = kinematics.isWalking ? '⏸️ Pausar Marcha' : '▶️ Reanudar Marcha';
    btnToggle.classList.toggle('active', kinematics.isWalking);
  });

  // 4. Sliders dinámicos
  const sliderMap = [
    { id: 'sl-cadence', key: 'cadenceBpm', valId: 'v-cadence', unit: ' BPM' },
    { id: 'sl-sway', key: 'swayAmp', valId: 'v-sway', unit: '' },
    { id: 'sl-bob', key: 'bobbingAmp', valId: 'v-bob', unit: '' },
    { id: 'sl-wave', key: 'waveAmp', valId: 'v-wave', unit: '' },
    { id: 'sl-wind', key: 'windAmp', valId: 'v-wind', unit: '' }
  ];

  sliderMap.forEach(({ id, key, valId, unit }) => {
    const el = document.getElementById(id);
    const vEl = document.getElementById(valId);
    el?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      kinematics.params[key] = val;
      if (vEl) vEl.textContent = val + unit;
      document.querySelectorAll('.btn-preset').forEach((b) => b.classList.remove('active'));
    });
  });

  function syncSliders(p) {
    sliderMap.forEach(({ id, key, valId, unit }) => {
      const el = document.getElementById(id);
      const vEl = document.getElementById(valId);
      if (el && p[key] !== undefined) {
        el.value = p[key];
        if (vEl) vEl.textContent = p[key] + unit;
      }
    });
  }

  // 5. Paleta de colores de tela
  const colorsContainer = document.getElementById('color-swatches');
  if (colorsContainer) {
    FABRIC_COLORS.forEach((col, idx) => {
      const dot = document.createElement('button');
      dot.className = `color-dot ${idx === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = col.hex;
      dot.title = col.name;
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        textureRenderer.setShirtColor(col.hex);
      });
      colorsContainer.appendChild(dot);
    });
  }

  // 6. Drops para probar
  const dropsContainer = document.getElementById('drops-grid');
  if (dropsContainer) {
    DROPS.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.className = `drop-thumb-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<img src="${d.path}" alt="${d.name}" /><span>${d.name}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.drop-thumb-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const img = new Image();
        img.onload = () => textureRenderer.setDecalImage(img);
        img.src = d.path;
      });
      dropsContainer.appendChild(btn);
    });
  }

  // 7. Subida de imagen personalizada
  const fileInp = document.getElementById('input-custom-art');
  fileInp?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => textureRenderer.setDecalImage(img);
      img.src = ev.target.result;
      document.querySelectorAll('.drop-thumb-btn').forEach((b) => b.classList.remove('active'));
    };
    reader.readAsDataURL(file);
  });

  // 8. Vistas de cámara
  document.querySelectorAll('.btn-cam').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-cam').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      runway.setCameraView(btn.dataset.cam);
    });
  });

  // 9. Zonas (Pecho / Espalda / Ambos)
  let chestOn = true, backOn = true;
  document.getElementById('btn-zone-both')?.addEventListener('click', (e) => {
    chestOn = true; backOn = true;
    textureRenderer.setZones(chestOn, backOn);
    updateZoneButtons(e.target);
  });
  document.getElementById('btn-zone-front')?.addEventListener('click', (e) => {
    chestOn = true; backOn = false;
    textureRenderer.setZones(chestOn, backOn);
    updateZoneButtons(e.target);
  });
  document.getElementById('btn-zone-back')?.addEventListener('click', (e) => {
    chestOn = false; backOn = true;
    textureRenderer.setZones(chestOn, backOn);
    updateZoneButtons(e.target);
  });

  function updateZoneButtons(activeBtn) {
    document.querySelectorAll('.btn-zone').forEach((b) => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }
}

// Iniciar al cargar DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWalkStudio);
} else {
  initWalkStudio();
}
