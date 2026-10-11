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

test('Backend Health Check responde 200 y reporta base de datos', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok(data.database);
});

test('Auth: Registro, Login y validación de credenciales', async () => {
  // 1. Registro del primer usuario (será admin)
  const regAdmin = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@imprntlab.com',
      password: 'admin_password_123',
      displayName: 'Administrador Lab'
    })
  });
  assert.equal(regAdmin.status, 201);
  const adminData = await regAdmin.json();
  assert.ok(adminData.token);
  assert.equal(adminData.user.role, 'admin');

  // 2. Intento de registro duplicado falla con 409
  const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@imprntlab.com',
      password: 'otra_password_123',
      displayName: 'Otro Nombre'
    })
  });
  assert.equal(dupRes.status, 409);

  // 3. Registro de usuario normal
  const regUser = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'disenador@test.com',
      password: 'password_segura_123',
      displayName: 'Diseñador Urbano'
    })
  });
  assert.equal(regUser.status, 201);
  const userData = await regUser.json();
  assert.equal(userData.user.role, 'user');

  // 4. Login exitoso
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'disenador@test.com',
      password: 'password_segura_123'
    })
  });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.ok(loginData.token);
  assert.equal(loginData.user.email, 'disenador@test.com');

  // 5. Login con contraseña incorrecta falla con 401
  const badLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'disenador@test.com',
      password: 'password_erronea'
    })
  });
  assert.equal(badLogin.status, 401);
});

test('Diseños: Guardar, consultar y borrado suave (Soft Delete) con links de Google Drive', async () => {
  // Login como diseñador
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'disenador@test.com',
      password: 'password_segura_123'
    })
  });
  const { token } = await loginRes.json();

  // 1. Guardar diseño 3D con enlace a Google Drive
  const driveFileUrl = 'https://drive.google.com/uc?export=view&id=1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN';
  const saveRes = await fetch(`${baseUrl}/api/designs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Cyberpunk Tiger Cyber-Luxury',
      gender: 'man',
      shirtColor: '#121212',
      fabricType: 'oversize_heavy',
      previewImageUrl: driveFileUrl,
      driveFileId: 'drive_tiger_9988',
      driveFileUrl: driveFileUrl,
      originalName: 'tiger_front.png',
      decalConfig: {
        width_cm: 25,
        height_cm: 36,
        ratioLocked: false,
        scale: 0.9,
        zone: 'front'
      },
      isPublic: 1
    })
  });
  assert.equal(saveRes.status, 201);
  const savedData = await saveRes.json();
  assert.ok(savedData.design.id);
  const designId = savedData.design.id;
  assert.equal(savedData.design.decalConfig.width_cm, 25);
  assert.equal(savedData.design.decalConfig.height_cm, 36);

  // 2. Listar mis diseños activos
  const listRes = await fetch(`${baseUrl}/api/designs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(listRes.status, 200);
  const listData = await listRes.json();
  assert.equal(listData.count, 1);
  assert.equal(listData.designs[0].id, designId);

  // 2.1 Búsqueda indexada en mis diseños por término coincidente
  const searchMatchRes = await fetch(`${baseUrl}/api/designs?q=Tiger`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const searchMatchData = await searchMatchRes.json();
  assert.equal(searchMatchData.count, 1);

  // 2.2 Búsqueda indexada en mis diseños por término no existente
  const searchNoneRes = await fetch(`${baseUrl}/api/designs?q=Floral`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const searchNoneData = await searchNoneRes.json();
  assert.equal(searchNoneData.count, 0);

  // 2.3 Búsqueda indexada en galería pública por género y texto
  const gallerySearchRes = await fetch(`${baseUrl}/api/gallery?q=Tiger&gender=man`);
  const gallerySearchData = await gallerySearchRes.json();
  assert.equal(gallerySearchData.count, 1);

  const galleryMismatchRes = await fetch(`${baseUrl}/api/gallery?gender=woman`);
  const galleryMismatchData = await galleryMismatchRes.json();
  assert.equal(galleryMismatchData.count, 0);

  // 3. Obtener detalle del diseño con sus activos de Drive
  const detailRes = await fetch(`${baseUrl}/api/designs/${designId}`);
  assert.equal(detailRes.status, 200);
  const detailData = await detailRes.json();
  assert.equal(detailData.design.assets.length, 1);
  assert.equal(detailData.design.assets[0].drive_file_id, 'drive_tiger_9988');

  // 4. Like comunitario en galería
  const likeRes = await fetch(`${baseUrl}/api/gallery/${designId}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(likeRes.status, 200);
  const likeData = await likeRes.json();
  assert.equal(likeData.liked, true);
  assert.equal(likeData.likesCount, 1);

  // 5. Borrado suave por el usuario propietario:
  // "El único que podría llegar a borrar las imágenes es el usuario...
  // Lo que hace simplemente es desaparecer el link, nada más, la imagen realmente no se borra."
  const deleteRes = await fetch(`${baseUrl}/api/designs/${designId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(deleteRes.status, 200);
  const deleteData = await deleteRes.json();
  assert.equal(deleteData.softDeleted, true);

  // 6. Verificar que el diseño ya NO aparece en el perfil del usuario ni en la galería
  const emptyListRes = await fetch(`${baseUrl}/api/designs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const emptyData = await emptyListRes.json();
  assert.equal(emptyData.count, 0);

  const galleryRes = await fetch(`${baseUrl}/api/gallery`);
  const galleryData = await galleryRes.json();
  const foundInGallery = galleryData.designs.find(d => d.id === designId);
  assert.equal(foundInGallery, undefined);
});

test('Admin: Auditoría de activos desvinculados para comparación con Google Drive', async () => {
  // Login como admin
  const loginAdmin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@imprntlab.com',
      password: 'admin_password_123'
    })
  });
  const { token: adminToken } = await loginAdmin.json();

  // El admin consulta las imágenes desvinculadas por los usuarios
  const unlinkedRes = await fetch(`${baseUrl}/api/admin/unlinked-assets`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.equal(unlinkedRes.status, 200);
  const unlinkedData = await unlinkedRes.json();
  assert.ok(unlinkedData.count >= 1);
  const unlinkedAsset = unlinkedData.unlinkedAssets.find(a => a.drive_file_id === 'drive_tiger_9988');
  assert.ok(unlinkedAsset);
  assert.equal(unlinkedAsset.drive_file_id, 'drive_tiger_9988');
  assert.equal(unlinkedAsset.user_email, 'disenador@test.com');

  // El admin consulta la comparación de inventario
  const compRes = await fetch(`${baseUrl}/api/admin/assets-comparison`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.equal(compRes.status, 200);
  const compData = await compRes.json();
  assert.ok(compData.assets.unlinkedCount >= 1);
  assert.ok(compData.designs.deletedDesigns >= 1);
});
