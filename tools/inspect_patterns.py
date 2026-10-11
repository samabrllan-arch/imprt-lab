obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

verts = []
uvs = []

print("Mapeando patrones 3D a coordenadas UV en CLO3D...")

front_uvs = []
back_uvs = []
sleeve_l_uvs = []
sleeve_r_uvs = []

with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    current_mat = "default"
    for line in f:
        if line.startswith("v "):
            verts.append([float(x) for x in line.strip().split()[1:4]])
        elif line.startswith("vt "):
            uvs.append([float(x) for x in line.strip().split()[1:3]])
        elif line.startswith("usemtl "):
            current_mat = line.strip().split()[1]
        elif line.startswith("f ") and current_mat == "Knit_Cotton_Jersey_FRONT_2800":
            parts = line.strip().split()[1:]
            for part in parts:
                indices = part.split("/")
                if len(indices) >= 2 and indices[1]:
                    vt_idx = int(indices[1]) - 1
                    v_idx = int(indices[0]) - 1
                    if 0 <= vt_idx < len(uvs) and 0 <= v_idx < len(verts):
                        u, v = uvs[vt_idx]
                        x, y, z = verts[v_idx]
                        
                        # Clasificación anatómica 3D
                        if abs(x) > 0.08 and y > 0.50:
                            if x < 0:
                                sleeve_l_uvs.append((u, v))
                            else:
                                sleeve_r_uvs.append((u, v))
                        elif z > 0.01:
                            front_uvs.append((u, v))
                        elif z < -0.01:
                            back_uvs.append((u, v))

def print_bbox(name, uv_list):
    if not uv_list:
        print(f"{name}: No vertices detectados")
        return
    u_vals = [p[0] for p in uv_list]
    v_vals = [p[1] for p in uv_list]
    u_min, u_max = min(u_vals), max(u_vals)
    v_min, v_max = min(v_vals), max(v_vals)
    u_center = (u_min + u_max) / 2
    v_center = (v_min + v_max) / 2
    width = u_max - u_min
    height = v_max - v_min
    print(f"\n{name} ({len(uv_list)} vértices):")
    print(f"  U: [{u_min:.4f}, {u_max:.4f}] -> Centro U = {u_center:.4f}, Ancho = {width:.4f}")
    print(f"  V: [{v_min:.4f}, {v_max:.4f}] -> Centro V = {v_center:.4f}, Alto  = {height:.4f}")
    print(f"  En Canvas 2048x2048 (con V invertido de Canvas 2D):")
    print(f"    x: {int(u_center * 2048)}, y: {int((1.0 - v_center) * 2048)}, width: {int(width * 2048)}, height: {int(height * 2048)}")

print_bbox("--- PIEZA DELANTERA (PECHO) ---", front_uvs)
print_bbox("--- PIEZA TRASERA (ESPALDA) ---", back_uvs)
print_bbox("--- MANGA IZQUIERDA ---", sleeve_l_uvs)
print_bbox("--- MANGA DERECHA ---", sleeve_r_uvs)
