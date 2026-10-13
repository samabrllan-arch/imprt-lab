import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { getAssetPath } from '../config/paths.js';

/**
 * Cargador de modelos GLTF/GLB optimizados con compresión Draco y UVs preservadas
 */
export class GltfShirtLoader {
  constructor() {
    this.dracoLoader = new DRACOLoader();
    // Decodificador Draco local servido desde public/draco/
    this.dracoLoader.setDecoderPath(getAssetPath('draco/'));
    this.dracoLoader.setDecoderConfig({ type: 'js' });

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  /**
   * Carga y centra el modelo de camiseta CLO3D
   */
  async loadModel(url, canvasTexture) {
    const targetUrl = getAssetPath(url);
    const isMug = targetUrl.includes('mug_11oz');
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        targetUrl,
        (gltf) => {
          const rawModel = gltf.scene;

          // 1. Material PBR (Tela de algodón mate o Cerámica esmaltada brillante para Vaso 11 Oz)
          const fabricMaterial = new THREE.MeshStandardMaterial({
            map: canvasTexture,
            roughness: isMug ? 0.16 : 0.88,
            metalness: isMug ? 0.04 : 0.02,
            side: THREE.DoubleSide
          });

          // Uniformes reactivos para color base y efecto Mug Mágico Termosensible
          fabricMaterial.userData.uBaseFabricColor = { value: new THREE.Color(0xffffff) };
          fabricMaterial.userData.uIsMug = { value: isMug ? 1.0 : 0.0 };
          fabricMaterial.userData.uIsMagicMug = { value: 0.0 };
          fabricMaterial.userData.uHeatLevel = { value: 0.0 };

          fabricMaterial.customProgramCacheKey = () => (isMug ? 'mug_thermochromic_v7' : 'clo_fabric_material_v7');

          // Inyección de shader: Aísla interior y simula recubrimiento termocrómico (Mug Mágico)
          fabricMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.uBaseFabricColor = fabricMaterial.userData.uBaseFabricColor;
            shader.uniforms.uIsMug = fabricMaterial.userData.uIsMug;
            shader.uniforms.uIsMagicMug = fabricMaterial.userData.uIsMagicMug;
            shader.uniforms.uHeatLevel = fabricMaterial.userData.uHeatLevel;

            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              uniform float uIsMug;
              varying float vIsInnerLining;
              varying vec3 vLocalPos;`
            );

            shader.vertexShader = shader.vertexShader.replace(
              '#include <beginnormal_vertex>',
              `#include <beginnormal_vertex>
              if (uIsMug > 0.5) {
                float rWall = length(position.xz);
                float outerWallMask = smoothstep(0.433, 0.440, rWall) * (1.0 - smoothstep(0.456, 0.464, rWall))
                                    * (1.0 - smoothstep(0.39, 0.44, abs(position.y)))
                                    * (1.0 - smoothstep(0.35, 0.41, position.x));
                vec3 idealCylNormal = normalize(vec3(position.x, 0.0, position.z));
                objectNormal = normalize(mix(objectNormal, idealCylNormal, outerWallMask));
                float innerFloorMask = (1.0 - smoothstep(0.38, 0.415, rWall))
                                     * smoothstep(-0.475, -0.465, position.y)
                                     * (1.0 - smoothstep(-0.450, -0.435, position.y));
                objectNormal = normalize(mix(objectNormal, vec3(0.0, 1.0, 0.0), innerFloorMask));
              }`
            );

            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
              float isInner = 0.0;
              if (position.y > 0.50 && length(position.xz) < 0.11) {
                if (dot(normal.xz, position.xz) < 0.0) {
                  isInner = 1.0;
                }
              }
              vIsInnerLining = isInner;
              vLocalPos = position;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
              uniform vec3 uBaseFabricColor;
              uniform float uIsMug;
              uniform float uIsMagicMug;
              uniform float uHeatLevel;
              varying float vIsInnerLining;
              varying vec3 vLocalPos;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `#ifdef USE_MAP
                if (uIsMug > 0.5) {
                  vec4 texelColor = texture2D( map, vMapUv );
                  // Máscara 3D cilíndrica suave: paredes internas + fondo interno (y=-0.4615) + borde superior en blanco porcelana puro
                  float rCyl = length(vLocalPos.xz);
                  float innerMask = (1.0 - smoothstep(0.428, 0.434, rCyl)) * smoothstep(-0.485, -0.468, vLocalPos.y);
                  vec3 porcelainWhite = vec3(0.98, 0.98, 1.0);
                  if (uIsMagicMug > 0.5) {
                    vec3 magicBlack = vec3(0.055, 0.06, 0.075);
                    float hNorm = clamp(vLocalPos.y + 0.5, 0.0, 1.0);
                    float wave = sin(vLocalPos.x * 16.0 + uHeatLevel * 9.0) * 0.018 + cos(vLocalPos.z * 16.0 - uHeatLevel * 6.0) * 0.012;
                    float front = uHeatLevel * 1.22 - 0.11 + wave;
                    float reveal = step(0.005, uHeatLevel) * (1.0 - smoothstep(front - 0.05, front + 0.05, hNorm));
                    float edgeGlow = smoothstep(0.0, 0.5, reveal) * smoothstep(1.0, 0.5, reveal) * 4.0;
                    float activeHeat = step(0.01, uHeatLevel) * step(uHeatLevel, 0.99);
                    vec3 reacted = mix(magicBlack, texelColor.rgb, reveal);
                    reacted += vec3(1.0, 0.30, 0.06) * edgeGlow * activeHeat * 0.45;
                    diffuseColor.rgb *= mix(reacted, porcelainWhite, innerMask);
                  } else {
                    diffuseColor.rgb *= mix(texelColor.rgb, porcelainWhite, innerMask);
                  }
                } else if (!gl_FrontFacing || vIsInnerLining > 0.5) {
                  diffuseColor.rgb = uBaseFabricColor * 0.88;
                } else {
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

          // Orientar el vaso para que el lado opuesto al asa (donde inicia la imagen, x=1044) mire al frente (+Z)
          if (isMug) {
            rawModel.rotation.y = Math.PI * 0.5;
          }

          // 2. Calcular caja delimitadora y centrar el modelo en (0, 0, 0)
          const bbox = new THREE.Box3().setFromObject(rawModel);
          const size = new THREE.Vector3();
          bbox.getSize(size);
          const center = new THREE.Vector3();
          bbox.getCenter(center);

          // Escalar (1.05 para camisetas, 0.78 para Vaso 11 Oz para encuadre de estudio ideal)
          const targetHeight = isMug ? 0.78 : 1.05;
          const scaleFactor = targetHeight / (size.y || 1);

          // En el vaso el eje del cilindro ya está en (0,0) local; mantenemos su eje centrado al rotar
          rawModel.position.x = isMug ? 0 : -center.x;
          rawModel.position.y = -center.y;
          rawModel.position.z = isMug ? 0 : -center.z;

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
              child.receiveShadow = !isMug;
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
