/**
 * SISTEMA DE PARTÍCULAS MODERNO PARA EL FONDO DEL FORMULARIO AUTH (<150 Líneas)
 * Efecto de polvo cósmico / stardust interactivo a 60 FPS
 */
export class AuthParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext('2d');
    this.particles = [];
    this.numParticles = 36;
    this.animId = null;
    this.mouse = { x: -1000, y: -1000, radius: 90 };
    this.isRunning = false;

    if (this.ctx) {
      this.init();
    }
  }

  init() {
    this.resize();
    this.createParticles();
    this.initEvents();
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('themechange', () => this.createParticles());

    this.canvas.parentElement?.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.parentElement?.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 500, height: 800 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  createParticles() {
    this.particles = [];
    const colorsDark = ['rgba(0, 240, 255, ', 'rgba(168, 85, 247, ', 'rgba(255, 87, 34, ', 'rgba(255, 255, 255, '];
    const colorsLight = ['rgba(99, 102, 241, ', 'rgba(255, 87, 34, ', 'rgba(71, 85, 105, ', 'rgba(148, 163, 184, '];

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const palette = isLight ? colorsLight : colorsDark;

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * (this.width || 500),
        y: Math.random() * (this.height || 800),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.8,
        colorPrefix: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseVal: Math.random() * Math.PI
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.resize();
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  animate() {
    if (!this.isRunning || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineBase = isLight ? 'rgba(99, 102, 241, ' : 'rgba(255, 255, 255, ';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      p.pulseVal += p.pulseSpeed;
      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 1.5;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorPrefix}${currentAlpha})`;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 85) {
          const lineAlpha = (1 - dist2 / 85) * (isLight ? 0.08 : 0.05);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `${lineBase}${lineAlpha})`;
          this.ctx.lineWidth = 0.75;
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }
}
