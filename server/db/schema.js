import { getDb } from './connection.js';

export async function initSchema() {
  const { type, pool, db } = await getDb();

  if (type === 'mysql') {
    await initMySQL(pool);
  } else {
    initSQLite(db);
  }
  console.log('✅ [DB] Esquema e índices de alto rendimiento verificados (TiDB Cloud / MySQL / SQLite).');
}

function initSQLite(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL DEFAULT 'Diseño Sin Título',
      gender TEXT NOT NULL DEFAULT 'man',
      shirt_color TEXT NOT NULL DEFAULT '#111111',
      collar_color TEXT NOT NULL DEFAULT '#111111',
      cuff_color TEXT NOT NULL DEFAULT '#111111',
      inner_collar_color TEXT NOT NULL DEFAULT '#111111',
      fabric_type TEXT NOT NULL DEFAULT 'cotton',
      decal_config TEXT,
      preview_image_url TEXT,
      is_public INTEGER NOT NULL DEFAULT 1,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      deleted_at DATETIME,
      likes_count INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS design_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      design_id INTEGER,
      user_id INTEGER NOT NULL,
      drive_file_id TEXT NOT NULL,
      drive_file_url TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT DEFAULT 'image/png',
      file_size_bytes INTEGER,
      is_unlinked INTEGER NOT NULL DEFAULT 0,
      unlinked_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (design_id) REFERENCES designs(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS gallery_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      design_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, design_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (design_id) REFERENCES designs(id)
    );

    -- Índices optimizados para SQLite
    CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
    CREATE INDEX IF NOT EXISTS idx_users_display_name ON users (display_name);
    CREATE INDEX IF NOT EXISTS idx_designs_user_active ON designs (user_id, is_deleted, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_designs_gallery_recent ON designs (is_public, is_deleted, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_designs_gallery_popular ON designs (is_public, is_deleted, likes_count DESC, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_designs_title ON designs (title);
    CREATE INDEX IF NOT EXISTS idx_designs_gender ON designs (gender);
    CREATE INDEX IF NOT EXISTS idx_assets_design_active ON design_assets (design_id, is_unlinked);
    CREATE INDEX IF NOT EXISTS idx_assets_user_active ON design_assets (user_id, is_unlinked, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_assets_drive_id ON design_assets (drive_file_id);
    CREATE INDEX IF NOT EXISTS idx_assets_admin_unlinked ON design_assets (is_unlinked, unlinked_at DESC);
    CREATE INDEX IF NOT EXISTS idx_likes_design ON gallery_likes (design_id);
    CREATE INDEX IF NOT EXISTS idx_likes_user ON gallery_likes (user_id);
  `);
}

async function initMySQL(pool) {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_role (role),
      INDEX idx_users_display_name (display_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS designs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(150) NOT NULL DEFAULT 'Diseño Sin Título',
      gender VARCHAR(20) NOT NULL DEFAULT 'man',
      shirt_color VARCHAR(30) NOT NULL DEFAULT '#111111',
      collar_color VARCHAR(30) NOT NULL DEFAULT '#111111',
      cuff_color VARCHAR(30) NOT NULL DEFAULT '#111111',
      inner_collar_color VARCHAR(30) NOT NULL DEFAULT '#111111',
      fabric_type VARCHAR(50) NOT NULL DEFAULT 'cotton',
      decal_config LONGTEXT,
      preview_image_url TEXT,
      is_public TINYINT(1) NOT NULL DEFAULT 1,
      is_deleted TINYINT(1) NOT NULL DEFAULT 0,
      deleted_at TIMESTAMP NULL,
      likes_count INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_designs_user_active (user_id, is_deleted, created_at DESC),
      INDEX idx_designs_gallery_recent (is_public, is_deleted, created_at DESC),
      INDEX idx_designs_gallery_popular (is_public, is_deleted, likes_count DESC, created_at DESC),
      INDEX idx_designs_title (title),
      INDEX idx_designs_gender (gender)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS design_assets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      design_id INT NULL,
      user_id INT NOT NULL,
      drive_file_id VARCHAR(150) NOT NULL,
      drive_file_url TEXT NOT NULL,
      original_name VARCHAR(255) NULL,
      mime_type VARCHAR(100) DEFAULT 'image/png',
      file_size_bytes INT NULL,
      is_unlinked TINYINT(1) NOT NULL DEFAULT 0,
      unlinked_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_assets_design_active (design_id, is_unlinked),
      INDEX idx_assets_user_active (user_id, is_unlinked, created_at DESC),
      INDEX idx_assets_drive_id (drive_file_id),
      INDEX idx_assets_admin_unlinked (is_unlinked, unlinked_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS gallery_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      design_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_design (user_id, design_id),
      INDEX idx_likes_design (design_id),
      INDEX idx_likes_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  ];

  for (const sql of tables) {
    await pool.execute(sql);
  }
}
