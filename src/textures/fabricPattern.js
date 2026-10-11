/**
 * Generador de trama textil de algodón y sombreado procedural de arrugas
 */
export function createFabricPatternCanvas(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fondo neutro
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Micro-trama de tejido entrelazado (algodón piqué / jersey)
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Patrón de tejido cruzado
      const weaveX = Math.sin(x * 1.6);
      const weaveY = Math.cos(y * 1.6);
      const noise = (Math.random() - 0.5) * 8;
      const shade = Math.floor(245 + (weaveX * weaveY) * 6 + noise);

      data[idx] = shade;     // R
      data[idx + 1] = shade; // G
      data[idx + 2] = shade; // B
      data[idx + 3] = 255;   // A
    }
  }
  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

/**
 * Aplica sombreado de pliegues sutiles y costuras en las zonas principales
 */
export function drawFabricShading(ctx, width, height) {
  // Sombreado de costuras laterales y cuello
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.18;

  // Sombra suave en cuello frontal
  const gradNeck = ctx.createRadialGradient(512, 180, 50, 512, 180, 300);
  gradNeck.addColorStop(0, 'rgba(0,0,0,0.5)');
  gradNeck.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradNeck;
  ctx.fillRect(200, 50, 624, 300);

  // Sombra suave en cuello posterior
  const gradBackNeck = ctx.createRadialGradient(1536, 180, 50, 1536, 180, 300);
  gradBackNeck.addColorStop(0, 'rgba(0,0,0,0.5)');
  gradBackNeck.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradBackNeck;
  ctx.fillRect(1224, 50, 624, 300);

  // Pliegues sutiles de caída en el torso
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.ellipse(512, 1100, 260, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
