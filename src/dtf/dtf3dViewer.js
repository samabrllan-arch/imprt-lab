import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { getAssetPath } from '../config/paths.js';

const MODEL_URLS = {
  get woman() { return getAssetPath('models/shirt_woman_seam_draco.glb?v=4'); },
  get man() { return getAssetPath('models/shirt_clo_draco.glb?v=17'); }
};

export function createDtf3DViewer(containerEl, masterCanvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c0e14');

  const camera = new THREE.PerspectiveCamera(38, containerEl.clientWidth / containerEl.clientHeight, 0.1, 50);
  camera.position.set(0, 0.05, 2.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  containerEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, -0.05, 0);
  controls.minDistance = 1.2;
  controls.maxDistance = 4.0;

  // Luces de showroom PBR
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const dir1 = new THREE.DirectionalLight(0xffffff, 1.8);
  dir1.position.set(2, 3, 2.5);
  scene.add(dir1);

  const dir2 = new THREE.DirectionalLight(0xffffff, 1.2);
  dir2.position.set(-2, 2, -2.5);
  scene.add(dir2);

  // Textura PBR vinculada al canvas maestro
  const texture = new THREE.CanvasTexture(masterCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const shirtMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.86,
    metalness: 0.03,
    side: THREE.DoubleSide
  });

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(getAssetPath('draco/'));
  dracoLoader.setDecoderConfig({ type: 'js' });
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const loadedModels = { woman: null, man: null };
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  let activeSilhouette = 'woman';

  function loadSilhouette(silKey) {
    if (loadedModels[activeSilhouette]) {
      loadedModels[activeSilhouette].visible = false;
    }
    activeSilhouette = silKey;

    if (loadedModels[silKey]) {
      loadedModels[silKey].visible = true;
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
        if (child.isMesh) child.material = shirtMaterial;
      });

      rootGroup.add(group);
      loadedModels[silKey] = group;
    });
  }

  loadSilhouette('woman');

  function updateTexture() {
    texture.needsUpdate = true;
  }

  function handleResize() {
    if (!containerEl) return;
    camera.aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
  }
  window.addEventListener('resize', handleResize);

  let animId = null;
  function animate() {
    animId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return {
    loadSilhouette,
    updateTexture,
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    }
  };
}
