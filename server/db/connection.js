import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import mysql from 'mysql2/promise';
import { CONFIG } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sqliteDb = null;
let mysqlPool = null;
let isMySQL = false;

export async function getDb() {
  if (isMySQL && mysqlPool) return { type: 'mysql', pool: mysqlPool };
  if (!isMySQL && sqliteDb) return { type: 'sqlite', db: sqliteDb };

  // En entorno de tests automatizados, usamos SQLite in-memory para velocidad
  if (process.env.NODE_ENV === 'test') {
    sqliteDb = new DatabaseSync(':memory:');
    isMySQL = false;
    return { type: 'sqlite', db: sqliteDb };
  }

  // Conexión principal a TiDB Cloud / MySQL (Render y Producción)
  try {
    const poolConfig = CONFIG.databaseUrl && CONFIG.databaseUrl.startsWith('mysql://')
      ? { uri: CONFIG.databaseUrl, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }
      : {
          host: CONFIG.db.host,
          port: CONFIG.db.port,
          user: CONFIG.db.user,
          password: CONFIG.db.password,
          database: CONFIG.db.database,
          ssl: CONFIG.db.ssl,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        };

    mysqlPool = mysql.createPool(poolConfig);
    const [rows] = await mysqlPool.query('SELECT 1 as ping');
    if (rows && rows.length > 0) {
      isMySQL = true;
      console.log(`✅ [DB] Conectado exitosamente a TiDB Cloud (${CONFIG.db.host}:${CONFIG.db.port})`);
      return { type: 'mysql', pool: mysqlPool };
    }
  } catch (err) {
    console.warn('⚠️ [DB] No se pudo conectar a TiDB Cloud, usando SQLite local:', err.message);
  }

  // Fallback / Modo Local SQLite offline
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, 'studio.db');
  sqliteDb = new DatabaseSync(dbPath);
  isMySQL = false;
  console.log('✅ [DB] Base de datos local activa (studio.db)');
  return { type: 'sqlite', db: sqliteDb };
}

export async function query(sql, params = []) {
  const { type, pool, db } = await getDb();
  if (type === 'mysql') {
    const [rows] = await pool.query(sql, params);
    return rows;
  }
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows && rows.length > 0 ? rows[0] : null;
}

export async function execute(sql, params = []) {
  const { type, pool, db } = await getDb();
  if (type === 'mysql') {
    const [result] = await pool.execute(sql, params);
    return {
      insertId: result.insertId,
      changes: result.affectedRows
    };
  }
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    insertId: result.lastInsertRowid,
    changes: result.changes
  };
}

export async function closeDb() {
  if (mysqlPool) {
    await mysqlPool.end();
    mysqlPool = null;
  }
  if (sqliteDb) {
    sqliteDb.close();
    sqliteDb = null;
  }
}
