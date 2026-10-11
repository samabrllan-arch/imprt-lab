/**
 * MIDDLEWARE DE SEGURIDAD Y DEFENSA ACTIVA (OWASP)
 * Protecciones contra DoS, Brute-Force, Parameter Tampering, CSRF y Header Injection.
 */

// 1. Cabeceras de seguridad HTTP (Hardening equivalente a Helmet)
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

// 2. Blindaje Anti-CSRF: Exigir Content-Type JSON en métodos mutables
export function requireJsonBody(req, res, next) {
  const method = req.method.toUpperCase();
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 0 && !req.is('application/json')) {
      return res.status(415).json({
        error: 'Tipo de contenido no admitido. Se requiere application/json.'
      });
    }
  }
  next();
}

// 3. Rate Limiter en memoria con ventana deslizante
class MemoryRateLimiter {
  constructor({ windowMs = 60000, maxRequests = 100, message = 'Demasiadas solicitudes. Intenta más tarde.' }) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message;
    this.hits = new Map();
  }

  middleware() {
    return (req, res, next) => {
      // Excluir entorno de pruebas si no se desea limitar
      if (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
        return next();
      }

      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const clientRecord = this.hits.get(ip) || [];

      // Filtrar solicitudes fuera de la ventana de tiempo
      const recentHits = clientRecord.filter(timestamp => now - timestamp < this.windowMs);

      if (recentHits.length >= this.maxRequests) {
        const retryAfter = Math.ceil((this.windowMs - (now - recentHits[0])) / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({ error: this.message, retryAfterSeconds: retryAfter });
      }

      recentHits.push(now);
      this.hits.set(ip, recentHits);
      next();
    };
  }

  reset() {
    this.hits.clear();
  }
}

// Rate Limiter general para API (200 req / minuto)
export const globalApiLimiter = new MemoryRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 200,
  message: 'Límite de solicitudes a la API excedido. Por favor espera un momento.'
}).middleware();

// Rate Limiter estricto para Auth (Login/Register: máx 10 peticiones por 5 minutos)
export const authLimiter = new MemoryRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 10,
  message: 'Demasiados intentos de autenticación. Por seguridad, espera 5 minutos.'
}).middleware();

// 4. Validadores estrictos de tipos y sanitización (Anti-Type Confusion & XSS)
export function sanitizeString(val, maxLen = 255) {
  if (typeof val !== 'string') return '';
  return val
    .trim()
    .replace(/<[^>]*>?/gm, '') // Eliminar tags HTML completos (<script>...</script>)
    .replace(/[<>]/g, '')       // Eliminar corchetes angulares residuales
    .slice(0, maxLen);
}

export function isValidPositiveIntId(id) {
  return typeof id === 'string' && /^\d+$/.test(id) && parseInt(id, 10) > 0;
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length > 255) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);
}

export function isValidSafeUrl(url) {
  if (typeof url !== 'string') return false;
  if (url.length > 2000) return false;
  // Permitir solo HTTPS o Data URIs para imágenes seguras
  return (
    url.startsWith('https://') ||
    url.startsWith('data:image/') ||
    url.startsWith('http://localhost')
  );
}
