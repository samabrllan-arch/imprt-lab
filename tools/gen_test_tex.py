import os
import math
from PIL import Image, ImageDraw, ImageFont

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
tex_path = os.path.join(base_dir, "tools", "bench_tex.png")

# 1. Create a 2048x2048 texture that mirrors testApp.js
img = Image.new("RGBA", (2048, 2048), (17, 18, 21, 255))
draw = ImageDraw.Draw(img)

# For CLO models (man, woman_fitted): chest is at x=572, y=720 (in flipped canvas, so y=720)
# But wait, in testApp.js:
# ctx.translate(c.x, c.y); ctx.scale(1, -1); ctx.drawImage(...)
# If testApp.js translates to (572, 720) and draws size=440
# In testApp.js, it draws DECAL_PRESETS[0]
# Let's draw text and a box at (572, 720)
# In standard PIL (y=0 at top):
# canvas.translate(572, 720) with scale(1, -1):
# local (0, 0) is canvas (572, 720).
# local (+100, -100) -> canvas (572 + 100, 720 - (-100)) = (672, 820).

# Let's render a high-contrast grid and the words "STUDIO 3D"
try:
    font = ImageFont.truetype("arial.ttf", 36)
except:
    font = ImageFont.load_default()

# Draw chest box for CLO
draw.rectangle([572 - 200, 720 - 200, 572 + 200, 720 + 200], outline=(0, 240, 255, 255), width=4)
draw.text((572 - 150, 720 + 120), "STUDIO 3D", fill=(255, 255, 255, 255), font=font)

# Draw chest box for woman (Meshy): chest is at x=564, y=1220
draw.rectangle([564 - 200, 1220 - 200, 564 + 200, 1220 + 200], outline=(255, 0, 128, 255), width=4)
draw.text((564 - 150, 1220 + 120), "MESHY 3D", fill=(255, 255, 255, 255), font=font)

img.save(tex_path)
print("Saved texture to", tex_path)
