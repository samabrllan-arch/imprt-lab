import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { queryOne } from '../db/connection.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorización requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, CONFIG.jwtSecret);

    const userId = parseInt(decoded?.userId, 10);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ error: 'Token con identificador inválido.' });
    }

    const user = await queryOne(
      'SELECT id, email, display_name, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado o sesión inválida.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sesión expirada. Por favor inicia sesión nuevamente.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, CONFIG.jwtSecret);

    const userId = parseInt(decoded?.userId, 10);
    if (!Number.isInteger(userId) || userId <= 0) {
      req.user = null;
      return next();
    }

    const user = await queryOne(
      'SELECT id, email, display_name, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores.' });
  }
  next();
}
