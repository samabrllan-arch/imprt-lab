import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Cargador de modelos GLTF/GLB optimizados con compresión Draco y UVs preservadas
 */
export class GltfShirtLoader {
  constructor() {
    this.dracoLoader = new DRACOLoader();
    // Decodificador Draco local servido desde public/draco/
    this.dracoLoader.setDecoderPath('/draco/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  /**
   * Carga y centra el modelo de camiseta CLO3D
   */
  async loadModel(url, canvasTexture) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const rawModel = gltf.scene;

          // 1. Material PBR de tela de algodón conectado al compositor UV
          const fabricMaterial = new THREE.MeshStandardMaterial({
            map: canvasTexture,
            roughness: 0.88,
            metalness: 0.02,
            side: THREE.DoubleSide
          });

          // Uniforme para sincronizar el color base de la tela interior
          fabricMaterial.userData.uBaseFabricColor = { value: new THREE.Color(0xffffff) };

          // Identificador de cache para garantizar compilación única del shader en Three.js
          fabricMaterial.customProgramCacheKey = () => 'clo_fabric_material_v6';

          // Inyección de shader: Aísla exclusivamente el interior de la prenda
          // Por dentro NUNCA se ven estampados, solo el color de tela uniforme
          fabricMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.uBaseFabricColor = fabricMaterial.userData.uBaseFabricColor;

            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              varying float vIsInnerLining;`
            );

            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
              float isInner = 0.0;
              // Cavidad interior del cuello en CLO3D
              if (position.y > 0.50 && length(position.xz) < 0.11) {
                if (dot(normal.xz, position.xz) < 0.0) {
                  isInner = 1.0;
                }
              }
              vIsInnerLining = isInner;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
              uniform vec3 uBaseFabricColor;
              varying float vIsInnerLining;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `#ifdef USE_MAP
                if (!gl_FrontFacing || vIsInnerLining > 0.5) {
                  // Interior de la prenda: tela limpia sin que se traspase el estampado
                  diffuseColor.rgb = uBaseFabricColor * 0.88;
                } else {
                  // Todo el exterior de la prenda
                  vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                  diffuseColor *= sampledDiffuseColor;
                }
              #else
                if (!gl_FrontFacing || vIsInnerLining > 0.5) {
                  diffuseColor.rgb = uBaseFabricColor * 0.88;
                }
              #endif`
            );
          };

          // 2. Calcular caja delimitadora y centrar el modelo en (0, 0, 0)
          const bbox = new THREE.Box3().setFromObject(rawModel);
          const size = new THREE.Vector3();
          bbox.getSize(size);
          const center = new THREE.Vector3();
          bbox.getCenter(center);

          // Escalar para que mida 1.05 unidades de altura visible
          const targetHeight = 1.05;
          const scaleFactor = targetHeight / (size.y || 1);

          // Centrar modelo dentro de su pivote
          rawModel.position.x = -center.x;
          rawModel.position.y = -center.y;
          rawModel.position.z = -center.z;

          // Wrapper contenedor para escala y transformaciones uniformes
          const wrapper = new THREE.Group();
          wrapper.scale.setScalar(scaleFactor);
          wrapper.add(rawModel);

          // Sombra de contacto suave en el piso para realismo de showroom
          const shadowCanvas = document.createElement('canvas');
          shadowCanvas.width = 128;
          shadowCanvas.height = 128;
          const sCtx = shadowCanvas.getContext('2d');
          const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
          grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
          grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.2)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          sCtx.fillStyle = grad;
          sCtx.fillRect(0, 0, 128, 128);
          const shadowGeo = new THREE.PlaneGeometry(0.85, 0.45);
          shadowGeo.rotateX(-Math.PI / 2);
          const shadowMat = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(shadowCanvas),
            transparent: true,
            opacity: 0.65,
            depthWrite: false
          });
          const floorShadow = new THREE.Mesh(shadowGeo, shadowMat);
          floorShadow.position.set(0, -targetHeight * 0.51, 0);
          wrapper.add(floorShadow);

          // 3. Configurar sombras y aplicar material
          let meshCount = 0;
          rawModel.traverse((child) => {
            if (child.isMesh) {
              meshCount++;
              child.castShadow = true;
              child.receiveShadow = true;
              if (canvasTexture) {
                child.material = fabricMaterial;
              }
            }
          });

          console.log(`[GltfShirtLoader] Modelo CLO3D cargado con éxito (${meshCount} mallas).`);

          resolve({
            scene: wrapper,
            material: fabricMaterial,
            dispose: () => {
              rawModel.traverse((c) => {
                if (c.isMesh) {
                  c.geometry.dispose();
                  if (c.material && c.material.dispose) c.material.dispose();
                }
              });
            }
          });
        },
        undefined,
        (error) => {
          console.error('[GltfShirtLoader] Error al cargar modelo GLB:', error);
          reject(error);
        }
      );
    });
  }

  dispose() {
    this.dracoLoader.dispose();
  }
}
