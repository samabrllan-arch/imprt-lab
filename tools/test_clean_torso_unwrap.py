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

# Select front torso exterior faces only (open rectangular sheet)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

selected_count = 0
for p in obj.data.polygons:
    p.select = False
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    is_exterior = (dot > -0.05)
    # Front torso: y < 0, between armpits x in [-0.28, 0.28], below collar z < 0.42
    if is_exterior and p.center.y < 0 and abs(p.center.x) < 0.28 and p.center.z < 0.42:
        p.select = True
        selected_count += 1

print(f"Selected {selected_count} front torso exterior faces (open disc topology)")

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# Inspect unwrapped bounds
front_loops = [l for p in obj.data.polygons if p.select for l in p.loop_indices]
us = [uv_layer.data[l].uv.x for l in front_loops]
vs = [uv_layer.data[l].uv.y for l in front_loops]
print(f"Unwrapped U range: {min(us):.4f} to {max(us):.4f} (span: {max(us)-min(us):.4f})")
print(f"Unwrapped V range: {min(vs):.4f} to {max(vs):.4f} (span: {max(vs)-min(vs):.4f})")
