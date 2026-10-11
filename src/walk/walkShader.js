/**
 * Hook de Vertex Shader para simulación de tela en movimiento (Catwalk Walk Cycle)
 * Inyecta deformación aerodinámica, inercia de caída y micro-arrugas de marcha sobre MeshStandardMaterial.
 */

export function attachWalkShader(material, params = {}) {
  const uniforms = {
    uTime: { value: 0 },
    uWalkSpeed: { value: params.walkSpeed ?? 1.0 },
    uIsWalking: { value: params.isWalking ? 1.0 : 0.0 },
    uBobbingAmp: { value: params.bobbingAmp ?? 0.025 },
    uSwayAmp: { value: params.swayAmp ?? 0.022 },
    uWaveAmp: { value: params.waveAmp ?? 0.016 },
    uWindAmp: { value: params.windAmp ?? 0.007 },
    uClothStiffness: { value: params.stiffness ?? 0.6 }
  };

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    material.userData.shaderUniforms = uniforms;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uWalkSpeed;
      uniform float uIsWalking;
      uniform float uBobbingAmp;
      uniform float uSwayAmp;
      uniform float uWaveAmp;
      uniform float uWindAmp;
      uniform float uClothStiffness;
    ` + shader.vertexShader;

    const beginVertexHook = `
      #include <begin_vertex>
      if (uIsWalking > 0.01) {
        float t = uTime * uWalkSpeed;
        
        // Peso vertical: hombros/cuello (y > 0.35) anclados; faldón inferior (y < -0.35) oscila libre
        float normY = clamp((0.45 - position.y) / 0.90, 0.0, 1.0);
        float hemWeight = pow(normY, 1.35);

        // Frecuencias armónicas de la zancada humana
        float strideCycle = t * 3.14159265;     // 1 ciclo por paso
        float doubleCadence = strideCycle * 2.0; // 2 rebotes por zancada completa

        // Inercia lateral y retardo de fase hacia la parte baja de la camiseta
        float phaseDelay = (0.5 - position.y) * 2.8;
        float lateralSwing = sin(strideCycle - phaseDelay) * uSwayAmp * (0.2 + 0.8 * hemWeight);

        // Inercia sagital (avance/retroceso de tela según aceleración del torso)
        float forwardInertia = cos(doubleCadence - phaseDelay * 0.7) * (uBobbingAmp * 0.7) * hemWeight;

        // Micro-ondulación por resistencia del aire al avanzar (pliegues dinámicos)
        float windWave = sin(t * 7.5 - position.y * 14.0 + position.x * 5.0) * uWindAmp * hemWeight;
        float microWrinkle = cos(t * 13.0 - position.y * 22.0 - position.x * 7.0) * (uWindAmp * 0.45) * hemWeight;

        // Deformación de vértices con amortiguación de rigidez textil
        float flex = 1.0 - (uClothStiffness * 0.4);
        transformed.x += lateralSwing * flex;
        transformed.z += (forwardInertia + windWave + microWrinkle) * flex;

        // Sutil respiración elástica de costados
        transformed.x += sin(strideCycle * 0.5) * 0.003 * hemWeight;
      }
    `;

    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', beginVertexHook);
  };

  material.needsUpdate = true;
  return uniforms;
}
