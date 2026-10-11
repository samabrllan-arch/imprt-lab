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

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  // 1. Zoom in on woman_fitted: looking at right side of chest from a 30-degree angle
  console.log('Testing woman_fitted close-up...');
  ws.send(JSON.stringify({
    id: 10,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        document.getElementById('btn-woman-fitted').click();
        window.testCamera.position.set(0.18, 0.08, 0.75);
        window.testControls.target.set(0.08, 0.02, 0);
        window.testControls.update();
      `
    }
  }));

  await new Promise(r => setTimeout(r, 3000));

  ws.send(JSON.stringify({ id: 11, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 11) {
        fs.writeFileSync('tools/closeup_woman_fitted.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/closeup_woman_fitted.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  // 2. Zoom in on woman_meshy: looking at right side of chest from the same angle
  console.log('Testing woman_meshy close-up...');
  ws.send(JSON.stringify({
    id: 20,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        document.getElementById('btn-woman').click();
        window.testCamera.position.set(0.18, 0.08, 0.75);
        window.testControls.target.set(0.08, 0.02, 0);
        window.testControls.update();
      `
    }
  }));

  await new Promise(r => setTimeout(r, 3000));

  ws.send(JSON.stringify({ id: 21, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 21) {
        fs.writeFileSync('tools/closeup_woman_meshy.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/closeup_woman_meshy.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  ws.close();
} finally {
  edge.kill();
}
