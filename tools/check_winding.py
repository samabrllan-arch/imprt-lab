import sys

obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

verts = []
normals = []
faces = []

with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("v "):
            verts.append([float(x) for x in line.strip().split()[1:4]])
        elif line.startswith("vn "):
            normals.append([float(x) for x in line.strip().split()[1:4]])
        elif line.startswith("f "):
            parts = line.strip().split()[1:]
            face = []
            for p in parts:
                idx = p.split("/")
                v_i = int(idx[0]) - 1
                vn_i = int(idx[2]) - 1 if len(idx) > 2 and idx[2] else -1
                face.append((v_i, vn_i))
            if len(face) >= 3:
                faces.append(face)

# Comprobar caras en el pecho frontal
ccw_count = 0
cw_count = 0

for f in faces:
    v1 = verts[f[0][0]]
    v2 = verts[f[1][0]]
    v3 = verts[f[2][0]]
    
    # Solo pecho frontal exterior (z > 0.02)
    if v1[2] > 0.02 and v2[2] > 0.02 and v3[2] > 0.02:
        # Cross product (v2 - v1) x (v3 - v1)
        e1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]]
        e2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]]
        nx = e1[1]*e2[2] - e1[2]*e2[1]
        ny = e1[2]*e2[0] - e1[0]*e2[2]
        nz = e1[0]*e2[1] - e1[1]*e2[0]
        
        # nz > 0 means normal points forward (+Z, outward from chest)
        if nz > 0:
            ccw_count += 1
        else:
            cw_count += 1

print(f"Pecho frontal exterior: Normal geométrica +Z (CCW): {ccw_count}, -Z (CW): {cw_count}")
