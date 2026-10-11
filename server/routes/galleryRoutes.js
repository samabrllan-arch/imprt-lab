import { Router } from 'express';
import { query, queryOne, execute } from '../db/connection.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { isValidPositiveIntId } from '../middleware/security.js';

const router = Router();

// 1. Explorar galería pública comunitaria (Paginación, búsqueda e índices TiDB Cloud)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const rawLimit = parseInt(req.query.limit, 10);
    const limit = Number.isInteger(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : 20;

    const rawOffset = parseInt(req.query.offset, 10);
    const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;

    // Búsqueda por palabra clave (título o autor) con índice
    const search = typeof req.query.q === 'string'
      ? req.query.q.trim().slice(0, 50)
      : (typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 50) : '');

    // Filtro por silueta/género
    const genderFilter = ['man', 'woman'].includes(req.query.gender) ? req.query.gender : null;

    // Whitelist estricta de ordenamiento con índice compuesto en TiDB / MySQL
    const sortClause = req.query.sort === 'popular'
      ? 'd.likes_count DESC, d.created_at DESC'
      : 'd.created_at DESC';

    let whereSql = 'd.is_public = 1 AND d.is_deleted = 0';
    const params = [];

    if (search) {
      whereSql += ' AND (d.title LIKE ? OR u.display_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (genderFilter) {
      whereSql += ' AND d.gender = ?';
      params.push(genderFilter);
    }

    params.push(limit, offset);

    const rows = await query(
      `SELECT d.id, d.title, d.gender, d.shirt_color, d.preview_image_url,
              d.likes_count, d.created_at, u.display_name as author_name, d.user_id
       FROM designs d
       JOIN users u ON d.user_id = u.id
       WHERE ${whereSql}
       ORDER BY ${sortClause}
       LIMIT ? OFFSET ?`,
      params
    );

    let userLikedSet = new Set();
    if (req.user) {
      const userLikes = await query(
        'SELECT design_id FROM gallery_likes WHERE user_id = ?',
        [req.user.id]
      );
      userLikedSet = new Set(userLikes.map(l => l.design_id));
    }

    const items = rows.map(r => ({
      id: r.id,
      title: r.title,
      gender: r.gender,
      shirtColor: r.shirt_color,
      previewImageUrl: r.preview_image_url,
      likesCount: r.likes_count,
      authorName: r.author_name,
      userId: r.user_id,
      isLikedByMe: userLikedSet.has(r.id),
      createdAt: r.created_at
    }));

    return res.json({ designs: items, count: items.length });
  } catch (err) {
    console.error('Error en galería:', err);
    return res.status(500).json({ error: 'Error al cargar la galería pública.' });
  }
});

// 2. Dar o quitar like a un diseño (ID blindado)
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    if (!isValidPositiveIntId(req.params.id)) {
      return res.status(400).json({ error: 'Identificador de diseño inválido.' });
    }
    const designId = parseInt(req.params.id, 10);

    const design = await queryOne(
      'SELECT id, likes_count FROM designs WHERE id = ? AND is_deleted = 0',
      [designId]
    );

    if (!design) {
      return res.status(404).json({ error: 'Diseño no encontrado.' });
    }

    const existingLike = await queryOne(
      'SELECT id FROM gallery_likes WHERE user_id = ? AND design_id = ?',
      [req.user.id, designId]
    );

    if (existingLike) {
      await execute('DELETE FROM gallery_likes WHERE id = ?', [existingLike.id]);
      await execute('UPDATE designs SET likes_count = MAX(0, likes_count - 1) WHERE id = ?', [designId]);
      const updated = await queryOne('SELECT likes_count FROM designs WHERE id = ?', [designId]);
      return res.json({ liked: false, likesCount: updated.likes_count });
    } else {
      await execute('INSERT INTO gallery_likes (user_id, design_id) VALUES (?, ?)', [req.user.id, designId]);
      await execute('UPDATE designs SET likes_count = likes_count + 1 WHERE id = ?', [designId]);
      const updated = await queryOne('SELECT likes_count FROM designs WHERE id = ?', [designId]);
      return res.json({ liked: true, likesCount: updated.likes_count });
    }
  } catch (err) {
    console.error('Error al procesar like:', err);
    return res.status(500).json({ error: 'Error al procesar la interacción de like.' });
  }
});

export default router;
