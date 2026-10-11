import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const edge = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9224',
  '--window-size=1440,900',
  'http://localhost:3000/'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const tabsRes = await fetch('http://localhost:9224/json');
  const tabs = await tabsRes.json();
  const target = tabs.find(t => t.url.includes('localhost:3000'));
  if (!target) throw new Error('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Emulation.setDeviceMetricsOverride', params: {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  }}));

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

  await new Promise(r => setTimeout(r, 3000));

  // Screenshot wide desktop
  const shot = await sendReq(10, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tools/result_desktop_wide.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved tools/result_desktop_wide.png');

} catch (err) {
  console.error(err);
} finally {
  edge.kill();
  process.exit(0);
}
