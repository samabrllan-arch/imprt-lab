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

# Comprobar punto en el modelo 3D para diferentes Canvas Y
# (en U=568/2048 = 0.2773, centro del pecho)
print("Canvas Y -> 3D Y (altura del pecho en el modelo):")
for canvas_y in [1100, 1140, 1200, 1260, 1300, 1340, 1400, 1500]:
    target_v = 1.0 - (canvas_y / 2048.0)
    matching_y_3d = []
    matching_z_3d = []
    for f in faces:
        for v_i, vt_i in f:
            if vt_i != -1 and 0 <= vt_i < len(uvs) and 0 <= v_i < len(verts):
                u, v = uvs[vt_i]
                if abs(u - 0.2773) < 0.04 and abs(v - target_v) < 0.015:
                    x, y, z = verts[v_i]
                    if z > 0.01: # Frontal
                        matching_y_3d.append(y)
                        matching_z_3d.append(z)
    if matching_y_3d:
        avg_y = sum(matching_y_3d) / len(matching_y_3d)
        # Recordar: BBox Y va de 0.4105 (borde inferior) a 0.6785 (cuello superior)
        # El centro del pecho anatómico está en ~ 0.58 a 0.60
        pct_height = ((avg_y - 0.4105) / 0.2680) * 100
        print(f"Canvas Y = {canvas_y}: 3D Y = {avg_y:.4f} (a {pct_height:.1f}% de altura desde el ruedo)")
