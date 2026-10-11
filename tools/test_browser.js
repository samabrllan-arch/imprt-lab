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

  // Wait 4 seconds for woman_seam to load
  await new Promise(r => setTimeout(r, 4000));

  // 1. Full view
  ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 10) {
        fs.writeFileSync('tools/result_woman_seam_full.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/result_woman_seam_full.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  // 2. Zoom in on chest folds and letter D
  ws.send(JSON.stringify({
    id: 20,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        window.testCamera.position.set(0.18, 0.08, 0.75);
        window.testControls.target.set(0.08, 0.02, 0);
        window.testControls.update();
      `
    }
  }));

  await new Promise(r => setTimeout(r, 2000));

  ws.send(JSON.stringify({ id: 21, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 21) {
        fs.writeFileSync('tools/result_woman_seam_zoom.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/result_woman_seam_zoom.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  // 3. Back view
  ws.send(JSON.stringify({
    id: 30,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        document.getElementById('btn-view-back').click();
      `
    }
  }));

  await new Promise(r => setTimeout(r, 1500));

  ws.send(JSON.stringify({ id: 31, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 31) {
        fs.writeFileSync('tools/result_woman_seam_back.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/result_woman_seam_back.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  ws.close();
} finally {
  edge.kill();
}
