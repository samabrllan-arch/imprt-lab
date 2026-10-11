import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { DECAL_PRESETS, svgToDataUrl } from './config/presets.js';

// Configuración inicial de coordenadas
const coords = {
  woman_seam: {
    chest: { x: 570, y: 990, scale: 0.85 },
    back: { x: 1536, y: 1220, scale: 0.95 }
  },
  woman_old: {
    chest: { x: 564, y: 1220, scale: 0.95 },
    back: { x: 1536, y: 1220, scale: 0.95 }
  },
  man: {
    chest: { x: 572, y: 720, scale: 1.0 },
    back: { x: 1536, y: 720, scale: 1.0 }
  }
};

import { getAssetPath } from './config/paths.js';

const MODEL_URLS = {
  get woman_seam() { return getAssetPath('models/shirt_woman_seam_draco.glb?v=4'); },
  get woman_old() { return getAssetPath('models/shirt_woman_draco.glb?v=17'); },
  get man() { return getAssetPath('models/shirt_clo_draco.glb?v=17'); }
};

const MODEL_LABELS = {
  woman_seam: 'Mujer Opción 2 (Seam Unwrap - Por Costuras)',
  woman_old: 'Mujer Anterior (Meshy - Con Efecto Láser)',
  man: 'Hombre (Boxy CLO3D)'
};

let currentSilhouette = 'woman_seam';
let currentZone = 'chest';
let showBoth = true;
let shirtBgColor = '#111215';

// 1. Setup Canvas Texture 2048x2048
const canvas = document.createElement('canvas');
canvas.width = 2048;
canvas.height = 2048;
const ctx = canvas.getContext('2d');
const texture = new THREE.CanvasTexture(canvas);
texture.colorSpace = THREE.SRGBColorSpace;

// Cargar imagen del logo
const logoImg = new Image();
logoImg.src = svgToDataUrl(DECAL_PRESETS[0].svg);

function redrawTexture() {
  ctx.fillStyle = shirtBgColor;
  ctx.fillRect(0, 0, 2048, 2048);

  const cfg = coords[currentSilhouette];
  const zonesToDraw = showBoth ? ['chest', 'back'] : [currentZone];

  for (const z of zonesToDraw) {
    const c = cfg[z];
    const size = (z === 'chest' ? 440 : 460) * c.scale;
    if (logoImg.complete && logoImg.naturalWidth) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(1, -1);
      ctx.drawImage(logoImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }
  texture.needsUpdate = true;
  updateCodeOutput();
}

logoImg.onload = () => redrawTexture();

// 2. Setup Three.js Scene
const container = document.getElementById('canvas3d');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0f1117');

const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0.05, 2.15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, -0.05, 0);
window.testCamera = camera;
window.testControls = controls;

// Iluminación
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight1.position.set(2, 3, 3);
scene.add(dirLight1);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight2.position.set(-2, 2, -3);
scene.add(dirLight2);

// Material PBR para la camiseta
const shirtMaterial = new THREE.MeshStandardMaterial({
  map: texture,
  roughness: 0.85,
  metalness: 0.05,
  side: THREE.DoubleSide
});

// Loader GLTF con Draco
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(getAssetPath('draco/'));
dracoLoader.setDecoderConfig({ type: 'js' });
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const models = { woman_seam: null, woman_old: null, man: null };
const badge = document.getElementById('badge-loading');

function loadModel(silhouetteKey) {
  badge.style.display = 'block';
  badge.textContent = `Cargando ${MODEL_LABELS[silhouetteKey] || silhouetteKey}...`;

  if (models[currentSilhouette]) {
    models[currentSilhouette].visible = false;
  }

  currentSilhouette = silhouetteKey;
  syncSliders();
  redrawTexture();

  if (models[silhouetteKey]) {
    models[silhouetteKey].visible = true;
    badge.style.display = 'none';
    return;
  }

  const url = MODEL_URLS[silhouetteKey];
  gltfLoader.load(url, (gltf) => {
    const raw = gltf.scene;
    const bbox = new THREE.Box3().setFromObject(raw);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    const scaleFactor = 1.05 / (size.y || 1);
    raw.position.x = -center.x;
    raw.position.y = -center.y;
    raw.position.z = -center.z;

    const group = new THREE.Group();
    group.scale.setScalar(scaleFactor);
    group.add(raw);

    raw.traverse(c => {
      if (c.isMesh) c.material = shirtMaterial;
    });

    scene.add(group);
    models[silhouetteKey] = group;
    badge.style.display = 'none';
  });
}

// 3. UI Controls and Listeners
const sliderX = document.getElementById('slider-x');
const sliderY = document.getElementById('slider-y');
const sliderScale = document.getElementById('slider-scale');
const valX = document.getElementById('val-x');
const valY = document.getElementById('val-y');
const valScale = document.getElementById('val-scale');
const codeOutput = document.getElementById('code-output');

function syncSliders() {
  const c = coords[currentSilhouette][currentZone];
  sliderX.value = c.x; sliderY.value = c.y; sliderScale.value = c.scale;
  valX.textContent = c.x; valY.textContent = c.y; valScale.textContent = c.scale;
}

[['slider-x', 'val-x', 'x'], ['slider-y', 'val-y', 'y'], ['slider-scale', 'val-scale', 'scale']].forEach(([sId, vId, key]) => {
  document.getElementById(sId)?.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    coords[currentSilhouette][currentZone][key] = v;
    const vEl = document.getElementById(vId);
    if (vEl) vEl.textContent = v;
    redrawTexture();
  });
});

const silhouetteBtns = [
  { id: 'btn-woman-seam', key: 'woman_seam' },
  { id: 'btn-woman-old', key: 'woman_old' },
  { id: 'btn-man', key: 'man' }
];

silhouetteBtns.forEach(({ id, key }) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    silhouetteBtns.forEach(b => document.getElementById(b.id)?.classList.remove('active'));
    btn.classList.add('active');
    loadModel(key);
  });
});

[['btn-zone-chest', 'chest'], ['btn-zone-back', 'back']].forEach(([id, zone]) => {
  document.getElementById(id)?.addEventListener('click', (e) => {
    currentZone = zone;
    document.querySelectorAll('#btn-zone-chest, #btn-zone-back').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    syncSliders();
    redrawTexture();
  });
});

[['btn-view-front', [0, 0.05, 2.15]], ['btn-view-back', [0, 0.05, -2.15]]].forEach(([id, pos]) => {
  document.getElementById(id)?.addEventListener('click', (e) => {
    document.querySelectorAll('#btn-view-front, #btn-view-back').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    camera.position.set(...pos);
    controls.target.set(0, -0.05, 0);
  });
});

document.getElementById('btn-apply-both')?.addEventListener('click', (e) => {
  showBoth = !showBoth;
  e.target.style.background = showBoth ? '#059669' : '#232936';
  redrawTexture();
});

// Selector de color de camiseta
document.querySelectorAll('.btn-shirt-color').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-shirt-color').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    shirtBgColor = btn.getAttribute('data-color') || '#111215';
    redrawTexture();
  });
});

// Subida de imagen personalizada
const fileInput = document.getElementById('input-test-img');
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      logoImg.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById('btn-preset-default')?.addEventListener('click', () => {
  logoImg.src = svgToDataUrl(DECAL_PRESETS[0].svg);
});

function updateCodeOutput() {
  codeOutput.textContent = JSON.stringify(coords, null, 2);
}

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Iniciar cargando modelo inicial (Opción 2 Seam Unwrap)
loadModel('woman_seam');

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
