import { spawn } from 'child_process';

// Mide el motor real del editor en el navegador: vista previa vs. borrado completo, y restos verdes.
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless', '--disable-gpu', '--remote-debugging-port=9224', 'http://localhost:3000/test.html'
]);
await new Promise(r => setTimeout(r, 2000));

const script = `(async () => {
  const { ImageEditorEngine } = await import('/src/ui/imageEditorEngine.js');
  const N = 2048;
  const src = document.createElement('canvas'); src.width = src.height = N;
  const g = src.getContext('2d');
  g.fillStyle = '#00ff00'; g.fillRect(0, 0, N, N);
  const disc = (r, c) => { g.fillStyle = c; g.beginPath(); g.arc(N / 2, N / 2, r, 0, Math.PI * 2); g.fill(); };
  // halo verde que se oscurece hacia el contorno + contorno negro + relleno naranja
  [[760, 'rgb(15,190,25)'], [752, 'rgb(14,140,22)'], [744, 'rgb(12,90,18)'], [736, 'rgb(10,45,14)'],
   [728, 'rgb(10,10,12)'], [700, 'rgb(255,140,30)']].forEach(([r, c]) => disc(r, c));
  g.fillStyle = 'rgb(14,140,22)'; g.fillRect(N / 2 - 6, N / 2 - 300, 12, 600); // franja verde atrapada
  const img = new Image(); img.src = src.toDataURL(); await img.decode();

  const view = document.createElement('canvas');
  const engine = new ImageEditorEngine(view);
  engine.setRawImage(img);

  const greenish = () => {
    const d = view.getContext('2d').getImageData(0, 0, N, N).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40 && d[i + 1] - Math.max(d[i], d[i + 2]) > 30) n++;
    return n;
  };
  const time = (fn) => { const t = performance.now(); fn(); return Math.round(performance.now() - t); };

  engine.ensureAction();
  const previews = [];
  for (const tol of [20, 35, 50, 65, 75, 40]) { engine.settings.tolerance = tol; previews.push(time(() => engine.previewAction())); }
  engine.settings.tolerance = 30;
  const full30 = time(() => engine.rerunLastAction());
  const green30 = greenish();
  engine.settings.tolerance = 75;
  const full75 = time(() => engine.rerunLastAction());
  const green75 = greenish();
  engine.settings.tolerance = 5;
  engine.rerunLastAction();
  const alphaAtCenter = view.getContext('2d').getImageData(N / 2 + 300, N / 2, 1, 1).data[3];
  return JSON.stringify({ previewMs: previews, fullMs30: full30, fullMs75: full75, greenishPixels30: green30, greenishPixels75: green75, artIntactAtTol5: alphaAtCenter });
})()`;

try {
  const tabs = await (await fetch('http://localhost:9224/json')).json();
  const ws = new WebSocket(tabs.find(t => t.url.includes('test.html')).webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));
  const res = await new Promise(resolve => {
    ws.addEventListener('message', e => { const d = JSON.parse(e.data); if (d.id === 7) resolve(d); });
    ws.send(JSON.stringify({ id: 7, method: 'Runtime.evaluate', params: { expression: script, awaitPromise: true, returnByValue: true } }));
  });
  console.log(res.result?.result?.value ?? JSON.stringify(res.result));
  ws.close();
} finally { edge.kill(); }
