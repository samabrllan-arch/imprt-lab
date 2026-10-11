import bpy
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

uv_lay = obj.data.uv_layers.active

# Clear all UVs to clean fabric (0.02, 0.02)
for poly in obj.data.polygons:
    for l_idx in poly.loop_indices:
        uv_lay.data[l_idx].uv = (0.02, 0.02)

print("2. Selecting front torso faces...")
sys.stdout.flush()
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

front_polys = []
for p in obj.data.polygons:
    c = p.center
    n = p.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    # Sleeves and collar boundaries
    is_sleeve = (abs(c.x) > 0.23 and c.z > 0.10)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.38 and r_xy < 0.16)
    is_shoulder = (c.z > 0.38)
    
    if is_exterior and not is_sleeve and not is_collar and not is_shoulder:
        if c.y < -0.01 or (abs(c.y) <= 0.01 and n.y < 0):
            p.select = True
            front_polys.append(p)

print(f"Front torso faces: {len(front_polys)}")
sys.stdout.flush()

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# Extract raw UVs as pure python floats
front_loop_indices = [l for p in front_polys for l in p.loop_indices]
raw_uvs_f = {}
for l in front_loop_indices:
    raw_uvs_f[l] = (float(uv_lay.data[l].uv.x), float(uv_lay.data[l].uv.y))

def find_loop_idx(polys, target_x, target_z):
    best_l = None
    min_d = 999
    for p in polys:
        for l_idx in p.loop_indices:
            v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
            d = (v.co.x - target_x)**2 + (v.co.z - target_z)**2
            if d < min_d:
                min_d = d
                best_l = l_idx
    return best_l

top_f = find_loop_idx(front_polys, 0.0, 0.30)
bot_f = find_loop_idx(front_polys, 0.0, -0.40)
chest_f = find_loop_idx(front_polys, 0.0, 0.10)
right_f = find_loop_idx(front_polys, 0.15, 0.10)

u_top, v_top = raw_uvs_f[top_f]
u_bot, v_bot = raw_uvs_f[bot_f]
u_chest, v_chest = raw_uvs_f[chest_f]
u_right, v_right = raw_uvs_f[right_f]

du = u_top - u_bot
dv = v_top - v_bot
rot_angle_f = math.pi / 2.0 - math.atan2(dv, du)
cos_af = math.cos(rot_angle_f)
sin_af = math.sin(rot_angle_f)

# Height of torso from z=-0.4 to z=0.3 is 0.70m
raw_span_f = math.sqrt(du*du + dv*dv)
scale_f = 0.36 / max(0.01, raw_span_f)

u_r_rot = (u_right - u_chest) * cos_af - (v_right - v_chest) * sin_af
flip_u_f = 1.0 if u_r_rot > 0 else -1.0

target_u_f = 564.0 / 2048.0   # 0.27539
target_v_f = (2048.0 - 1220.0) / 2048.0 # 0.40430

for l in front_loop_indices:
    u0, v0 = raw_uvs_f[l]
    u_rel = u0 - u_chest
    v_rel = v0 - v_chest
    ru = u_rel * cos_af - v_rel * sin_af
    rv = u_rel * sin_af + v_rel * cos_af
    uv_lay.data[l].uv = (target_u_f + ru * scale_f * flip_u_f, target_v_f + rv * scale_f)

print(f"Front torso aligned: chest at ({target_u_f:.4f}, {target_v_f:.4f})")
sys.stdout.flush()

# --- BACK TORSO ---
print("3. Selecting back torso faces...")
sys.stdout.flush()
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

back_polys = []
for p in obj.data.polygons:
    c = p.center
    n = p.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    is_sleeve = (abs(c.x) > 0.23 and c.z > 0.10)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.38 and r_xy < 0.16)
    is_shoulder = (c.z > 0.38)
    
    if is_exterior and not is_sleeve and not is_collar and not is_shoulder:
        if c.y > 0.01 or (abs(c.y) <= 0.01 and n.y >= 0):
            p.select = True
            back_polys.append(p)

print(f"Back torso faces: {len(back_polys)}")
sys.stdout.flush()

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

back_loop_indices = [l for p in back_polys for l in p.loop_indices]
raw_uvs_b = {}
for l in back_loop_indices:
    raw_uvs_b[l] = (float(uv_lay.data[l].uv.x), float(uv_lay.data[l].uv.y))

top_b = find_loop_idx(back_polys, 0.0, 0.30)
bot_b = find_loop_idx(back_polys, 0.0, -0.40)
center_b = find_loop_idx(back_polys, 0.0, 0.10)
right_b = find_loop_idx(back_polys, -0.15, 0.10)

u_top_b, v_top_b = raw_uvs_b[top_b]
u_bot_b, v_bot_b = raw_uvs_b[bot_b]
u_center_b, v_center_b = raw_uvs_b[center_b]
u_right_b, v_right_b = raw_uvs_b[right_b]

du_b = u_top_b - u_bot_b
dv_b = v_top_b - v_bot_b
rot_angle_b = math.pi / 2.0 - math.atan2(dv_b, du_b)
cos_ab = math.cos(rot_angle_b)
sin_ab = math.sin(rot_angle_b)
scale_b = 0.36 / max(0.01, math.sqrt(du_b*du_b + dv_b*dv_b))

u_rb_rot = (u_right_b - u_center_b) * cos_ab - (v_right_b - v_center_b) * sin_ab
flip_u_b = 1.0 if u_rb_rot > 0 else -1.0

target_u_b = 1536.0 / 2048.0  # 0.75000
target_v_b = target_v_f

for l in back_loop_indices:
    u0, v0 = raw_uvs_b[l]
    u_rel = u0 - u_center_b
    v_rel = v0 - v_center_b
    ru = u_rel * cos_ab - v_rel * sin_ab
    rv = u_rel * sin_ab + v_rel * cos_ab
    uv_lay.data[l].uv = (target_u_b + ru * scale_b * flip_u_b, target_v_b + rv * scale_b)

print(f"Back torso aligned: center at ({target_u_b:.4f}, {target_v_b:.4f})")
sys.stdout.flush()

# Export standard GLB
print("4. Exporting standard GLB...")
sys.stdout.flush()
bpy.ops.export_scene.gltf(filepath=out_opt, export_format='GLB')
print(f"Exported standard GLB to {out_opt}: {os.path.getsize(out_opt)} bytes")
