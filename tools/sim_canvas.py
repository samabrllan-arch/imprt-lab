import sys

# Let's draw the decal rectangle on a 2048x2048 image
from PIL import Image, ImageDraw

W, H = 2048, 2048
img = Image.new("RGBA", (W, H), (15, 18, 25, 255))
draw = ImageDraw.Draw(img)

area = {"x": 568, "y": 1380, "width": 420, "height": 420}

# Clip rect
cx_clip = area["x"] - area["width"] * 0.58
cy_clip = area["y"] - area["height"] * 0.58
cw_clip = area["width"] * 1.16
ch_clip = area["height"] * 1.16
draw.rectangle([cx_clip, cy_clip, cx_clip + cw_clip, cy_clip + ch_clip], outline=(255, 0, 0), width=3)

# Decal rect
targetW = 420
targetH = 420
x0 = area["x"] - targetW/2
y0 = area["y"] - targetH/2
draw.rectangle([x0, y0, x0 + targetW, y0 + targetH], fill=(255, 200, 0, 200), outline=(255, 255, 255), width=4)
draw.ellipse([area["x"]-10, area["y"]-10, area["x"]+10, area["y"]+10], fill=(255, 0, 255))

out_path = r"C:\Users\samab\.gemini\antigravity-ide\brain\3b32ae4e-6084-4fcb-8357-d8479a901d31\simulated_canvas.png"
img.save(out_path)
print("Canvas simulado guardado en:", out_path)
