/**
 * Política legal de 3D Shirt Studio (NODE-025): propiedad intelectual, indemnidad y datos personales.
 * Fuente única: la consumen `legalTermsModal.js` (visor) y `userProfileModal.js` (consentimiento).
 *
 * ⚠️ Texto operativo redactado a partir del requerimiento del negocio. No sustituye la revisión
 * de un abogado (Ley 23/1982, Decisión Andina 351, Ley 1581/2012, Ley 1480/2011).
 * Si cambia el contenido, SUBE `LEGAL_TERMS_VERSION`: así se sabe qué versión aceptó cada usuario.
 */
export const LEGAL_TERMS_VERSION = '1.1.0';
export const LEGAL_TERMS_UPDATED = '2026-10-08';
export const LEGAL_TERMS_TITLE = 'Términos de Servicio & Declaración de Propiedad Intelectual';
export const LEGAL_INTRO =
  '3D Shirt Studio es un servicio de personalización y manufactura textil bajo demanda (impresión DTF). ' +
  'Al cargar archivos en el Estudio 3D o confirmar un pedido, aceptas las siguientes condiciones.';

/** Aviso destacado al inicio del visor (resumen, no sustituye las cláusulas). */
export const LEGAL_CALLOUT =
  'Imprime únicamente diseños propios o con licencia. Eres el responsable de los archivos que cargas.';

/** Texto corto del checkbox de consentimiento (perfil del cliente). */
export const LEGAL_CONSENT_LABEL =
  'Acepto los Términos de Servicio y declaro la titularidad de los derechos de autor de mis imágenes.';

/**
 * Cláusulas. `tone` define el énfasis visual: 'warning' (alerta ámbar), 'danger' (rojo), 'info' (neutro/azul).
 */
export const LEGAL_SECTIONS = [
  {
    id: 'titularidad',
    title: 'Declaración y Garantía de Titularidad del Usuario',
    tone: 'warning',
    text:
      'El Usuario declara, garantiza y certifica bajo gravedad de juramento que es el único autor y titular patrimonial ' +
      'de las obras, imágenes, gráficos, marcas, logotipos y textos que carga en el Estudio 3D, o que cuenta con las ' +
      'licencias, autorizaciones expresas y derechos comerciales suficientes de los titulares legítimos para su fijación ' +
      'y reproducción en prendas textiles.'
  },
  {
    id: 'exclusion',
    title: 'Exclusión Total de Responsabilidad de la Plataforma (Prestador Técnico)',
    tone: 'warning',
    text:
      '3D Shirt Studio opera exclusivamente como un facilitador tecnológico y taller de manufactura bajo demanda ' +
      'automatizada. La plataforma NO realiza curaduría editorial, validación previa de autoría ni verificación de ' +
      'derechos sobre los archivos provistos. En consecuencia, la plataforma, sus administradores, socios y operarios ' +
      'quedan plenamente exentos de cualquier responsabilidad civil, comercial, administrativa o penal derivada de ' +
      'infracciones a leyes de propiedad intelectual, derechos de autor o marcas registradas cometidas por el Usuario.'
  },
  {
    id: 'indemnidad',
    title: 'Cláusula de Indemnidad (Hold Harmless)',
    tone: 'warning',
    text:
      'El Usuario se obliga expresamente a defender, indemnizar y mantener indemne a 3D Shirt Studio, a sus administradores, ' +
      'socios y operarios frente a cualquier ' +
      'reclamo, querella, demanda, requerimiento extrajudicial, sanción gubernamental o litigio promovido por terceros ' +
      'derivado directa o indirectamente de la impresión, comercialización o exhibición de los archivos cargados, ' +
      'asumiendo la totalidad de los costos legales, honorarios de abogados y eventuales indemnizaciones impuestas.'
  },
  {
    id: 'ilicitos',
    title: 'Contenidos Ilícitos y Derecho de Rechazo Unilateral',
    tone: 'danger',
    text:
      'Queda estrictamente prohibida la carga de material que incite al odio, violencia, discriminación, pornografía ' +
      'infantil, difamación, símbolos prohibidos por ley o marcas notorias utilizadas sin autorización. La plataforma se reserva el derecho unilateral e inapelable ' +
      'de anular cualquier orden y destruir impresiones que presuntamente vulneren estos principios, sin lugar a reembolso.'
  },
  {
    id: 'habeas-data',
    title: 'Tratamiento de Datos Personales (Habeas Data)',
    tone: 'info',
    text:
      'Los datos personales recopilados se usarán exclusivamente para la liquidación de órdenes, comunicación logística ' +
      'vía WhatsApp y despacho de prendas.'
  }
];
