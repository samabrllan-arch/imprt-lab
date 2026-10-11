import subprocess
import time
import json
import urllib.request
import asyncio
import base64

# Simple script to inspect test.html using CDP
async def inspect():
    import websockets
    resp = urllib.request.urlopen('http://localhost:9222/json')
    tabs = json.loads(resp.read().decode())
    target = [t for t in tabs if t.get('url') == 'http://localhost:3000/test.html'][0]
    ws_url = target['webSocketDebuggerUrl']
    
    async with websockets.connect(ws_url) as ws:
        # Enable console and runtime
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
        await ws.send(json.dumps({'id': 2, 'method': 'Console.enable'}))
        
        # Wait 3 seconds
        await asyncio.sleep(3)
        
        # Evaluate: check models loaded
        await ws.send(json.dumps({
            'id': 3,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': 'JSON.stringify({ badge: document.getElementById("badge-loading").style.display, badgeText: document.getElementById("badge-loading").textContent })'
            }
        }))
        
        # Take screenshot
        await ws.send(json.dumps({
            'id': 4,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        
        while True:
            msg = json.loads(await ws.recv())
            if msg.get('id') == 3:
                print('Eval result:', msg.get('result'))
            if msg.get('id') == 4:
                png_bytes = base64.b64decode(msg['result']['data'])
                with open('tools/cdp_screenshot.png', 'wb') as f:
                    f.write(png_bytes)
                print('Screenshot saved!')
                break
            if msg.get('method') == 'Runtime.consoleAPICalled':
                print('Console:', msg['params']['type'], [a.get('value') for a in msg['params']['args']])
            if msg.get('method') == 'Runtime.exceptionThrown':
                print('Exception:', msg['params']['exceptionDetails'])

# Check if websockets library is installed
try:
    import websockets
    asyncio.run(inspect())
except ImportError:
    print('websockets not installed')
