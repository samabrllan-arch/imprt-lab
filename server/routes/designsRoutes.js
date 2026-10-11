import { Router } from 'express';
import { query, queryOne, execute } from '../db/connection.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { sanitizeString, isValidSafeUrl, isValidPositiveIntId } from '../middleware/security.js';

const router = Router();

function formatDesign(row) {
  if (!row) return null;
  let parsedDecal = null;
  if (row.decal_config) {
    try {
      parsedDecal = typeof row.decal_config === 'string'
        ? JSON.parse(row.decal_config)
        : row.decal_config;
    } catch {
      parsedDecal = row.decal_config;
    }
  }

  return {
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name || null,
    title: row.title,
    gender: row.gender,
    shirtColor: row.shirt_color,
    collarColor: row.collar_color,
    cuffColor: row.cuff_color,
    innerCollarColor: row.inner_collar_color,
    fabricType: row.fabric_type,
    decalConfig: parsedDecal,
    previewImageUrl: row.preview_image_url,
    isPublic: Boolean(row.is_public),
    likesCount: row.likes_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// 1. Guardar nuevo diseño 3D con validación estricta de tipos y sanitización
router.post('/', requireAuth, async (req, res) => {
  try {
    const body = req.body || {};

    const cleanTitle = sanitizeString(body.title || 'Diseño Sin Título', 120);
    const cleanGender = body.gender === 'woman' ? 'woman' : 'man';
    const cleanShirtColor = sanitizeString(body.shirtColor || '#111111', 30);
    const cleanCollarColor = sanitizeString(body.collarColor || '#111111', 30);
    const cleanCuffColor = sanitizeString(body.cuffColor || '#111111', 30);
    const cleanInnerCollarColor = sanitizeString(body.innerCollarColor || '#111111', 30);
    const cleanFabricType = sanitizeString(body.fabricType || 'cotton', 50);

    // Validación segura de URLs de Google Drive
    const previewImageUrl = (body.previewImageUrl && isValidSafeUrl(body.previewImageUrl))
      ? body.previewImageUrl
      : null;

    const driveFileUrl = (body.driveFileUrl && isValidSafeUrl(body.driveFileUrl))
      ? body.driveFileUrl
      : null;

    const driveFileId = body.driveFileId ? sanitizeString(String(body.driveFileId), 150) : null;
    const originalName = body.originalName ? sanitizeString(String(body.originalName), 255) : null;
    const mimeType = body.mimeType ? sanitizeString(String(body.mimeType), 100) : 'image/png';
    const fileSizeBytes = Number.isInteger(body.fileSizeBytes) ? body.fileSizeBytes : null;
    const publicFlag = body.isPublic ? 1 : 0;

    let decalJson = null;
    if (body.decalConfig) {
      try {
        const rawJson = typeof body.decalConfig === 'string'
          ? body.decalConfig
          : JSON.stringify(body.decalConfig);
        // Límite de 50KB en decal config para mitigar JSON bombs
        if (rawJson.length <= 50000) decalJson = rawJson;
      } catch (_) {}
    }

    const result = await execute(
      `INSERT INTO designs (
        user_id, title, gender, shirt_color, collar_color, cuff_color,
        inner_collar_color, fabric_type, decal_config, preview_image_url, is_public
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, cleanTitle, cleanGender, cleanShirtColor, cleanCollarColor,
        cleanCuffColor, cleanInnerCollarColor, cleanFabricType, decalJson,
        previewImageUrl, publicFlag
      ]
    );

    const designId = result.insertId;

    // Registrar activo en Google Drive si se proporciona
    if (driveFileId || driveFileUrl) {
      await execute(
        `INSERT INTO design_assets (
          design_id, user_id, drive_file_id, drive_file_url, original_name,
          mime_type, file_size_bytes, is_unlinked
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          designId,
          req.user.id,
          driveFileId || `drive_${Date.now()}`,
          driveFileUrl || previewImageUrl,
          originalName,
          mimeType,
          fileSizeBytes
        ]
      );
    }

    const saved = await queryOne(
      'SELECT d.*, u.display_name as author_name FROM designs d JOIN users u ON d.user_id = u.id WHERE d.id = ?',
      [designId]
    );

    return res.status(201).json({
      message: 'Diseño guardado exitosamente en tu Bóveda.',
      design: formatDesign(saved)
    });
  } catch (err) {
    console.error('Error al guardar diseño:', err);
    return res.status(500).json({ error: 'Error interno al guardar el diseño.' });
  }
});

// 2. Listar diseños activos del usuario autenticado (con soporte de búsqueda indexada)
router.get('/', requireAuth, async (req, res) => {
  try {
    const search = typeof req.query.q === 'string'
      ? req.query.q.trim().slice(0, 50)
      : (typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 50) : '');

    let whereSql = 'd.user_id = ? AND d.is_deleted = 0';
    const params = [req.user.id];

    if (search) {
      whereSql += ' AND d.title LIKE ?';
      params.push(`%${search}%`);
    }

    const rows = await query(
      `SELECT d.*, u.display_name as author_name
       FROM designs d
       JOIN users u ON d.user_id = u.id
       WHERE ${whereSql}
       ORDER BY d.created_at DESC`,
      params
    );

    const designs = rows.map(formatDesign);
    return res.json({ designs, count: designs.length });
  } catch (err) {
    console.error('Error al listar diseños:', err);
    return res.status(500).json({ error: 'Error al recuperar tus diseños.' });
  }
});

// 3. Obtener un diseño por ID (validación estricta de ID entero)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    if (!isValidPositiveIntId(req.params.id)) {
      return res.status(400).json({ error: 'Identificador de diseño inválido.' });
    }
    const designId = parseInt(req.params.id, 10);

    const row = await queryOne(
      `SELECT d.*, u.display_name as author_name
       FROM designs d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ? AND d.is_deleted = 0`,
      [designId]
    );

    if (!row) {
      return res.status(404).json({ error: 'Diseño no encontrado o eliminado.' });
    }

    if (!row.is_public) {
      const isOwner = req.user && req.user.id === row.user_id;
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Este diseño es privado.' });
      }
    }

    const assets = await query(
      `SELECT id, drive_file_id, drive_file_url, original_name, is_unlinked
       FROM design_assets
       WHERE design_id = ? AND is_unlinked = 0`,
      [designId]
    );

    const design = formatDesign(row);
    design.assets = assets;

    return res.json({ design });
  } catch (err) {
    console.error('Error al obtener diseño:', err);
    return res.status(500).json({ error: 'Error al obtener el diseño.' });
  }
});

// 4. Borrado suave (Soft Delete) estrictamente por el usuario propietario
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (!isValidPositiveIntId(req.params.id)) {
      return res.status(400).json({ error: 'Identificador de diseño inválido.' });
    }
    const designId = parseInt(req.params.id, 10);

    const existing = await queryOne(
      'SELECT id, user_id, title FROM designs WHERE id = ? AND is_deleted = 0',
      [designId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Diseño no encontrado o ya eliminado.' });
    }

    const isOwner = req.user.id === existing.user_id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este diseño.' });
    }

    await execute(
      'UPDATE designs SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [designId]
    );

    await execute(
      'UPDATE design_assets SET is_unlinked = 1, unlinked_at = CURRENT_TIMESTAMP WHERE design_id = ?',
      [designId]
    );

    return res.json({
      message: 'Diseño desvinculado exitosamente de tu perfil.',
      unlinkedDesignId: designId,
      softDeleted: true
    });
  } catch (err) {
    console.error('Error al eliminar diseño:', err);
    return res.status(500).json({ error: 'Error al procesar la desvinculación del diseño.' });
  }
});

export default router;
