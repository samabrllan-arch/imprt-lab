import bpy
import bmesh
import math
import os
import sys

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
src_glb = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")
out_opt = os.path.join(base_dir, "public", "models", "shirt_woman_seam_opt.glb")

print("1. Loading GLB...")
sys.stdout.flush()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src_glb)
obj = bpy.context.scene.collection.objects[0]
bpy.context.view_layer.objects.active = obj

# Enter Edit Mode
bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(obj.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active
if not uv_lay:
    uv_lay = bm.loops.layers.uv.new("UVMap")

# 1. Reset all UVs to clean fabric (0.02, 0.02)
print("2. Resetting UVs to clean fabric...")
sys.stdout.flush()
for f in bm.faces:
    for l in f.loops:
        l[uv_lay].uv = (0.02, 0.02)

# 2. Select Front Torso faces
print("3. Selecting front torso faces...")
sys.stdout.flush()
for f in bm.faces:
    c = f.calc_center_median()
    n = f.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    is_sleeve = (abs(c.x) > 0.23 and c.z > 0.10)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.38 and r_xy < 0.16)
    is_shoulder = (c.z > 0.38)
    
    if is_exterior and not is_sleeve and not is_collar and not is_shoulder and (c.y < -0.01 or (abs(c.y) <= 0.01 and n.y < 0)):
        f.select = True
    else:
        f.select = False

bmesh.update_edit_mesh(obj.data)

print("4. Unwrapping front torso...")
sys.stdout.flush()
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)

bm = bmesh.from_edit_mesh(obj.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active

front_faces = [f for f in bm.faces if f.select]
print(f"Front faces unwrapped: {len(front_faces)}")
sys.stdout.flush()

# Find anchor loops
def find_bm_loop(faces, tx, tz):
    best_l = None
    min_d = 999
    for f in faces:
        for l in f.loops:
            v = l.vert.co
            d = (v.x - tx)**2 + (v.z - tz)**2
            if d < min_d:
                min_d = d
                best_l = l
    return best_l

top_f = find_bm_loop(front_faces, 0.0, 0.30)
bot_f = find_bm_loop(front_faces, 0.0, -0.40)
chest_f = find_bm_loop(front_faces, 0.0, -0.08)
right_f = find_bm_loop(front_faces, 0.15, -0.08)

u_top, v_top = top_f[uv_lay].uv.x, top_f[uv_lay].uv.y
u_bot, v_bot = bot_f[uv_lay].uv.x, bot_f[uv_lay].uv.y
u_chest, v_chest = chest_f[uv_lay].uv.x, chest_f[uv_lay].uv.y
u_right, v_right = right_f[uv_lay].uv.x, right_f[uv_lay].uv.y

du = u_top - u_bot
dv = v_top - v_bot
rot_angle_f = math.pi / 2.0 - math.atan2(dv, du)
cos_af = math.cos(rot_angle_f)
sin_af = math.sin(rot_angle_f)

raw_span_f = math.sqrt(du*du + dv*dv)
scale_f = 0.28 / max(0.01, raw_span_f)

u_r_rot = (u_right - u_chest) * cos_af - (v_right - v_chest) * sin_af
flip_u_f = 1.0 if u_r_rot > 0 else -1.0

target_u_f = 564.0 / 2048.0   # 0.27539
target_v_f = (2048.0 - 1220.0) / 2048.0 # 0.40430

# Read all raw UVs before overwriting
raw_front_uvs = {}
for f in front_faces:
    for l in f.loops:
        raw_front_uvs[l] = (float(l[uv_lay].uv.x), float(l[uv_lay].uv.y))

for f in front_faces:
    for l in f.loops:
        u0, v0 = raw_front_uvs[l]
        u_rel = u0 - u_chest
        v_rel = v0 - v_chest
        ru = u_rel * cos_af - v_rel * sin_af
        rv = u_rel * sin_af + v_rel * cos_af
        l[uv_lay].uv = (target_u_f + ru * scale_f * flip_u_f, target_v_f + rv * scale_f)

print("Front torso aligned.")
sys.stdout.flush()

# 3. Select Back Torso faces
print("5. Selecting back torso faces...")
sys.stdout.flush()
for f in bm.faces:
    c = f.calc_center_median()
    n = f.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    is_sleeve = (abs(c.x) > 0.23 and c.z > 0.10)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.38 and r_xy < 0.16)
    is_shoulder = (c.z > 0.38)
    
    if is_exterior and not is_sleeve and not is_collar and not is_shoulder and (c.y > 0.01 or (abs(c.y) <= 0.01 and n.y >= 0)):
        f.select = True
    else:
        f.select = False

bmesh.update_edit_mesh(obj.data)

print("6. Unwrapping back torso...")
sys.stdout.flush()
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)

bm = bmesh.from_edit_mesh(obj.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active

back_faces = [f for f in bm.faces if f.select]
print(f"Back faces unwrapped: {len(back_faces)}")
sys.stdout.flush()

top_b = find_bm_loop(back_faces, 0.0, 0.30)
bot_b = find_bm_loop(back_faces, 0.0, -0.40)
center_b = find_bm_loop(back_faces, 0.0, -0.08)
right_b = find_bm_loop(back_faces, -0.15, -0.08)

u_top_b, v_top_b = top_b[uv_lay].uv.x, top_b[uv_lay].uv.y
u_bot_b, v_bot_b = bot_b[uv_lay].uv.x, bot_b[uv_lay].uv.y
u_center_b, v_center_b = center_b[uv_lay].uv.x, center_b[uv_lay].uv.y
u_right_b, v_right_b = right_b[uv_lay].uv.x, right_b[uv_lay].uv.y

du_b = u_top_b - u_bot_b
dv_b = v_top_b - v_bot_b
rot_angle_b = math.pi / 2.0 - math.atan2(dv_b, du_b)
cos_ab = math.cos(rot_angle_b)
sin_ab = math.sin(rot_angle_b)
scale_b = 0.28 / max(0.01, math.sqrt(du_b*du_b + dv_b*dv_b))

u_rb_rot = (u_right_b - u_center_b) * cos_ab - (v_right_b - v_center_b) * sin_ab
flip_u_b = 1.0 if u_rb_rot > 0 else -1.0

target_u_b = 1536.0 / 2048.0  # 0.75000
target_v_b = target_v_f

raw_back_uvs = {}
for f in back_faces:
    for l in f.loops:
        raw_back_uvs[l] = (float(l[uv_lay].uv.x), float(l[uv_lay].uv.y))

for f in back_faces:
    for l in f.loops:
        u0, v0 = raw_back_uvs[l]
        u_rel = u0 - u_center_b
        v_rel = v0 - v_center_b
        ru = u_rel * cos_ab - v_rel * sin_ab
        rv = u_rel * sin_ab + v_rel * cos_ab
        l[uv_lay].uv = (target_u_b + ru * scale_b * flip_u_b, target_v_b + rv * scale_b)

bmesh.update_edit_mesh(obj.data)
bpy.ops.object.mode_set(mode='OBJECT')

print("7. Exporting standard GLB...")
sys.stdout.flush()
bpy.ops.export_scene.gltf(filepath=out_opt, export_format='GLB')
print(f"Exported standard GLB: {os.path.getsize(out_opt)} bytes")
