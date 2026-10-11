# Comprobar orientación de los patrones (hacia dónde crece Y_3D en UV)
import sys

obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

# Muestreamos vértices de frente, espalda, y ambas mangas
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

# Comparar Y 3D contra V (UV) para cada zona
def check_orientation(name, v_min, v_max, u_min, u_max):
    y_high_v = []
    y_low_v = []
    x_high_u = []
    x_low_u = []
    for f in faces:
        for v_i, vt_i in f:
            if vt_i != -1 and 0 <= vt_i < len(uvs) and 0 <= v_i < len(verts):
                u, v = uvs[vt_i]
                x, y, z = verts[v_i]
                if u_min <= u <= u_max and v_min <= v <= v_max:
                    if v > (v_min + v_max) / 2 + 0.05:
                        y_high_v.append(y)
                    elif v < (v_min + v_max) / 2 - 0.05:
                        y_low_v.append(y)
    
    if y_high_v and y_low_v:
        avg_high = sum(y_high_v)/len(y_high_v)
        avg_low = sum(y_low_v)/len(y_low_v)
        print(f"\n{name}:")
        print(f"  V alto -> 3D Y promedio = {avg_high:.4f}")
        print(f"  V bajo  -> 3D Y promedio = {avg_low:.4f}")
        if avg_high > avg_low:
            print("  -> V crece hacia ARRIBA (en Canvas 2D: Y invertido significa que menor Canvas Y es más arriba). Orientación estándar.")
        else:
            print("  -> V crece hacia ABAJO. (Invertido verticalmente).")

check_orientation("Frente", 0.06, 0.55, 0.06, 0.49)
check_orientation("Espalda", 0.05, 0.55, 0.56, 0.99)
check_orientation("Manga Izquierda (+X)", 0.60, 0.77, 0.03, 0.41)
check_orientation("Manga Derecha (-X)", 0.79, 0.96, 0.03, 0.41)
