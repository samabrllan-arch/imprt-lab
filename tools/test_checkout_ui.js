import fs from 'fs';
import { spawn } from 'child_process';

// Abre el checkout real del estudio y captura la selección de material/gramaje en tema claro y oscuro.
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless', '--disable-gpu', '--remote-debugging-port=9225', '--window-size=1000,760',
  'http://localhost:3000/#estudio'
]);
await new Promise(r => setTimeout(r, 2000));

try {
  const tabs = await (await fetch('http://localhost:9225/json')).json();
  const ws = new WebSocket(tabs.find(t => t.url.includes('localhost:3000')).webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 100;
  const call = (method, params = {}) => new Promise(res => {
    const myId = ++id;
    const h = (e) => { const d = JSON.parse(e.data); if (d.id === myId) { ws.removeEventListener('message', h); res(d); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  const evalJs = (expression) => call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const shot = async (name) => {
    const r = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(name, Buffer.from(r.result.data, 'base64'));
    console.log('saved', name);
  };

  await call('Runtime.enable');
  const errors = [];
  ws.addEventListener('message', e => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map(a => a.value || a.description).join(' '));
  });

  await wait(5000);
  await evalJs(`document.querySelector('.preset-card')?.click()`);
  await wait(1500);
  await evalJs(`document.getElementById('btn-checkout')?.click()`);
  await wait(2500);

  await shot('tools/result_checkout_dark.png');
  await evalJs(`document.documentElement.setAttribute('data-theme','light')`);
  await wait(500);
  await shot('tools/result_checkout_light.png');
  await evalJs(`document.querySelector('.btn-checkout-mat[data-mat-id="poliester"]')?.click()`);
  await wait(700);
  await shot('tools/result_checkout_light_poliester.png');
  const state = await evalJs(`JSON.stringify({
    mat: document.querySelector('.btn-checkout-mat.active')?.dataset.matId,
    gram: document.querySelector('.btn-checkout-gram.active')?.dataset.gramId,
    pressed: [...document.querySelectorAll('.btn-checkout-mat')].map(b => b.getAttribute('aria-pressed'))
  })`);
  console.log(state.result.result.value, 'errores consola:', errors.length, errors);
  ws.close();
} finally { edge.kill(); }
