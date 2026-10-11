# Test what is on the 2048x2048 canvas
import urllib.request
import json

# Let's inspect the SVG preset size and zones
from xml.dom import minidom

svg_cyber_tiger = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff007f" />
          <stop offset="50%" stop-color="#7928ca" />
          <stop offset="100%" stop-color="#00f0ff" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="210" fill="none" stroke="url(#grad1)" stroke-width="12" stroke-dasharray="16 12"/>
      <polygon points="250,70 330,190 430,210 350,300 370,420 250,360 130,420 150,300 70,210 170,190" fill="url(#grad1)" opacity="0.9"/>
      <path d="M190,210 Q250,150 310,210 Q250,290 190,210 Z" fill="#090a10" stroke="#00f0ff" stroke-width="6"/>
      <circle cx="215" cy="210" r="14" fill="#ff007f"/>
      <circle cx="285" cy="210" r="14" fill="#ff007f"/>
      <text x="250" y="470" font-family="'Outfit', sans-serif" font-weight="900" font-size="34" fill="#00f0ff" text-anchor="middle" letter-spacing="8">TOKYO CYBER</text>
    </svg>"""

print("SVG Length:", len(svg_cyber_tiger))
