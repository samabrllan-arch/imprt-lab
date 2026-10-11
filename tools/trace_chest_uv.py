# Trace UV coordinate of a vertex on the center of the chest
import sys

obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

verts = []
uvs = []
faces = []

with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("v "):
            verts.append([float(x) for x in line.strip().split()[1:4]])
        elif line.startswith("vt "):
            uvs.append([float(x) for x in line.strip().split()[1:3]])
        elif line.startswith("f "):
            parts = line.strip().split()[1:]
            face = []
            for p in parts:
                idx = p.split("/")
                v_i = int(idx[0]) - 1
                vt_i = int(idx[1]) - 1 if len(idx) > 1 and idx[1] else -1
                face.append((v_i, vt_i))
            faces.append(face)

# Find vertex closest to center of chest:
# X ~ 0, Y ~ 0.58, Z > 0.04 (front center)
candidates = []
for f in faces:
    for v_i, vt_i in f:
        if vt_i != -1 and 0 <= vt_i < len(uvs) and 0 <= v_i < len(verts):
            x, y, z = verts[v_i]
            if abs(x) < 0.01 and 0.55 < y < 0.60 and z > 0.04:
                u, v = uvs[vt_i]
                candidates.append((x, y, z, u, v))

print(f"Encontrados {len(candidates)} vértices en el centro del pecho:")
for c in candidates[:10]:
    u, v = c[3], c[4]
    cx = int(u * 2048)
    cy = int((1.0 - v) * 2048)
    print(f"3D: ({c[0]:.3f}, {c[1]:.3f}, {c[2]:.3f}) -> UV: (u={u:.4f}, v={v:.4f}) -> Canvas 2048: x={cx}, y={cy}")
