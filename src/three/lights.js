import * as THREE from 'three';

export class StudioLighting {
  constructor(scene) {
    this.scene = scene;
    this.setupLights();
  }

  setupLights() {
    // 1. Luz de ambiente equilibrada para sombras naturales
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // 2. Luz Principal (Key Light): Desde el frente-arriba a la derecha
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    keyLight.position.set(2.5, 3.5, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // 3. Luz de Relleno (Fill Light): Desde la izquierda para suavizar contrastes
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-2.5, 1.5, 2.0);
    this.scene.add(fillLight);

    // 4. Luz de Borde / Contraluz (Rim Light): Resalta la silueta y mangas desde atrás
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLight.position.set(0, 3.0, -3.0);
    this.scene.add(rimLight);

    // 5. Suave luz inferior de rebote
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.35);
    bounceLight.position.set(0, -2.5, 1.0);
    this.scene.add(bounceLight);
  }
}
