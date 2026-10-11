/**
 * SIMULADOR 3D AISLADO PARA EL LABORATORIO GRÁFICO (<230 Líneas)
 * Proyecta la textura generada por el editor directamente en la camiseta 3D
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { getAssetPath } from '../../config/paths.js';

export class ShirtPreview3D {
  constructor(mountContainer) {
    this.container = mountContainer;
    this.currentZone = 'chest';
    this.shirtColor = '#111215';
    this.currentGraphicImg = null;

    // 1. Canvas 2D de Textura 2048x2048
    this.texCanvas = document.createElement('canvas');
    this.texCanvas.width = 2048;
    this.texCanvas.height = 2048;
    this.texCtx = this.texCanvas.getContext('2d');

    this.texture = new THREE.CanvasTexture(this.texCanvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.flipY = false;

    this.initThree();
    this.loadModel();
    this.redrawTexture();
  }

  initThree() {
    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camera.position.set(0, 0.2, 1.35);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 2.5;

    // Luces de Estudio
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444455, 1.4);
    this.scene.add(hemi);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(1.5, 2, 2);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff5722, 0.6);
    dirLight2.position.set(-2, -1, -2);
    this.scene.add(dirLight2);

    window.addEventListener('resize', () => this.handleResize());
    this.animate();
  }

  loadModel() {
    const draco = new DRACOLoader();
    draco.setDecoderPath(getAssetPath('draco/'));
    draco.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(
      getAssetPath('models/shirt_clo_draco.glb?v=20'),
      (gltf) => {
        console.log('[Shirt3D] GLTF loaded successfully!');
        this.model = gltf.scene;
        this.model.position.set(0, -0.45, 0);

        this.model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: this.texture,
              roughness: 0.65,
              metalness: 0.08
            });
            child.material.map.flipY = false;
          }
        });

        this.scene.add(this.model);
        const badge = document.getElementById('canvas-3d-loader');
        if (badge) badge.style.display = 'none';
      },
      (xhr) => {
        console.log('[Shirt3D] Progress:', Math.round(xhr.loaded / (xhr.total || 1) * 100) + '%');
      },
      (err) => {
        console.error('[Shirt3D] Error loading:', err);
      }
    );
  }

  redrawTexture() {
    const ctx = this.texCtx;
    ctx.fillStyle = this.shirtColor;
    ctx.fillRect(0, 0, 2048, 2048);

    if (this.currentGraphicImg) {
      // Coordenadas UV comprobadas para pecho y espalda en Boxy CLO3D
      const coords = this.currentZone === 'chest' 
        ? { x: 572, y: 720, w: 420, h: 480 } 
        : { x: 1536, y: 720, w: 480, h: 540 };

      ctx.drawImage(
        this.currentGraphicImg,
        coords.x - coords.w / 2,
        coords.y - coords.h / 2,
        coords.w,
        coords.h
      );
    }

    this.texture.needsUpdate = true;
  }

  updateGraphic(dataUrl) {
    const img = new Image();
    img.onload = () => {
      this.currentGraphicImg = img;
      this.redrawTexture();
    };
    img.src = dataUrl;
  }

  setZone(zone) {
    this.currentZone = zone;
    if (zone === 'back') {
      // Girar suavemente la cámara a la espalda
      this.camera.position.set(0, 0.2, -1.35);
    } else {
      this.camera.position.set(0, 0.2, 1.35);
    }
    this.controls.update();
    this.redrawTexture();
  }

  handleResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
