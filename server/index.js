import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { initSchema } from './db/schema.js';
import { getDb } from './db/connection.js';
import { securityHeaders, requireJsonBody, globalApiLimiter } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import designsRoutes from './routes/designsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

export const app = express();

// Hardening de cabeceras HTTP (Anti-sniff, Clickjacking, XSS)
app.use(securityHeaders);

app.use(cors({
  origin: '*', // En producción puede configurarse a dominios específicos de Render / Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Test-Rate-Limit']
}));

// Límite de tamaño en payload para mitigar DoS
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Anti-CSRF: forzar JSON en mutaciones
app.use(requireJsonBody);

// Rate Limiter general para mitigar ataques de denegación de servicio
app.use(globalApiLimiter);

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/designs', designsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload-link', uploadRoutes);

// Health check para Render y monitorización
app.get('/api/health', async (req, res) => {
  try {
    const { type } = await getDb();
    res.json({
      status: 'ok',
      service: '3D Shirt Studio API',
      database: type === 'mysql' ? 'MySQL (Tiplou / TiDB)' : 'SQLite Local',
      driveFolder: CONFIG.driveFolderId,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Manejador 404 para rutas API no encontradas
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado.' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

export async function startServer() {
  await initSchema();
  return app.listen(CONFIG.port, '0.0.0.0', () => {
    console.log(`🚀 [Server] 3D Shirt Studio API corriendo en http://0.0.0.0:${CONFIG.port}`);
  });
}

// Iniciar automáticamente únicamente si se ejecuta directamente como script
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) ||
  process.argv[1].replace(/\\/g, '/').endsWith('server/index.js')
);

if (isDirectExecution) {
  startServer().catch(err => {
    console.error('Error fatal al iniciar servidor:', err);
    process.exit(1);
  });
}
