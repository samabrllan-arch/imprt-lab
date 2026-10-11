import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const edge = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://localhost:3000/#estudio'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const target = tabs.find(t => t.url.includes('localhost:3000'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const consoleErrors = [];
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
      consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
    }
  });

  // Wait for initial load
  await new Promise(r => setTimeout(r, 3500));

  // Switch to woman model and set white color and decal
  ws.send(JSON.stringify({
    id: 10,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        // Click white color
        const whiteBtn = document.querySelector('.color-swatch-btn[data-color-id="white"], .color-circle[data-color="#ffffff"]');
        if (whiteBtn) whiteBtn.click();
        
        // Click woman silhouette
        const btnWoman = document.querySelector('[data-silhouette="woman"]');
        if (btnWoman) btnWoman.click();

        // Apply preset decal if preset button exists
        const presetBtn = document.querySelector('.preset-card');
        if (presetBtn) presetBtn.click();
      `
    }
  }));

  // Wait for woman model swap and texture composition
  await new Promise(r => setTimeout(r, 14000));

  // Capture screenshot of woman model in main studio
  ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  await new Promise(resolve => {
    const listener = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 20) {
        fs.writeFileSync('tools/result_main_woman_studio.png', Buffer.from(data.result.data, 'base64'));
        console.log('Saved tools/result_main_woman_studio.png');
        resolve();
      }
    };
    ws.addEventListener('message', listener);
  });

  console.log('Console errors:', consoleErrors.length, consoleErrors);
  ws.close();
} finally {
  edge.kill();
}
