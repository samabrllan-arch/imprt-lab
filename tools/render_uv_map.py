# Render exact UV map as PNG image
import sys
from PIL import Image, ImageDraw, ImageFont

obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

print("Cargando OBJ y mapeando UVs a imagen 2048x2048...")
uvs = []
faces = []

with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("vt "):
            uvs.append([float(x) for x in line.strip().split()[1:3]])
        elif line.startswith("f "):
            parts = line.strip().split()[1:]
            face = []
            for p in parts:
                idx = p.split("/")
                vt_i = int(idx[1]) - 1 if len(idx) > 1 and idx[1] else -1
                if vt_i != -1:
                    face.append(vt_i)
            if len(face) >= 3:
                faces.append(face)

# Crear imagen 1024x1024 para velocidad
W, H = 1024, 1024
img = Image.new("RGBA", (W, H), (15, 18, 25, 255))
draw = ImageDraw.Draw(img)

# Dibujar caras UV muestreadas
for f in faces[::8]:
    pts = []
    for vt_i in f:
        if 0 <= vt_i < len(uvs):
            u, v = uvs[vt_i]
            x = int(u * W)
            y = int((1.0 - v) * H)
            pts.append((x, y))
    if len(pts) >= 3:
        draw.polygon(pts, outline=(40, 70, 110, 180), fill=(25, 35, 55, 100))

# Dibujar las 4 zonas actuales escaladas a 1024
zones = {
    "front": {"x": int(568/2), "y": int(1380/2), "w": int(420/2), "h": int(420/2), "col": (255, 80, 0)},
    "back": {"x": int(1587/2), "y": int(1350/2), "w": int(460/2), "h": int(460/2), "col": (0, 200, 255)},
    "sleeveLeft": {"x": int(457/2), "y": int(635/2), "w": int(280/2), "h": int(240/2), "col": (255, 0, 150)},
    "sleeveRight": {"x": int(457/2), "y": int(247/2), "w": int(280/2), "h": int(240/2), "col": (0, 255, 100)}
}

for name, z in zones.items():
    x, y, w, h = z["x"], z["y"], z["w"], z["h"]
    draw.rectangle([x - w/2, y - h/2, x + w/2, y + h/2], outline=z["col"], width=3)
    draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=z["col"])
    draw.text((x - 30, y - 10), name, fill=(255, 255, 255))

out_path = r"C:\Users\samab\.gemini\antigravity-ide\brain\3b32ae4e-6084-4fcb-8357-d8479a901d31\uv_layout_rendered.png"
img.save(out_path)
print(f"UV layout renderizado guardado en: {out_path}")
