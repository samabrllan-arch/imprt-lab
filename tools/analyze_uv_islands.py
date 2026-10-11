import sys
from collections import defaultdict

obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

print("Cargando OBJ...")
verts = []
uvs = []
faces = [] # list of [(v_idx, vt_idx), ...]

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
            if len(face) >= 3:
                faces.append(face)

print(f"Total Verts: {len(verts)}, UVs: {len(uvs)}, Caras: {len(faces)}")

# Encontrar componentes conexas en el espacio UV (UV islands)
# Dos caras pertenecen a la misma isla UV si comparten al menos un índice vt
vt_to_faces = defaultdict(list)
for f_idx, face in enumerate(faces):
    for v_i, vt_i in face:
        if vt_i != -1:
            vt_to_faces[vt_i].append(f_idx)

visited = [False] * len(faces)
islands = []

for f_idx in range(len(faces)):
    if visited[f_idx]:
        continue
    queue = [f_idx]
    visited[f_idx] = True
    island_faces = []
    
    while queue:
        curr = queue.pop()
        island_faces.append(curr)
        for v_i, vt_i in faces[curr]:
            if vt_i != -1:
                for neighbor in vt_to_faces[vt_i]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append(neighbor)
                        
    islands.append(island_faces)

print(f"Se encontraron {len(islands)} islas UV distintas.")

for i, island in enumerate(islands):
    if len(island) < 1000:
        continue
    u_vals = []
    v_vals = []
    x_vals = []
    y_vals = []
    z_vals = []
    for f_idx in island:
        for v_i, vt_i in faces[f_idx]:
            if vt_i != -1 and 0 <= vt_i < len(uvs):
                u, v = uvs[vt_i]
                u_vals.append(u)
                v_vals.append(v)
            if 0 <= v_i < len(verts):
                x, y, z = verts[v_i]
                x_vals.append(x)
                y_vals.append(y)
                z_vals.append(z)
                
    u_min, u_max = min(u_vals), max(u_vals)
    v_min, v_max = min(v_vals), max(v_vals)
    x_min, x_max = min(x_vals), max(x_vals)
    y_min, y_max = min(y_vals), max(y_vals)
    z_min, z_max = min(z_vals), max(z_vals)
    
    cx_3d = (x_min + x_max) / 2
    cy_3d = (y_min + y_max) / 2
    cz_3d = (z_min + z_max) / 2
    
    cu_uv = (u_min + u_max) / 2
    cv_uv = (v_min + v_max) / 2
    
    # Identificar pieza según anatomía 3D
    desc = "Desconocida"
    # collar: y alto, perimetro pequeño
    if y_min > 0.55 and (y_max - y_min) < 0.1:
        desc = "Cuello / Rib collar"
    elif cz_3d > 0.04 and abs(cx_3d) < 0.05:
        desc = "PIEZA DELANTERA (PECHO / FRENTE)"
    elif cz_3d < -0.04 and abs(cx_3d) < 0.05:
        desc = "PIEZA TRASERA (ESPALDA)"
    elif cx_3d > 0.15:
        desc = "MANGA (X positiva)"
    elif cx_3d < -0.15:
        desc = "MANGA (X negativa)"
        
    print(f"\n--- Isla {i+1} [{desc}] ({len(island)} caras) ---")
    print(f"  3D Center: X={cx_3d:.3f}, Y={cy_3d:.3f}, Z={cz_3d:.3f}")
    print(f"  3D BBox  : X=[{x_min:.3f}, {x_max:.3f}], Y=[{y_min:.3f}, {y_max:.3f}], Z=[{z_min:.3f}, {z_max:.3f}]")
    print(f"  UV BBox  : U=[{u_min:.4f}, {u_max:.4f}], V=[{v_min:.4f}, {v_max:.4f}]")
    print(f"  Canvas 2048x2048:")
    print(f"    centerX = {int(cu_uv * 2048)}, centerY = {int((1.0 - cv_uv) * 2048)}")
    print(f"    width   = {int((u_max - u_min) * 2048)}, height = {int((v_max - v_min) * 2048)}")
