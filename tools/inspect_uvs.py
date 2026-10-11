import os

obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

mat_uvs = {}
verts = []
uvs = []

print("Leyendo vertices y UVs del OBJ original de CLO3D...")

with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    current_mat = "default"
    for line in f:
        if line.startswith("v "):
            p = [float(x) for x in line.strip().split()[1:4]]
            verts.append(p)
        elif line.startswith("vt "):
            u = [float(x) for x in line.strip().split()[1:3]]
            uvs.append(u)
        elif line.startswith("usemtl "):
            current_mat = line.strip().split()[1]
            if current_mat not in mat_uvs:
                mat_uvs[current_mat] = {
                    "u_min": 100.0, "u_max": -100.0,
                    "v_min": 100.0, "v_max": -100.0,
                    "count": 0, "pos_x": [], "pos_y": [], "pos_z": []
                }
        elif line.startswith("f "):
            parts = line.strip().split()[1:]
            for part in parts:
                indices = part.split("/")
                if len(indices) >= 2 and indices[1]:
                    vt_idx = int(indices[1]) - 1
                    v_idx = int(indices[0]) - 1
                    if 0 <= vt_idx < len(uvs) and 0 <= v_idx < len(verts):
                        u, v = uvs[vt_idx]
                        vx, vy, vz = verts[v_idx]
                        d = mat_uvs[current_mat]
                        d["u_min"] = min(d["u_min"], u)
                        d["u_max"] = max(d["u_max"], u)
                        d["v_min"] = min(d["v_min"], v)
                        d["v_max"] = max(d["v_max"], v)
                        d["count"] += 1
                        if len(d["pos_x"]) < 200:
                            d["pos_x"].append(vx)
                            d["pos_y"].append(vy)
                            d["pos_z"].append(vz)

print("\n--- UVs y Posiciones 3D por Material en CLO3D ---")
for mat, d in mat_uvs.items():
    if d["count"] > 0:
        avg_x = sum(d["pos_x"]) / len(d["pos_x"])
        avg_y = sum(d["pos_y"]) / len(d["pos_y"])
        avg_z = sum(d["pos_z"]) / len(d["pos_z"])
        print(f"Material: {mat}")
        print(f"  Vértices asociados: {d['count']}")
        print(f"  U Range: [{d['u_min']:.4f}, {d['u_max']:.4f}]")
        print(f"  V Range: [{d['v_min']:.4f}, {d['v_max']:.4f}]")
        print(f"  Posición 3D Promedio: X={avg_x:.3f}, Y={avg_y:.3f}, Z={avg_z:.3f}")
