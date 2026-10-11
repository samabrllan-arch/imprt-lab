import bpy
import math

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src_path)

objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for m in objs: m.select_set(True)
bpy.context.view_layer.objects.active = objs[0]
if len(objs) > 1: bpy.ops.object.join()

obj = bpy.context.active_object

# Decimate
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0002)
bpy.ops.object.mode_set(mode='OBJECT')

mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
mod.ratio = 0.35
bpy.ops.object.modifier_apply(modifier="Decimate")

# Center
verts = [v.co for v in obj.data.vertices]
cx = (min(v.x for v in verts) + max(v.x for v in verts)) / 2
cy = (min(v.y for v in verts) + max(v.y for v in verts)) / 2
cz = (min(v.z for v in verts) + max(v.z for v in verts)) / 2
for v in obj.data.vertices:
    v.co.x -= cx; v.co.y -= cy; v.co.z -= cz

if not obj.data.uv_layers: obj.data.uv_layers.new(name="UVMap")
uv_layer = obj.data.uv_layers.active

# Select front exterior faces (torso front: y <= 0, between arms)
# Note: For exterior torso, let's keep all faces where y <= 0.02
for p in obj.data.polygons:
    p.select = False

front_faces = []
for p in obj.data.polygons:
    # Exterior front: center y <= 0, normal pointing outward
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    if dot > -0.1 and p.center.y <= 0:
        p.select = True
        front_faces.append(p)

# Unpin all loops first
for p in front_faces:
    for l_idx in p.loop_indices:
        uv_layer.data[l_idx].pin_uv = False

# Find collar loop and hem loop along x=0 centerline
collar_l = None
min_dist_c = 999
hem_l = None
min_dist_h = 999

for p in front_faces:
    for l_idx in p.loop_indices:
        v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
        # Collar: x=0, z around 0.40, y near min
        dc = v.co.x**2 + (v.co.z - 0.40)**2
        if dc < min_dist_c:
            min_dist_c = dc
            collar_l = l_idx
        # Hem: x=0, z around -0.75
        dh = v.co.x**2 + (v.co.z - (-0.75))**2
        if dh < min_dist_h:
            min_dist_h = dh
            hem_l = l_idx

target_front_u = 548.0 / 2048.0
# Collar at top UV (high V), Hem at bottom UV (low V)
uv_layer.data[collar_l].uv = (target_front_u, 0.85)
uv_layer.data[collar_l].pin_uv = True

uv_layer.data[hem_l].uv = (target_front_u, 0.15)
uv_layer.data[hem_l].pin_uv = True

print(f"Pinned collar loop {collar_l} at ({target_front_u:.4f}, 0.85)")
print(f"Pinned hem loop {hem_l} at ({target_front_u:.4f}, 0.15)")

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='CONFORMAL', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# Check chest UV after pinned conformal unwrap
chest_cands = []
for p in front_faces:
    for l_idx in p.loop_indices:
        v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
        d = v.co.x**2 + (v.co.z - 0.05)**2
        chest_cands.append((d, v.co, uv_layer.data[l_idx].uv))
chest_cands.sort(key=lambda it: it[0])
best_c = chest_cands[0]
print(f"Chest (x=0, z=0.05) UV: ({best_c[2].x:.4f}, {best_c[2].y:.4f})")

# Check horizontal symmetry on chest: x=-0.15 vs x=+0.15
left_c = min(chest_cands, key=lambda it: (it[1].x - (-0.15))**2 + (it[1].z - 0.05)**2)
right_c = min(chest_cands, key=lambda it: (it[1].x - 0.15)**2 + (it[1].z - 0.05)**2)
print(f"Left chest UV: ({left_c[2].x:.4f}, {left_c[2].y:.4f})")
print(f"Right chest UV: ({right_c[2].x:.4f}, {right_c[2].y:.4f})")
print(f"U span: {right_c[2].x - left_c[2].x:.4f}, delta V: {right_c[2].y - left_c[2].y:.4f}")
