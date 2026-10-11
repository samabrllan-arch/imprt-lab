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

  // Test different Y positions: e.g. Y = 1450, Y = 1350, Y = 1200, Y = 1000
  // In Three.js with our seam unwrap model:
  // Let's set slider values via JavaScript and redraw
  ws.send(JSON.stringify({
    id: 10,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        // Check current Y and move Y so logo is centered right on the bust
        const sliderY = document.getElementById('slider-y');
        const sliderX = document.getElementById('slider-x');
        const sliderScale = document.getElementById('slider-scale');
        
        // Let's test Y = 1380
        sliderY.value = 1380;
        sliderY.dispatchEvent(new Event('input'));
        
        sliderScale.value = 0.90;
        sliderScale.dispatchEvent(new Event('input'));
      `
    }
  }));

  await new Promise(r => setTimeout(r, 2000));

  ws.send(JSON.stringify({ id: 11, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 11) {
        fs.writeFileSync('tools/calib_y1380.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/calib_y1380.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  // Now test Y = 1500
  ws.send(JSON.stringify({
    id: 20,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        const sliderY = document.getElementById('slider-y');
        sliderY.value = 1500;
        sliderY.dispatchEvent(new Event('input'));
      `
    }
  }));

  await new Promise(r => setTimeout(r, 1500));

  ws.send(JSON.stringify({ id: 21, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 21) {
        fs.writeFileSync('tools/calib_y1500.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/calib_y1500.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  ws.close();
} finally {
  edge.kill();
}
