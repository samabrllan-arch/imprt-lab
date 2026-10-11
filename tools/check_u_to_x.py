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

# Check 3D X for different U on the front chest (V ~ 0.35, Z > 0.02)
for test_u in [0.15, 0.20, 0.2775, 0.35, 0.42]:
    xs = []
    for f in faces:
        for v_i, vt_i in f:
            if vt_i != -1 and 0 <= vt_i < len(uvs) and 0 <= v_i < len(verts):
                u, v = uvs[vt_i]
                x, y, z = verts[v_i]
                if abs(u - test_u) < 0.02 and abs(v - 0.35) < 0.03 and z > 0.02:
                    xs.append(x)
    if xs:
        print(f"U = {test_u:.4f} (Canvas X={int(test_u*2048)}) -> 3D X promedio = {sum(xs)/len(xs):.4f}")
