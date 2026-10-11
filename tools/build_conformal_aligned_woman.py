import bpy
import math
import os

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"
pub_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models"
insp_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"

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

clean_u, clean_v = 0.50, 0.05
# Default all loops to clean fabric (sleeves, interior lining, neck cavity)
for poly in obj.data.polygons:
    for l_idx in poly.loop_indices:
        uv_layer.data[l_idx].uv = (clean_u, clean_v)

target_front_u = 548.0 / 2048.0   # 0.2676
target_back_u = 1536.0 / 2048.0  # 0.7500
target_v = (2048.0 - 720.0) / 2048.0 # 0.6484 in UV space

# --- 1. FRONT TORSO UNWRAP (Conformal / Angle Based) ---
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

front_polys = []
for p in obj.data.polygons:
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    is_exterior = (dot > -0.05)
    # Front torso panel
    if is_exterior and p.center.y < 0 and abs(p.center.x) < 0.28 and p.center.z < 0.42:
        p.select = True
        front_polys.append(p)

print(f"Front torso faces: {len(front_polys)}")
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

uv_layer = obj.data.uv_layers.active

def get_front_loop_pos(fx, fz):
    best_l = None
    min_d = 999
    for p in front_polys:
        for l_idx in p.loop_indices:
            v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
            d = (v.co.x - fx)**2 + (v.co.z - fz)**2
            if d < min_d:
                min_d = d
                best_l = l_idx
    return best_l

top_l = get_front_loop_pos(0.0, 0.30)
bot_l = get_front_loop_pos(0.0, -0.65)
chest_l = get_front_loop_pos(0.0, 0.05)

uv_top = uv_layer.data[top_l].uv
uv_bot = uv_layer.data[bot_l].uv
uv_chest = uv_layer.data[chest_l].uv

du = uv_top.x - uv_bot.x
dv = uv_top.y - uv_bot.y
current_angle = math.atan2(dv, du)
desired_angle = math.pi / 2.0
rot_angle = desired_angle - current_angle

cos_a = math.cos(rot_angle)
sin_a = math.sin(rot_angle)

raw_dist = math.sqrt(du*du + dv*dv)
desired_vert_span = 0.50
scale_f = desired_vert_span / max(0.001, raw_dist)

left_l = get_front_loop_pos(-0.15, 0.05)
right_l = get_front_loop_pos(0.15, 0.05)

front_loop_indices = [l for p in front_polys for l in p.loop_indices]
rotated_uvs = {}
for l in front_loop_indices:
    u = uv_layer.data[l].uv.x - uv_chest.x
    v = uv_layer.data[l].uv.y - uv_chest.y
    ru = u * cos_a - v * sin_a
    rv = u * sin_a + v * cos_a
    rotated_uvs[l] = (ru * scale_f, rv * scale_f)

flip_u = 1.0

for l in front_loop_indices:
    ru, rv = rotated_uvs[l]
    final_u = target_front_u + ru * flip_u
    final_v = target_v + rv
    uv_layer.data[l].uv = (final_u, final_v)

print(f"Front torso aligned: chest at ({target_front_u:.4f}, {target_v:.4f}), flip_u={flip_u}")

# --- 2. BACK TORSO UNWRAP (Conformal / Angle Based) ---
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

back_polys = []
for p in obj.data.polygons:
    p.select = False
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    is_exterior = (dot > -0.05)
    if is_exterior and p.center.y > 0 and abs(p.center.x) < 0.28 and p.center.z < 0.42:
        p.select = True
        back_polys.append(p)

print(f"Back torso faces: {len(back_polys)}")
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

uv_layer = obj.data.uv_layers.active

def get_back_loop_pos(fx, fz):
    best_l = None
    min_d = 999
    for p in back_polys:
        for l_idx in p.loop_indices:
            v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
            d = (v.co.x - fx)**2 + (v.co.z - fz)**2
            if d < min_d:
                min_d = d
                best_l = l_idx
    return best_l

top_b = get_back_loop_pos(0.0, 0.30)
bot_b = get_back_loop_pos(0.0, -0.65)
center_b = get_back_loop_pos(0.0, 0.05)

uv_top_b = uv_layer.data[top_b].uv
uv_bot_b = uv_layer.data[bot_b].uv
uv_center_b = uv_layer.data[center_b].uv

du_b = uv_top_b.x - uv_bot_b.x
dv_b = uv_top_b.y - uv_bot_b.y
current_angle_b = math.atan2(dv_b, du_b)
rot_angle_b = desired_angle - current_angle_b

cos_ab = math.cos(rot_angle_b)
sin_ab = math.sin(rot_angle_b)
scale_fb = desired_vert_span / max(0.001, math.sqrt(du_b*du_b + dv_b*dv_b))

left_b = get_back_loop_pos(-0.15, 0.05)
right_b = get_back_loop_pos(0.15, 0.05)

back_loop_indices = [l for p in back_polys for l in p.loop_indices]
rotated_uvs_b = {}
for l in back_loop_indices:
    u = uv_layer.data[l].uv.x - uv_center_b.x
    v = uv_layer.data[l].uv.y - uv_center_b.y
    ru = u * cos_ab - v * sin_ab
    rv = u * sin_ab + v * cos_ab
    rotated_uvs_b[l] = (ru * scale_fb, rv * scale_fb)

# Ensure natural left-to-right reading direction on back
flip_ub = 1.0

for l in back_loop_indices:
    ru, rv = rotated_uvs_b[l]
    final_u = target_back_u + ru * flip_ub
    final_v = target_v + rv
    uv_layer.data[l].uv = (final_u, final_v)

print(f"Back torso aligned: center at ({target_back_u:.4f}, {target_v:.4f}), flip_ub={flip_ub}")

# Export standard GLB
out_opt = os.path.join(pub_dir, "shirt_woman_opt.glb")
bpy.ops.export_scene.gltf(filepath=out_opt, export_format='GLB')
print(f"Saved {out_opt}: {os.path.getsize(out_opt)} bytes")

# Export Draco GLB
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
print(f"Saved {out_draco}: {os.path.getsize(out_draco)} bytes")

# Material with 2-sided texture
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.film_transparent = True

tex_path = os.path.join(insp_dir, "test_woman_tex.png")
mat = bpy.data.materials.new(name="ShirtMat")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get('Principled BSDF')
if os.path.exists(tex_path):
    tex_node = mat.node_tree.nodes.new('ShaderNodeTexImage')
    tex_node.image = bpy.data.images.load(tex_path)
    mat.node_tree.links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])

for o in objs:
    o.data.materials.clear()
    o.data.materials.append(mat)

# Camera & Light
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 55
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

light_data = bpy.data.lights.new(name="Light", type='AREA')
light_data.energy = 250
light_data.size = 2.0
light_obj = bpy.data.objects.new("Light", light_data)
scene.collection.objects.link(light_obj)

# 1. Render front
cam.location = (0, -1.8, 0.0)
cam.rotation_euler = (math.radians(90), 0, 0)
light_obj.location = (0.5, -1.5, 1.0)
light_obj.rotation_euler = (math.radians(60), 0, math.radians(20))
out_front = os.path.join(insp_dir, "test_woman_conformal_front.png")
scene.render.filepath = out_front
bpy.ops.render.render(write_still=True)
print(f"Rendered front to: {out_front}")

# 2. Render back
cam.location = (0, 1.8, 0.0)
cam.rotation_euler = (math.radians(90), 0, math.radians(180))
light_obj.location = (-0.5, 1.5, 1.0)
light_obj.rotation_euler = (math.radians(60), 0, math.radians(-160))
out_back = os.path.join(insp_dir, "test_woman_conformal_back.png")
scene.render.filepath = out_back
bpy.ops.render.render(write_still=True)
print(f"Rendered back to: {out_back}")
