import * as THREE from 'three';

/**
 * Generador procedural de geometría de camiseta estilizada con mapeo UV para estampados
 */
export class ShirtModel {
  constructor(texture) {
    this.texture = texture;
    this.group = new THREE.Group();
    this.createShirtMesh();
  }

  createShirtMesh() {
    // 1. Material PBR de tela de algodón
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
      roughness: 0.86,
      metalness: 0.03,
      side: THREE.DoubleSide
    });

    // 2. Geometría anatómica del Torso (Oversize moderno)
    const torsoGeom = this.generateTorsoGeometry();
    const torsoMesh = new THREE.Mesh(torsoGeom, this.material);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.group.add(torsoMesh);

    // 3. Manga Izquierda
    const sleeveLGeom = this.generateSleeveGeometry(-1);
    const sleeveLMesh = new THREE.Mesh(sleeveLGeom, this.material);
    sleeveLMesh.castShadow = true;
    sleeveLMesh.receiveShadow = true;
    this.group.add(sleeveLMesh);

    // 4. Manga Derecha
    const sleeveRGeom = this.generateSleeveGeometry(1);
    const sleeveRMesh = new THREE.Mesh(sleeveRGeom, this.material);
    sleeveRMesh.castShadow = true;
    sleeveRMesh.receiveShadow = true;
    this.group.add(sleeveRMesh);

    // 5. Cuello Acanalado (Ribbed Collar)
    const collarGeom = this.generateCollarGeometry();
    const collarMesh = new THREE.Mesh(collarGeom, this.material);
    collarMesh.castShadow = true;
    collarMesh.receiveShadow = true;
    this.group.add(collarMesh);

    // Centrar en el origen óptimo
    this.group.position.set(0, -0.05, 0);
  }

  generateTorsoGeometry() {
    const radialSegments = 48;
    const heightSegments = 32;
    const geom = new THREE.CylinderGeometry(0.38, 0.41, 0.95, radialSegments, heightSegments, true);
    const pos = geom.attributes.position;
    const uv = geom.attributes.uv;

    // Modificar vértices para dar forma de camiseta y silueta de pecho/espalda
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Aplanar suavemente en Z (pecho/espalda no son cilíndricos puros)
      const depthFactor = 0.58;
      const newZ = z * depthFactor;

      // Ensanchamiento en los hombros hacia arriba
      const shoulderSpread = Math.max(0, y + 0.2) * 0.28;
      const newX = x > 0 ? x + shoulderSpread : x - shoulderSpread;

      // Caída natural del pecho
      const chestBulge = Math.exp(-Math.pow(y - 0.15, 2) / 0.05) * Math.max(0, newZ) * 0.22;

      pos.setXYZ(i, newX, y, newZ + chestBulge);

      // Asignar coordenadas UV precisas
      const isFront = newZ >= 0;
      const normY = 1.0 - (y + 0.475) / 0.95; // 0 (arriba) a 1 (abajo)

      if (isFront) {
        // Cuadrante Frente: Centro en (0.25, 0.5) del canvas
        const normX = 0.25 + (newX / 0.85) * 0.22;
        uv.setXY(i, normX, 1.0 - (0.15 + normY * 0.7));
      } else {
        // Cuadrante Espalda: Centro en (0.75, 0.5) del canvas
        const normX = 0.75 - (newX / 0.85) * 0.22;
        uv.setXY(i, normX, 1.0 - (0.15 + normY * 0.7));
      }
    }

    geom.computeVertexNormals();
    return geom;
  }

  generateSleeveGeometry(side = 1) { // side: 1 = derecha, -1 = izquierda
    const radialSegments = 32;
    const heightSegments = 16;
    const geom = new THREE.CylinderGeometry(0.17, 0.19, 0.38, radialSegments, heightSegments, true);
    const pos = geom.attributes.position;
    const uv = geom.attributes.uv;

    // Transformar para que se acople naturalmente al hombro
    geom.rotateZ(side * Math.PI * 0.28);
    geom.rotateX(0.08);
    geom.translate(side * 0.46, 0.24, 0);

    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i);
      const v = uv.getY(i);

      if (side === -1) {
        // Manga Izquierda: Cuadrante (0.10, 0.80)
        uv.setXY(i, 0.03 + u * 0.15, 0.7 + v * 0.15);
      } else {
        // Manga Derecha: Cuadrante (0.90, 0.80)
        uv.setXY(i, 0.82 + u * 0.15, 0.7 + v * 0.15);
      }
    }

    geom.computeVertexNormals();
    return geom;
  }

  generateCollarGeometry() {
    const geom = new THREE.TorusGeometry(0.18, 0.022, 16, 40);
    geom.rotateX(Math.PI * 0.46);
    geom.scale(1.15, 0.95, 1.0);
    geom.translate(0, 0.46, 0.02);
    return geom;
  }

  updateMaterialColor(hex) {
    if (this.material) {
      // El color base lo provee el canvas de textura,
      // pero mantenemos el color del material blanco para multiplicación limpia
      this.material.color.set(0xffffff);
      this.material.needsUpdate = true;
    }
  }

  getMesh() {
    return this.group;
  }

  dispose() {
    this.group.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
      }
    });
    this.material.dispose();
  }
}
