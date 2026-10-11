import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { query, queryOne, execute } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter, sanitizeString, isValidEmail } from '../middleware/security.js';

const router = Router();

// Hash señuelo constante para prevenir ataques de temporización (User Enumeration Timing Attacks)
const DUMMY_HASH = '$2a$10$e8wD0bQh6b59KqT5wD3pI.009kR9l0GZJk03e7e9u8e5q7e3w2w1a';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    CONFIG.jwtSecret,
    { expiresIn: CONFIG.jwtExpiresIn }
  );
}

// 1. Registro de cuenta
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, displayName } = req.body || {};

    // Blindaje contra Type Confusion / Array Injection
    if (typeof email !== 'string' || typeof password !== 'string' || typeof displayName !== 'string') {
      return res.status(400).json({
        error: 'Formato de datos inválido. Los campos deben ser cadenas de texto individuales.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = sanitizeString(displayName, 60);

    if (!cleanEmail || !password || !cleanName) {
      return res.status(400).json({ error: 'Todos los campos son requeridos (email, password, displayName).' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'El formato de correo electrónico no es válido.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    if (password.length > 128) {
      return res.status(400).json({ error: 'La contraseña excede el límite máximo de 128 caracteres.' });
    }

    // Consulta SQL parametrizada contra inyección SQL
    const existingUser = await queryOne('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingUser) {
      return res.status(409).json({ error: 'Este correo electrónico ya está registrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usersCountRow = await queryOne('SELECT COUNT(*) as count FROM users');
    const isFirstUser = !usersCountRow || parseInt(usersCountRow.count || 0, 10) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const insertResult = await execute(
      'INSERT INTO users (email, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [cleanEmail, passwordHash, cleanName, role]
    );

    const user = {
      id: insertResult.insertId,
      email: cleanEmail,
      displayName: cleanName,
      role
    };

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      token,
      user
    });
  } catch (err) {
    console.error('Error en /register:', err);
    return res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
  }
});

// 2. Inicio de sesión blindado
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Blindaje estricto: Bloquea listas, objetos o tipos anómalos enviados como credenciales
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        error: 'Formato de credenciales inválido. Debe enviar cadenas de texto individuales (no listas ni objetos).'
      });
    }

    // Límite de longitud para evitar ataques DoS por sobrecarga de hashing
    if (password.length > 128 || email.length > 255) {
      return res.status(400).json({ error: 'Longitud de credenciales fuera de rango permitido.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Consulta SQL 100% parametrizada
    const userRow = await queryOne(
      'SELECT id, email, password_hash, display_name, role FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    // Mitigación de Timing Attack: Si el usuario no existe, ejecuta comparación señuelo
    const hashToCompare = userRow ? userRow.password_hash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!userRow || !isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    const user = {
      id: userRow.id,
      email: userRow.email,
      displayName: userRow.display_name,
      role: userRow.role
    };

    const token = generateToken(user);

    return res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user
    });
  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.display_name,
      role: req.user.role,
      createdAt: req.user.created_at
    }
  });
});

export default router;
