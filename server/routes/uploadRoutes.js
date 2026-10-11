import { Router } from 'express';
import { query, queryOne, execute } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { sanitizeString, isValidSafeUrl } from '../middleware/security.js';

const router = Router();

// Registrar enlace de imagen subida a Google Drive con validación estricta
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      driveFileId,
      driveFileUrl,
      originalName = 'estampado.png',
      mimeType = 'image/png',
      fileSizeBytes = null,
      designId = null
    } = req.body || {};

    if (typeof driveFileId !== 'string' || typeof driveFileUrl !== 'string') {
      return res.status(400).json({
        error: 'driveFileId y driveFileUrl deben ser cadenas de texto válidas.'
      });
    }

    const cleanFileId = sanitizeString(driveFileId, 150);
    const cleanUrl = driveFileUrl.trim();

    if (!cleanFileId || !cleanUrl) {
      return res.status(400).json({
        error: 'driveFileId y driveFileUrl son obligatorios para registrar el activo de Google Drive.'
      });
    }

    if (!isValidSafeUrl(cleanUrl)) {
      return res.status(400).json({
        error: 'driveFileUrl debe ser un enlace seguro válido (HTTPS).'
      });
    }

    const cleanOriginalName = sanitizeString(String(originalName), 255);
    const cleanMime = sanitizeString(String(mimeType), 100);
    const validSize = Number.isInteger(fileSizeBytes) && fileSizeBytes >= 0 ? fileSizeBytes : null;
    const validDesignId = Number.isInteger(designId) && designId > 0 ? designId : null;

    const result = await execute(
      `INSERT INTO design_assets (
        design_id, user_id, drive_file_id, drive_file_url, original_name,
        mime_type, file_size_bytes, is_unlinked
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        validDesignId,
        req.user.id,
        cleanFileId,
        cleanUrl,
        cleanOriginalName,
        cleanMime,
        validSize
      ]
    );

    const asset = await queryOne(
      'SELECT * FROM design_assets WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Enlace de Google Drive registrado exitosamente.',
      asset
    });
  } catch (err) {
    console.error('Error al registrar enlace de Drive:', err);
    return res.status(500).json({ error: 'Error al registrar el activo de imagen.' });
  }
});

// Listar imágenes activas del usuario en Google Drive
router.get('/my-assets', requireAuth, async (req, res) => {
  try {
    const assets = await query(
      `SELECT id, design_id, drive_file_id, drive_file_url, original_name,
              mime_type, file_size_bytes, created_at
       FROM design_assets
       WHERE user_id = ? AND is_unlinked = 0
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json({ assets, count: assets.length });
  } catch (err) {
    console.error('Error al obtener activos del usuario:', err);
    return res.status(500).json({ error: 'Error al obtener tus activos.' });
  }
});

export default router;
