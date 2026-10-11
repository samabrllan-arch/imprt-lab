import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const edge = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9223',
  'http://localhost:3000/'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const tabsRes = await fetch('http://localhost:9223/json');
  const tabs = await tabsRes.json();
  const target = tabs.find(t => t.url.includes('localhost:3000'));
  if (!target) throw new Error('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const errors = [];
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
  });

  // Wait 3s for hero and fonts to load
  await new Promise(r => setTimeout(r, 3000));

  function sendReq(id, method, params = {}) {
    return new Promise(resolve => {
      const listener = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', listener);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // 1. Screenshot Dark Mode Hero
  const shot1 = await sendReq(10, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tools/result_hero_dark.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved tools/result_hero_dark.png');

  // 2. Click Theme Toggle to switch to Light Mode and trigger toast
  await sendReq(20, 'Runtime.evaluate', {
    expression: `
      const btn = document.getElementById('btn-theme-toggle');
      if (btn) btn.click();
    `
  });

  // Wait 400ms for toast animation
  await new Promise(r => setTimeout(r, 500));

  // 3. Screenshot Light Mode with Toast
  const shot2 = await sendReq(30, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tools/result_hero_light_toast.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved tools/result_hero_light_toast.png');

  // 4. Inspect toast styling in DOM
  const evalToast = await sendReq(40, 'Runtime.evaluate', {
    expression: `
      const t = document.querySelector('.toast');
      const cs = t ? window.getComputedStyle(t) : null;
      ({
        exists: !!t,
        text: t ? t.textContent.trim() : '',
        color: cs ? cs.color : '',
        bg: cs ? cs.backgroundColor : '',
        border: cs ? cs.borderColor : ''
      })
    `,
    returnByValue: true
  });
  console.log('Toast in light mode:', evalToast.result.value);

  console.log('Console errors:', errors.length, errors);
} catch (err) {
  console.error('Test error:', err);
} finally {
  edge.kill();
  process.exit(0);
}
