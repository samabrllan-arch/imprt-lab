import test from 'node:test';
import assert from 'node:assert/strict';
import { getSafestChromaColor, buildAiPrompt, CHROMA_CANDIDATES } from '../src/services/aiPromptHelper.js';

test('detecta color contrastante seguro: imagen verde evita fondo verde', () => {
  // Crear imagen con píxeles verdes (0, 255, 0)
  const data = new Uint8ClampedArray(10 * 10 * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 20;     // R
    data[i + 1] = 220; // G (predominantemente verde)
    data[i + 2] = 40;  // B
    data[i + 3] = 255;
  }
  const imgData = { data, width: 10, height: 10 };
  const safe = getSafestChromaColor(imgData);

  // No debe elegir verde croma porque ya existe en la imagen
  assert.notEqual(safe.id, 'green');
  assert.ok(safe.id === 'magenta' || safe.id === 'blue');
});

test('detecta color contrastante seguro: imagen magenta/roja evita magenta', () => {
  // Crear imagen con píxeles magenta (255, 0, 255)
  const data = new Uint8ClampedArray(10 * 10 * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 240;
    data[i + 1] = 10;
    data[i + 2] = 230;
    data[i + 3] = 255;
  }
  const imgData = { data, width: 10, height: 10 };
  const safe = getSafestChromaColor(imgData);

  assert.notEqual(safe.id, 'magenta');
  assert.ok(safe.id === 'green' || safe.id === 'cyan');
});

test('el prompt exige no alterar el diseño original y aplicar color contrastante', () => {
  const color = { name: 'Magenta Croma', nameEn: 'solid magenta pink', hex: '#FF00FF' };
  const promptEn = buildAiPrompt(color, 'en');
  const promptEs = buildAiPrompt(color, 'es');

  // Cláusulas estrictas en inglés
  assert.ok(promptEn.includes('Do NOT modify, redraw, or change the original subject'));
  assert.ok(promptEn.includes('#FF00FF'));
  assert.ok(promptEn.includes('100% identical'));

  // Cláusulas estrictas en español
  assert.ok(promptEs.includes('No modifiques, alteres ni redibujes'));
  assert.ok(promptEs.includes('#FF00FF'));
  assert.ok(promptEs.includes('100% idéntica'));
});
