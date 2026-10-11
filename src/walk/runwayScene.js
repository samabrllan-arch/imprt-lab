import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createRunwayScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c0e14');
  scene.fog = new THREE.FogExp2('#0c0e14', 0.18);

  const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 0.15, 2.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, -0.05, 0);
  controls.minDistance = 1.0;
  controls.maxDistance = 5.0;
  controls.maxPolarAngle = Math.PI / 2 + 0.05;

  // Iluminación de Pasarela
  const ambLight = new THREE.AmbientLight(0xfff8f0, 1.1);
  scene.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(1.8, 3.5, 2.6);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.4);
  rimLight.position.set(-2.2, 2.0, -2.5);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xf59e0b, 0.8);
  fillLight.position.set(0, -1.0, 1.5);
  scene.add(fillLight);

  // Pasarela con textura procedural deslizante
  const runwayCanvas = document.createElement('canvas');
  runwayCanvas.width = 512;
  runwayCanvas.height = 1024;
  const rCtx = runwayCanvas.getContext('2d');
  rCtx.fillStyle = '#12151e';
  rCtx.fillRect(0, 0, 512, 1024);
  // Líneas de pasarela estilo pasarela de moda
  rCtx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  rCtx.lineWidth = 2;
  for (let y = 0; y < 1024; y += 64) {
    rCtx.beginPath();
    rCtx.moveTo(0, y);
    rCtx.lineTo(512, y);
    rCtx.stroke();
  }
  // Líneas laterales de guía
  rCtx.fillStyle = 'rgba(217, 119, 6, 0.5)';
  rCtx.fillRect(16, 0, 4, 1024);
  rCtx.fillRect(492, 0, 4, 1024);

  const runwayTexture = new THREE.CanvasTexture(runwayCanvas);
  runwayTexture.wrapS = THREE.RepeatWrapping;
  runwayTexture.wrapT = THREE.RepeatWrapping;
  runwayTexture.repeat.set(1, 4);

  const runwayGeo = new THREE.PlaneGeometry(1.6, 12, 1, 1);
  const runwayMat = new THREE.MeshStandardMaterial({
    map: runwayTexture,
    roughness: 0.45,
    metalness: 0.3,
    depthWrite: true
  });
  const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
  runwayMesh.rotation.x = -Math.PI / 2;
  runwayMesh.position.y = -0.75;
  scene.add(runwayMesh);

  // Sombra de contacto suave
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(1.1, 0.8);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.75, depthWrite: false });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -0.74;
  scene.add(contactShadow);

  function handleResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', handleResize);

  function setCameraView(viewKey) {
    const views = {
      front: [0, 0.1, 2.3],
      diag: [1.3, 0.2, 1.8],
      side: [2.1, 0.1, 0.0],
      back: [0, 0.1, -2.3]
    };
    const targetPos = views[viewKey] || views.front;
    camera.position.set(...targetPos);
    controls.target.set(0, -0.05, 0);
  }

  return {
    scene,
    camera,
    renderer,
    controls,
    runwayTexture,
    contactShadow,
    setCameraView,
    destroy: () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    }
  };
}
