import { Router } from 'express';
import { query, queryOne, execute } from '../db/connection.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { isValidPositiveIntId } from '../middleware/security.js';

const router = Router();

// Todas las rutas de administración requieren autenticación y rol 'admin'
router.use(requireAuth, requireAdmin);

// 1. Obtener lista de imágenes desvinculadas (borradas por usuarios) para revisión en Google Drive
router.get('/unlinked-assets', async (req, res) => {
  try {
    const assets = await query(
      `SELECT da.id, da.design_id, da.user_id, da.drive_file_id, da.drive_file_url,
              da.original_name, da.mime_type, da.file_size_bytes, da.unlinked_at, da.created_at,
              u.email as user_email, u.display_name as user_name,
              d.title as design_title
       FROM design_assets da
       JOIN users u ON da.user_id = u.id
       LEFT JOIN designs d ON da.design_id = d.id
       WHERE da.is_unlinked = 1
       ORDER BY da.unlinked_at DESC`
    );

    return res.json({
      message: 'Imágenes desvinculadas listas para auditar y comparar contra Google Drive.',
      unlinkedAssets: assets,
      count: assets.length
    });
  } catch (err) {
    console.error('Error al obtener activos desvinculados:', err);
    return res.status(500).json({ error: 'Error al consultar activos desvinculados.' });
  }
});

// 2. Resumen comparativo de inventario (Activas vs Desvinculadas)
router.get('/assets-comparison', async (req, res) => {
  try {
    const [stats] = await query(`
      SELECT
        COUNT(CASE WHEN is_unlinked = 0 THEN 1 END) as activeCount,
        COUNT(CASE WHEN is_unlinked = 1 THEN 1 END) as unlinkedCount,
        COUNT(*) as totalAssets
      FROM design_assets
    `);

    const [userStats] = await query('SELECT COUNT(*) as totalUsers FROM users');
    const [designStats] = await query(`
      SELECT
        COUNT(CASE WHEN is_deleted = 0 THEN 1 END) as activeDesigns,
        COUNT(CASE WHEN is_deleted = 1 THEN 1 END) as deletedDesigns,
        COUNT(*) as totalDesigns
      FROM designs
    `);

    return res.json({
      assets: stats || { activeCount: 0, unlinkedCount: 0, totalAssets: 0 },
      designs: designStats || { activeDesigns: 0, deletedDesigns: 0, totalDesigns: 0 },
      users: userStats || { totalUsers: 0 }
    });
  } catch (err) {
    console.error('Error en comparación de inventario:', err);
    return res.status(500).json({ error: 'Error al calcular estadísticas de inventario.' });
  }
});

// 3. Confirmar que el admin ya purgó el archivo en Google Drive (remover registro de BD)
router.delete('/purge-asset-record/:id', async (req, res) => {
  try {
    if (!isValidPositiveIntId(req.params.id)) {
      return res.status(400).json({ error: 'Identificador de activo inválido.' });
    }
    const assetId = parseInt(req.params.id, 10);

    const existing = await queryOne(
      'SELECT id, drive_file_id, is_unlinked FROM design_assets WHERE id = ?',
      [assetId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Registro de activo no encontrado.' });
    }

    if (!existing.is_unlinked) {
      return res.status(400).json({ error: 'No se puede purgar un activo que sigue activo/en uso.' });
    }

    await execute('DELETE FROM design_assets WHERE id = ?', [assetId]);

    return res.json({
      message: `Registro de activo ${existing.drive_file_id} purgado de la base de datos tras la revisión en Google Drive.`,
      purgedId: assetId
    });
  } catch (err) {
    console.error('Error al purgar registro de activo:', err);
    return res.status(500).json({ error: 'Error al purgar el registro del activo.' });
  }
});

export default router;
