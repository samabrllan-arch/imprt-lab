/**
 * Cinemática y física de la locomoción humana para prendas de vestir (Catwalk Kinematics)
 * Modela el centro de masas, bamboleo pélvico, contrarrotación torácica y pulso de zancada.
 */

export const WALK_PRESETS = {
  catwalk: {
    id: 'catwalk',
    name: '✨ Pasarela Alta Costura',
    cadenceBpm: 104,
    bobbingAmp: 0.024,
    swayAmp: 0.038,
    yawAmp: 0.042,
    pitchAmp: 0.015,
    waveAmp: 0.022,
    windAmp: 0.009,
    stiffness: 0.55
  },
  street: {
    id: 'street',
    name: '🚶 Paseo Urbano Streetwear',
    cadenceBpm: 118,
    bobbingAmp: 0.032,
    swayAmp: 0.022,
    yawAmp: 0.028,
    pitchAmp: 0.018,
    waveAmp: 0.016,
    windAmp: 0.007,
    stiffness: 0.65
  },
  brisk: {
    id: 'brisk',
    name: '🏃 Paso Rápido Dinámico',
    cadenceBpm: 136,
    bobbingAmp: 0.042,
    swayAmp: 0.018,
    yawAmp: 0.034,
    pitchAmp: 0.024,
    waveAmp: 0.026,
    windAmp: 0.014,
    stiffness: 0.50
  },
  paused: {
    id: 'paused',
    name: '🧘 Estático / Showroom',
    cadenceBpm: 0,
    bobbingAmp: 0,
    swayAmp: 0,
    yawAmp: 0,
    pitchAmp: 0,
    waveAmp: 0,
    windAmp: 0,
    stiffness: 0.70
  }
};

export class WalkKinematics {
  constructor(initialPreset = 'catwalk') {
    this.params = { ...WALK_PRESETS[initialPreset] };
    this.isWalking = initialPreset !== 'paused';
    this.walkTime = 0;
  }

  setPreset(presetKey) {
    if (WALK_PRESETS[presetKey]) {
      this.params = { ...WALK_PRESETS[presetKey] };
      this.isWalking = presetKey !== 'paused';
    }
  }

  update(dt, shirtGroup, shadowMesh, runwayTexture, shaderUniforms) {
    if (!this.isWalking || this.params.cadenceBpm <= 0) {
      if (shaderUniforms) shaderUniforms.uIsWalking.value = 0.0;
      if (shirtGroup) {
        shirtGroup.position.set(0, 0, 0);
        shirtGroup.rotation.set(0, 0, 0);
      }
      return;
    }

    // Frecuencia angular en base a cadencia (pasos por minuto a radianes/seg)
    // 2 pasos = 1 zancada completa
    const strideFreq = (this.params.cadenceBpm / 60) * Math.PI;
    this.walkTime += dt * (this.params.cadenceBpm / 110);
    const phase = this.walkTime * strideFreq;

    // 1. Rebote vertical (2 rebotes por zancada completa)
    // Forma de parábola suave de contacto talón / despegue
    const doublePhase = phase * 2.0;
    const verticalBob = (Math.sin(doublePhase) * 0.5 + 0.5) * this.params.bobbingAmp - (this.params.bobbingAmp * 0.5);

    // 2. Bamboleo lateral (Roll en eje Z: el torso se inclina hacia la pierna de apoyo)
    const lateralRoll = Math.sin(phase) * (this.params.swayAmp * 0.85);

    // 3. Contrarrotación de hombros (Yaw en eje Y)
    const shoulderYaw = Math.cos(phase) * this.params.yawAmp;

    // 4. Inclinación hacia adelante / atrás (Pitch en eje X)
    const forwardPitch = Math.sin(doublePhase) * this.params.pitchAmp + 0.02; // Sutil inclinación aerodinámica

    // 5. Aplicar transformaciones al grupo 3D
    if (shirtGroup) {
      shirtGroup.position.y = verticalBob;
      shirtGroup.position.x = Math.sin(phase) * (this.params.swayAmp * 0.3); // Leve traslación lateral
      shirtGroup.rotation.z = lateralRoll;
      shirtGroup.rotation.y = shoulderYaw;
      shirtGroup.rotation.x = forwardPitch;
    }

    // 6. Pulso de sombra de contacto
    if (shadowMesh) {
      const shadowScale = 1.0 - (verticalBob * 1.8);
      shadowMesh.scale.set(shadowScale, shadowScale, 1.0);
      shadowMesh.material.opacity = 0.75 - (verticalBob * 2.5);
    }

    // 7. Desplazamiento de pasarela (Runway texture scrolling hacia atrás)
    if (runwayTexture) {
      const scrollSpeed = (this.params.cadenceBpm / 120) * 0.55;
      runwayTexture.offset.y = (runwayTexture.offset.y - dt * scrollSpeed) % 1.0;
    }

    // 8. Actualizar uniforms del shader de tela
    if (shaderUniforms) {
      shaderUniforms.uTime.value = this.walkTime;
      shaderUniforms.uWalkSpeed.value = this.params.cadenceBpm / 110;
      shaderUniforms.uIsWalking.value = 1.0;
      shaderUniforms.uBobbingAmp.value = this.params.bobbingAmp;
      shaderUniforms.uSwayAmp.value = this.params.swayAmp;
      shaderUniforms.uWaveAmp.value = this.params.waveAmp;
      shaderUniforms.uWindAmp.value = this.params.windAmp;
      shaderUniforms.uClothStiffness.value = this.params.stiffness;
    }
  }
}
