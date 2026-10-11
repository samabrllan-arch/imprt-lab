import sys

obj_path = r"C:\Users\samab\Downloads\obj\obj_1.obj"

verts = []
with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("v "):
            verts.append([float(x) for x in line.strip().split()[1:4]])

xs = [v[0] for v in verts]
ys = [v[1] for v in verts]
zs = [v[2] for v in verts]

min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)
min_z, max_z = min(zs), max(zs)

print(f"obj_1.obj: BBox X: [{min_x:.4f}, {max_x:.4f}], Size X = {max_x - min_x:.4f}")
print(f"obj_1.obj: BBox Y: [{min_y:.4f}, {max_y:.4f}], Size Y = {max_y - min_y:.4f}")
print(f"obj_1.obj: BBox Z: [{min_z:.4f}, {max_z:.4f}], Size Z = {max_z - min_z:.4f}")
