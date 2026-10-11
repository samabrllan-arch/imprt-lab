import bpy
import math
import os

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"
insp_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"
os.makedirs(insp_dir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src_path)

objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for m in objs:
    m.select_set(True)
bpy.context.view_layer.objects.active = objs[0]
if len(objs) > 1:
    bpy.ops.object.join()

obj = bpy.context.active_object

# Clean duplicates and decimate
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0002)
bpy.ops.object.mode_set(mode='OBJECT')

mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
mod.ratio = 0.35
bpy.ops.object.modifier_apply(modifier="Decimate")

# Center at (0, 0, 0)
verts = [v.co for v in obj.data.vertices]
min_x, max_x = min(v.x for v in verts), max(v.x for v in verts)
min_y, max_y = min(v.y for v in verts), max(v.y for v in verts)
min_z, max_z = min(v.z for v in verts), max(v.z for v in verts)

cx = (min_x + max_x) / 2
cy = (min_y + max_y) / 2
cz = (min_z + max_z) / 2

for v in obj.data.vertices:
    v.co.x -= cx
    v.co.y -= cy
    v.co.z -= cz

print("Testing Angle-Based unwrap for front exterior...")
# In edit mode, select ONLY front exterior faces
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

for p in obj.data.polygons:
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    is_exterior = (dot > 0)
    is_front = (p.center.y <= 0)
    if is_exterior and is_front:
        p.select = True

bpy.ops.object.mode_set(mode='EDIT')
# Unwrap selected front faces with ANGLE_BASED
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

uv_layer = obj.data.uv_layers.active
front_uvs = [uv_layer.data[l].uv for p in obj.data.polygons if p.select for l in p.loop_indices]
print(f"Front unwrap verts: {len(front_uvs)}")
if front_uvs:
    us = [uv.x for uv in front_uvs]
    vs = [uv.y for uv in front_uvs]
    print(f"Angle-based front U in [{min(us):.3f}, {max(us):.3f}], V in [{min(vs):.3f}, {max(vs):.3f}]")

print("SUCCESS")
