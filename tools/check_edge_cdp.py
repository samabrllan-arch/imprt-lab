import subprocess
import time
import json
import urllib.request
import asyncio
import sys

# Start edge with remote debugging
edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
proc = subprocess.Popen([
    edge,
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    'http://localhost:3000/test.html'
])

time.sleep(2)

try:
    resp = urllib.request.urlopen('http://localhost:9222/json')
    tabs = json.loads(resp.read().decode())
    print('Tabs:', tabs)
finally:
    proc.terminate()
