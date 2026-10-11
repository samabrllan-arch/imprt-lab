import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server/index.js';
import { initSchema } from '../server/db/schema.js';
import { closeDb } from '../server/db/connection.js';

let server;
let baseUrl;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await initSchema();
  await new Promise(resolve => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await closeDb();
});

test('Seguridad: Bloqueo de Array / Object Injection en Credenciales de Login', async () => {
  // 1. Intento de enviar una lista de contraseñas (Array Injection)
  const arrayPassRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'usuario@test.com',
      password: ['clave1', 'clave2', 'clave3']
    })
  });
  assert.equal(arrayPassRes.status, 400);
  const data1 = await arrayPassRes.json();
  assert.ok(data1.error.includes('Formato de credenciales inválido'));

  // 2. Intento de enviar objeto en email (NoSQL / Type confusion)
  const objectEmailRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: { $ne: null },
      password: 'password123'
    })
  });
  assert.equal(objectEmailRes.status, 400);

  // 3. Intento de enviar lista en registro
  const arrayRegRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hacker@test.com',
      password: ['pass1', 'pass2'],
      displayName: 'Hacker'
    })
  });
  assert.equal(arrayRegRes.status, 400);
});

test('Seguridad: Inmunidad total a inyecciones SQL (SQL Injection)', async () => {
  // 1. Inyección clásica en login: ' OR '1'='1
  const sqlInjectionLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "admin@imprntlab.com' OR '1'='1",
      password: "' OR '1'='1"
    })
  });
  assert.equal(sqlInjectionLogin.status, 401);

  // 2. Inyección con UNION SELECT y comentarios SQL
  const unionLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "' UNION SELECT 1, 'hacked@hack.com', 'hash', 'hacker', 'admin' --",
      password: "admin"
    })
  });
  assert.equal(unionLogin.status, 401);

  // 3. Inyección en parámetros de URL de diseños (GET /api/designs/1 OR 1=1)
  const sqlParamRes = await fetch(`${baseUrl}/api/designs/1%20OR%201=1`);
  assert.equal(sqlParamRes.status, 400);
  const paramData = await sqlParamRes.json();
  assert.ok(paramData.error.includes('inválido'));

  // 4. Inyección en ordenamiento de Galería (?sort=title;DROP TABLE users;--)
  const galleryRes = await fetch(`${baseUrl}/api/gallery?sort=title;DROP%20TABLE%20users;--`);
  assert.equal(galleryRes.status, 200); // Debe procesarse con orden seguro por defecto sin fallar
  const galleryData = await galleryRes.json();
  assert.ok(Array.isArray(galleryData.designs));

  // 5. Inyección en límite de paginación (?limit=NaN_or_injection)
  const limitRes = await fetch(`${baseUrl}/api/gallery?limit=' OR 1=1--`);
  assert.equal(limitRes.status, 200);
});

test('Seguridad: Blindaje contra contraseñas sobredimensionadas (DoS por Hash)', async () => {
  const hugePassword = 'A'.repeat(500);
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'dos_target@test.com',
      password: hugePassword,
      displayName: 'Victim'
    })
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error.includes('128 caracteres'));
});

test('Seguridad: Sanitización de XSS y bloqueo de URLs maliciosas (javascript:)', async () => {
  // Crear usuario legítimo
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'sanitizer@test.com',
      password: 'password_segura_123',
      displayName: 'Sanitizer <script>alert(1)</script>'
    })
  });
  assert.equal(regRes.status, 201);
  const { token, user } = await regRes.json();
  assert.equal(user.displayName, 'Sanitizer alert(1)'); // Etiquetas HTML eliminadas

  // Intentar guardar diseño con título XSS y URL maliciosa
  const designRes = await fetch(`${baseUrl}/api/designs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: '<script>alert("hacked")</script>Polera Cyber',
      previewImageUrl: 'javascript:alert(document.cookie)',
      driveFileUrl: 'javascript:window.location="http://evil.com"',
      gender: 'invalid_gender_payload'
    })
  });
  assert.equal(designRes.status, 201);
  const designData = await designRes.json();
  assert.equal(designData.design.title, 'alert("hacked")Polera Cyber');
  assert.equal(designData.design.previewImageUrl, null); // javascript: fue bloqueado
  assert.equal(designData.design.gender, 'man'); // Corregido a whitelist
});

test('Seguridad: Protección contra IDOR (Insecure Direct Object Reference)', async () => {
  // Crear Usuario A y su diseño
  const regA = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'victima@test.com',
      password: 'password123',
      displayName: 'Usuario Legítimo'
    })
  });
  const { token: tokenA } = await regA.json();

  const createDesign = await fetch(`${baseUrl}/api/designs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ title: 'Diseño Privado De A', isPublic: 0 })
  });
  const { design: designA } = await createDesign.json();

  // Crear Usuario B (Atacante)
  const regB = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'atacante@test.com',
      password: 'password123',
      displayName: 'Atacante'
    })
  });
  const { token: tokenB } = await regB.json();

  // Usuario B intenta borrar el diseño de Usuario A
  const idorDelete = await fetch(`${baseUrl}/api/designs/${designA.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert.equal(idorDelete.status, 403);

  // Usuario B intenta ver el diseño privado de Usuario A
  const idorView = await fetch(`${baseUrl}/api/designs/${designA.id}`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  assert.equal(idorView.status, 403);
});

test('Seguridad: Bloqueo Anti-CSRF por Content-Type no permitido', async () => {
  const csrfRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'email=test@test.com&password=secret'
  });
  assert.equal(csrfRes.status, 415);
});
