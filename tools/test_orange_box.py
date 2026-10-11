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

# Comprobar qué vértices caen dentro del rectángulo del orange box:
# Canvas X: [358, 778] -> U: [358/2048, 778/2048] = [0.1748, 0.3799]
# Canvas Y: [1170, 1590] -> V: [1.0 - 1590/2048, 1.0 - 1170/2048] = [0.2236, 0.4287]

u_min, u_max = 358/2048, 778/2048
v_min, v_max = 1.0 - 1590/2048, 1.0 - 1170/2048

matching_verts = []
for f in faces:
    for v_i, vt_i in f:
        if vt_i != -1 and 0 <= vt_i < len(uvs) and 0 <= v_i < len(verts):
            u, v = uvs[vt_i]
            if u_min <= u <= u_max and v_min <= v <= v_max:
                matching_verts.append(verts[v_i])

xs = [v[0] for v in matching_verts]
ys = [v[1] for v in matching_verts]
zs = [v[2] for v in matching_verts]

print(f"Total vértices en orange box: {len(matching_verts)}")
print(f"3D X: [{min(xs):.4f}, {max(xs):.4f}] (ancho torso)")
print(f"3D Y: [{min(ys):.4f}, {max(ys):.4f}] (altura torso)")
print(f"3D Z: [{min(zs):.4f}, {max(zs):.4f}] (profundidad torso)")
