import fs from 'fs';
import { spawn } from 'child_process';

// Uso: node tools/calib_center.js "x,y" "x,y" ...   (coords del pecho en canvas 2048)
const combos = process.argv.slice(2).map(s => s.split(',').map(Number));
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless', '--disable-gpu', '--remote-debugging-port=9223', '--window-size=1100,700',
  'http://localhost:3000/test.html'
]);
await new Promise(r => setTimeout(r, 1500));
try {
  const tabs = await (await fetch('http://localhost:9223/json')).json();
  const ws = new WebSocket(tabs.find(t => t.url.includes('test.html')).webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 100;
  const call = (method, params = {}) => new Promise(res => {
    const myId = ++id;
    const h = (e) => { const d = JSON.parse(e.data); if (d.id === myId) { ws.removeEventListener('message', h); res(d); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  await new Promise(r => setTimeout(r, 15000));
  await call('Runtime.evaluate', { expression: `document.getElementById('btn-apply-both').click()` }); // solo la zona activa
  if (process.env.BACK) {
    await call('Runtime.evaluate', { expression: `document.getElementById('btn-zone-back').click(); document.getElementById('btn-view-back').click();` });
  }
  for (const [x, y, s = 0.95] of combos) {
    await call('Runtime.evaluate', { expression: `
      for (const [id, v] of [['slider-x', ${x}], ['slider-y', ${y}], ['slider-scale', ${s}]]) {
        const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input'));
      }` });
    await new Promise(r => setTimeout(r, 700));
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    const name = `tools/calib_${x}_${y}_${s}.png`;
    fs.writeFileSync(name, Buffer.from(shot.result.data, 'base64'));
    console.log('saved', name);
  }
  ws.close();
} finally { edge.kill(); }
