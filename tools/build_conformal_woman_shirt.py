import bpy
import math
import os

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"
insp_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"
pub_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models"

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

width = max_x - min_x
height = max_z - min_z
depth = max_y - min_y

target_front_u = 548.0 / 2048.0
target_back_u = 1536.0 / 2048.0
target_v = 720.0 / 2048.0
clean_fabric_u = 0.50
clean_fabric_v = 0.05

if not obj.data.uv_layers:
    obj.data.uv_layers.new(name="UVMap")
uv_layer = obj.data.uv_layers.active

# 1. Map interior to clean fabric
for p in obj.data.polygons:
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    is_exterior = (dot > 0)
    if not is_exterior:
        for l_idx in p.loop_indices:
            uv_layer.data[l_idx].uv = (clean_fabric_u, clean_fabric_v)

# 2. Select FRONT exterior faces and unwrap with ANGLE_BASED
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
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# Get bounds of unwrapped front island
front_loops = [l for p in obj.data.polygons if p.select for l in p.loop_indices]
us = [uv_layer.data[l].uv.x for l in front_loops]
vs = [uv_layer.data[l].uv.y for l in front_loops]
min_u_f, max_u_f = min(us), max(us)
min_v_f, max_v_f = min(vs), max(vs)
center_u_f = (min_u_f + max_u_f) / 2
# For vertical, chest is around 68% height of the island
center_v_f = min_v_f + (max_v_f - min_v_f) * 0.65

# Scale island to match 2048 canvas front area (~0.44 width, ~0.44 height)
desired_w = 0.44
desired_h = desired_w * ((max_v_f - min_v_f) / (max_u_f - min_u_f))
scale_fac_u = desired_w / (max_u_f - min_u_f)
scale_fac_v = scale_fac_u # uniform scaling to preserve aspect ratio

# In Three.js with CanvasTexture flipY=true:
# Check if V is aligned or needs flip:
# In Blender unwrap, top of mesh (collar) has higher V
# Blender glTF exporter inverts V: v_gltf = 1 - v_blender
# Three.js canvas samples Y = v_blender * 2048!
# When Z increases (towards collar), we want v_blender to DECREASE (towards top of canvas Y=0)!
# Therefore, higher V in Blender should map to LOWER target_v!
for l in front_loops:
    u = uv_layer.data[l].uv.x
    v = uv_layer.data[l].uv.y
    new_u = target_front_u + (u - center_u_f) * scale_fac_u
    new_v = target_v - (v - center_v_f) * scale_fac_v
    uv_layer.data[l].uv = (new_u, new_v)

# 3. Select BACK exterior faces and unwrap with ANGLE_BASED
for p in obj.data.polygons:
    p.select = False
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    is_exterior = (dot > 0)
    is_back = (p.center.y > 0)
    if is_exterior and is_back:
        p.select = True

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

back_loops = [l for p in obj.data.polygons if p.select for l in p.loop_indices]
us_b = [uv_layer.data[l].uv.x for l in back_loops]
vs_b = [uv_layer.data[l].uv.y for l in back_loops]
min_u_b, max_u_b = min(us_b), max(us_b)
min_v_b, max_v_b = min(vs_b), max(vs_b)
center_u_b = (min_u_b + max_u_b) / 2
center_v_b = min_v_b + (max_v_b - min_v_b) * 0.65

scale_fac_b = desired_w / (max_u_b - min_u_b)

for l in back_loops:
    u = uv_layer.data[l].uv.x
    v = uv_layer.data[l].uv.y
    new_u = target_back_u - (u - center_u_b) * scale_fac_b
    new_v = target_v - (v - center_v_b) * scale_fac_b
    uv_layer.data[l].uv = (new_u, new_v)

# Export Draco compressed GLB
out_draco = os.path.join(pub_dir, "shirt_woman_draco.glb")
bpy.ops.export_scene.gltf(
    filepath=out_draco,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12
)
print("Saved shirt_woman_draco.glb with conformal angle-based unwrap:", os.path.getsize(out_draco))

out_opt = os.path.join(pub_dir, "shirt_woman_opt.glb")
bpy.ops.export_scene.gltf(filepath=out_opt, export_format='GLB')
print("Saved shirt_woman_opt.glb:", os.path.getsize(out_opt))
