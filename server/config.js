import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'imprnt_lab_atelier_jwt_secret_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  nodeEnv: process.env.NODE_ENV || 'development',
  driveFolderId: process.env.DRIVE_FOLDER_ID || '1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN',
  // Credenciales TiDB Cloud quemadas como respaldo directo para Render
  db: {
    host: process.env.DB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: parseInt(process.env.DB_PORT || '4000', 10),
    user: process.env.DB_USER || '3LcPNLutu94xvfx.root',
    password: process.env.DB_PASSWORD || 'ugicEDroRUPQ7Lm9',
    database: process.env.DB_NAME || 'test',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  },
  databaseUrl: process.env.DATABASE_URL || ''
};
