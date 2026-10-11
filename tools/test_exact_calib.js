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

  await new Promise(r => setTimeout(r, 3000));

  // Test y = 1340 and scale = 1.05
  ws.send(JSON.stringify({
    id: 10,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        const sY = document.getElementById('slider-y');
        const sS = document.getElementById('slider-scale');
        sY.value = 1340;
        sY.dispatchEvent(new Event('input'));
        sS.value = 1.05;
        sS.dispatchEvent(new Event('input'));
      `
    }
  }));

  await new Promise(r => setTimeout(r, 2000));

  ws.send(JSON.stringify({ id: 11, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 11) {
        fs.writeFileSync('tools/calib_perfect.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/calib_perfect.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  ws.close();
} finally {
  edge.kill();
}
