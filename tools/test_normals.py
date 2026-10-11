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
            faces.append(face)

print(f"Total verts: {len(verts)}, normals: {len(normals)}, faces: {len(faces)}")

# Check test formula
inner_detected = 0
outer_detected = 0
fails = 0

for f in faces:
    for v_i, vn_i in f:
        if 0 <= v_i < len(verts) and 0 <= vn_i < len(normals):
            px, py, pz = verts[v_i]
            nx, ny, nz = normals[vn_i]
            dot = px * nx + pz * nz
            if dot > -0.0005:
                outer_detected += 1
            else:
                inner_detected += 1

print(f"Outer vertices detected: {outer_detected}")
print(f"Inner vertices detected: {inner_detected}")
