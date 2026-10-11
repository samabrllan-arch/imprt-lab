import { getAssetPath } from '../config/paths.js';

/**
 * Sección "Tecnología & Materiales Textiles" (NODE-014/NODE-015)
 * Tarjetas fotográficas con macrografías generadas por IA, badges técnicos
 * y estética Cyber-Luxury para presentar algodón 240g, dry-fit y DTF.
 */
export function initFeaturesSection(container) {
  if (!container) return;

  const features = [
    {
      id: 'cotton',
      badge: '240 GSM Heavyweight',
      image: getAssetPath('assets/features/feature_cotton.webp'),
      alt: 'Macro fotografía de tejido cerrado de algodón 240g',
      icon: '🧵',
      title: 'Algodón 100% Peinado',
      desc: 'Tejido cerrado con caída pesada estructurada (180g y 240g) y cuello rib cerrado de 3 cm indeformable.',
      tags: ['Caída Pesada', 'Cuello Rib 3cm']
    },
    {
      id: 'microfiber',
      badge: 'Dry-Fit Performance',
      image: getAssetPath('assets/features/feature_microfiber.webp'),
      alt: 'Deportista en carrera con camiseta de microfibra dry-fit transpirable',
      icon: '⚡',
      title: 'Poliéster Dry-Fit (120g/180g)',
      desc: 'Microfibra deportiva transpirable ultra liviana de secado rápido, elasticidad mecánica y frescura para alto rendimiento.',
      tags: ['Microfibra Pro', 'Secado Rápido']
    },
    {
      id: 'dtf_drops',
      badge: 'Microgotas 1200 DPI',
      image: getAssetPath('assets/features/feature_dtf_drops.webp'),
      alt: 'Cabezal de impresión DTF proyectando microgotas de tinta textil',
      icon: '🎨',
      title: 'Cero Límite de Colores',
      desc: 'Impresión digital con microgotas de tinta textil. Reproduce gradientes fotográficos, ilustraciones complejas y tipografías ultra finas.',
      tags: ['Full Color HD', 'Gradientes Vivos']
    },
    {
      id: 'durability',
      badge: 'Curado Térmico 160°C',
      image: getAssetPath('assets/features/feature_durability.webp'),
      alt: 'Prueba de elasticidad y termocurado de poliamida DTF',
      icon: '🛡️',
      title: '+60 Lavados Intactos',
      desc: 'Poliamida elástica de curado térmico. El estampado se estira con la tela y resiste lavadoras sin cuartearse ni perder tono.',
      tags: ['Anti-Cuarteo', 'Elongación Máxima']
    }
  ];

  container.innerHTML = `
    <section class="features-section" id="calidad">
      <div class="landing-container">
        <div class="section-header-box">
          <span class="section-eyebrow">TECNOLOGÍA & MATERIALES TEXTILES</span>
          <h2 class="section-title">Algodón, Poliéster y DTF de Grado Superior</h2>
          <p class="section-description">Prendas confeccionadas en múltiples gramajes y fibras técnicas con impresión digital directa al film curada a 160°C.</p>
        </div>
        <div class="features-grid">
          ${features.map(f => `
            <article class="feature-card" data-feature="${f.id}">
              <div class="feature-card-media">
                <img src="${f.image}" alt="${f.alt}" class="feature-card-img" width="400" height="250" loading="lazy" decoding="async" />
                <div class="feature-card-overlay"></div>
                <span class="feature-badge">${f.badge}</span>
              </div>
              <div class="feature-card-body">
                <div class="feature-title-row">
                  <span class="feature-mini-icon">${f.icon}</span>
                  <h3 class="feature-title">${f.title}</h3>
                </div>
                <p class="feature-description">${f.desc}</p>
                <div class="feature-tags-row">
                  ${f.tags.map(t => `<span class="feature-pill-tag">${t}</span>`).join('')}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
