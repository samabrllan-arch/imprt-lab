import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const edge = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://localhost:3000/test.html'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const target = tabs.find(t => t.url.includes('test.html'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

  await new Promise(r => setTimeout(r, 3500));

  for (const yVal of [1180, 1220, 1250]) {
    ws.send(JSON.stringify({
      id: 10 + yVal,
      method: 'Runtime.evaluate',
      params: {
        expression: `
          const sY = document.getElementById('slider-y');
          sY.value = ${yVal};
          sY.dispatchEvent(new Event('input'));
        `
      }
    }));
    await new Promise(r => setTimeout(r, 1500));
    ws.send(JSON.stringify({ id: 100 + yVal, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    await new Promise(resolve => {
      const listener = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === 100 + yVal) {
          fs.writeFileSync(`tools/test_y_${yVal}.png`, Buffer.from(data.result.data, 'base64'));
          console.log(`Saved tools/test_y_${yVal}.png`);
          resolve();
        }
      };
      ws.addEventListener('message', listener);
    });
  }

  ws.close();
} finally {
  edge.kill();
}
