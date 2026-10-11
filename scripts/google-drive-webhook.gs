/**
 * IMPRNT [LAB] - GOOGLE APPS SCRIPT BACKEND ENGINE
 * Almacenamiento Cloud, Bóveda de Diseños y Gestión de Pedidos 300 DPI
 * ID Carpeta Drive: 1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN
 */

var PARENT_FOLDER_ID = '1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN';
var DB_SHEET_NAME = 'IMPRNT_LAB_Database';
var MAX_PENDING_ORDERS = 2;

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'health';
  if (action === 'health') {
    return jsonResponse({
      status: 'ok', service: 'IMPRNT [LAB] Engine', version: '2.0.0',
      folderId: PARENT_FOLDER_ID, time: new Date().toISOString()
    });
  }
  if (action === 'check_pending') {
    var ctx = getContext();
    var userKey = (e && e.parameter && e.parameter.user) || '';
    var count = countUserPending(ctx.sheets.pedidos, { email: userKey, id: userKey, alias: userKey });
    return jsonResponse({ status: 'success', pendingCount: count, canOrder: count < MAX_PENDING_ORDERS });
  }
  return jsonResponse({ status: 'error', message: 'Accion GET desconocida' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'Payload vacio' });
    }
    var data = JSON.parse(e.postData.contents);
    var action = data.action || (data.orderId ? 'create_order' : 'unknown');
    var ctx = getContext();

    switch (action) {
      case 'upload_vault': return handleVaultUpload(data, ctx);
      case 'create_order': return handleCreateOrder(data, ctx);
      case 'mark_paid': return handleMarkPaid(data, ctx);
      case 'check_pending': return handleCheckPending(data, ctx);
      default: return jsonResponse({ status: 'error', message: 'Accion desconocida: ' + action });
    }
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function handleVaultUpload(data, ctx) {
  if (!data.image) return jsonResponse({ status: 'error', message: 'No se envio imagen' });
  var safeName = (data.designName || 'arte').replace(/[^a-zA-Z0-9_.-]/g, '_');
  var fileName = 'BOVEDA_' + (data.designId || Date.now()) + '_' + safeName + '.png';
  var fileInfo = saveBase64(ctx.folders.vault, data.image, fileName, 'image/png');

  ctx.sheets.boveda.appendRow([
    new Date().toLocaleString('es-CO'), data.designId || ('VLT-' + Date.now()),
    data.userAlias || '@anonimo', data.userEmail || data.userId || 'anon',
    data.designName || 'Sin titulo', data.isPublic ? 'Publico' : 'Privado',
    fileInfo.downloadUrl, data.dimensions || '', fileInfo.fileId
  ]);

  return jsonResponse({
    status: 'success', action: 'upload_vault', designId: data.designId,
    fileUrl: fileInfo.downloadUrl, fileId: fileInfo.fileId, message: 'Arte guardado en Boveda'
  });
}

function handleCreateOrder(data, ctx) {
  var userTarget = {
    email: data.customerEmail || data.userEmail || '',
    id: data.userId || '',
    alias: data.customerAlias || data.userAlias || data.customerName || ''
  };

  var pending = countUserPending(ctx.sheets.pedidos, userTarget);
  if (pending >= MAX_PENDING_ORDERS) {
    return jsonResponse({
      status: 'error', code: 'LIMIT_REACHED', pendingCount: pending, maxAllowed: MAX_PENDING_ORDERS,
      message: 'Limite alcanzado: Tienes ' + pending + ' pedidos pendientes. Marca como pagado uno anterior antes de crear otro.'
    });
  }

  var artUrl = '';
  if (data.image300Dpi) {
    var artName = 'PEDIDO_' + (data.orderId || 'ORD') + '_300DPI.png';
    artUrl = saveBase64(ctx.folders.orders, data.image300Dpi, artName, 'image/png').downloadUrl;
  }
  var mockupUrl = '';
  if (data.screenshot) {
    var mockName = 'MOCKUP_' + (data.orderId || 'ORD') + '.jpg';
    mockupUrl = saveBase64(ctx.folders.orders, data.screenshot, mockName, 'image/jpeg').downloadUrl;
  }

  ctx.sheets.pedidos.appendRow([
    new Date().toLocaleString('es-CO'), data.orderId || ('ORD-' + Date.now()),
    data.customerName || data.userAlias || 'Anonimo',
    data.customerEmail || data.userEmail || data.userId || 'anon',
    'pending_payment', data.garment || 'Camiseta Oversize', data.size || 'M',
    data.color || 'Negro', data.dimensions || '', data.total || '$0',
    artUrl || 'Sin arte', mockupUrl || 'Sin mockup', data.paymentMethod || 'nequi',
    '', data.notes || 'Generado desde IMPRNT [LAB]'
  ]);

  return jsonResponse({
    status: 'success', action: 'create_order', orderId: data.orderId,
    fileUrl: artUrl, mockupUrl: mockupUrl, pendingCount: pending + 1,
    sheetUrl: ctx.sheets.ss.getUrl(), message: 'Pedido registrado a 300 DPI'
  });
}

function handleMarkPaid(data, ctx) {
  var orderId = String(data.orderId || '').trim().toUpperCase();
  if (!orderId) return jsonResponse({ status: 'error', message: 'Falta orderId' });

  var sheet = ctx.sheets.pedidos;
  var rows = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][1]).trim().toUpperCase() === orderId) { rowIndex = i + 1; break; }
  }
  if (rowIndex === -1) return jsonResponse({ status: 'error', message: 'Pedido #' + orderId + ' no encontrado' });

  var proofUrl = '';
  if (data.proofImage) {
    var pName = 'COMPROBANTE_' + orderId + '.jpg';
    proofUrl = saveBase64(ctx.folders.proofs, data.proofImage, pName, 'image/jpeg').downloadUrl;
  }

  var newStatus = data.status || 'proof_submitted';
  sheet.getRange(rowIndex, 5).setValue(newStatus);
  if (data.paymentMethod) sheet.getRange(rowIndex, 13).setValue(data.paymentMethod);
  if (proofUrl) sheet.getRange(rowIndex, 14).setValue(proofUrl);

  var noteCell = sheet.getRange(rowIndex, 15);
  var currentNote = String(noteCell.getValue() || '');
  noteCell.setValue(currentNote + ' [Pago reportado: ' + new Date().toLocaleString('es-CO') + ']');

  return jsonResponse({
    status: 'success', action: 'mark_paid', orderId: orderId,
    newStatus: newStatus, proofUrl: proofUrl, message: 'Pago reportado. Cupo liberado.'
  });
}

function handleCheckPending(data, ctx) {
  var userTarget = {
    email: data.customerEmail || data.userEmail || '',
    id: data.userId || '',
    alias: data.customerAlias || data.userAlias || data.customerName || ''
  };
  var count = countUserPending(ctx.sheets.pedidos, userTarget);
  return jsonResponse({
    status: 'success', pendingCount: count, maxAllowed: MAX_PENDING_ORDERS,
    canOrder: count < MAX_PENDING_ORDERS
  });
}

function countUserPending(sheet, targets) {
  if (!targets) return 0;
  var tEmail = (targets.email || '').trim().toLowerCase();
  var tId = (targets.id || '').trim().toLowerCase();
  var tAlias = (targets.alias || '').trim().toLowerCase();
  if (!tEmail && !tId && !tAlias) return 0;

  var rows = sheet.getDataRange().getValues();
  var count = 0;
  for (var i = 1; i < rows.length; i++) {
    var rowAlias = String(rows[i][2] || '').trim().toLowerCase();
    var rowUser = String(rows[i][3] || '').trim().toLowerCase();
    var status = String(rows[i][4] || '').trim().toLowerCase();
    var isMatch = (tEmail && rowUser === tEmail) || (tId && rowUser === tId) || (tAlias && rowAlias === tAlias);
    if (isMatch && (status === 'pending_payment' || status === 'pendiente')) count++;
  }
  return count;
}

function saveBase64(folder, b64, name, mime) {
  var raw = b64.indexOf(',') !== -1 ? b64.split(',')[1] : b64;
  var decoded = Utilities.base64Decode(raw.trim());
  var blob = Utilities.newBlob(decoded, mime || 'image/png', name);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    fileId: file.getId(),
    downloadUrl: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
    fileUrl: file.getUrl()
  };
}

function getContext() {
  var parent;
  try { parent = DriveApp.getFolderById(PARENT_FOLDER_ID); } catch (e) {
    var f = DriveApp.getFoldersByName('IMPRNT [LAB]');
    parent = f.hasNext() ? f.next() : DriveApp.createFolder('IMPRNT [LAB]');
  }

  var getSub = function(name) {
    var sub = parent.getFoldersByName(name);
    return sub.hasNext() ? sub.next() : parent.createFolder(name);
  };

  var vaultF = getSub('Boveda_Disenos');
  var ordersF = getSub('Pedidos_Produccion');
  var proofsF = getSub('Comprobantes_Pago');

  var sFiles = parent.getFilesByName(DB_SHEET_NAME);
  var ss = sFiles.hasNext() ? SpreadsheetApp.open(sFiles.next()) : (function() {
    var created = SpreadsheetApp.create(DB_SHEET_NAME);
    DriveApp.getFileById(created.getId()).moveTo(parent);
    return created;
  })();

  var pSheet = ss.getSheetByName('Pedidos') || ss.insertSheet('Pedidos');
  if (pSheet.getLastRow() === 0) {
    pSheet.appendRow([
      'Fecha', 'ID Orden', 'Cliente/Alias', 'Email/Usuario', 'Estado',
      'Prenda', 'Talla', 'Color', 'Medidas', 'Total',
      'URL Arte 300DPI', 'URL Mockup', 'Metodo Pago', 'Comprobante', 'Notas'
    ]);
    pSheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#111827').setFontColor('#00f0ff');
    pSheet.setFrozenRows(1);
  }

  var bSheet = ss.getSheetByName('Boveda') || ss.insertSheet('Boveda');
  if (bSheet.getLastRow() === 0) {
    bSheet.appendRow([
      'Fecha', 'ID Diseno', 'Alias', 'Email/Usuario', 'Nombre',
      'Visibilidad', 'URL Archivo', 'Dimensiones', 'ID Drive'
    ]);
    bSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#111827').setFontColor('#ff5722');
    bSheet.setFrozenRows(1);
  }

  var dSheet = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (dSheet && ss.getSheets().length > 2) ss.deleteSheet(dSheet);

  return {
    folders: { parent: parent, vault: vaultF, orders: ordersF, proofs: proofsF },
    sheets: { ss: ss, pedidos: pSheet, boveda: bSheet }
  };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
