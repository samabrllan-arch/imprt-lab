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

print("2. Clearing UVs to clean fabric (0.02, 0.02)...")
sys.stdout.flush()
uv_lay = obj.data.uv_layers.active
for poly in obj.data.polygons:
    for l_idx in poly.loop_indices:
        uv_lay.data[l_idx].uv = (0.02, 0.02)

print("3. Selecting front torso faces...")
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
    is_sleeve = (abs(c.x) > 0.23 and c.z > 0.10)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.36 and r_xy < 0.16)
    is_shoulder = (c.z > 0.38)
    
    if is_exterior and not is_sleeve and not is_collar and not is_shoulder:
        if c.y < -0.01 or (abs(c.y) <= 0.01 and n.y < 0):
            p.select = True
            front_polys.append(p)

print(f"Front torso faces: {len(front_polys)}")
sys.stdout.flush()

print("4. Unwrapping front torso with ANGLE_BASED...")
sys.stdout.flush()
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

print("5. Aligning front UV island...")
sys.stdout.flush()
def find_loop(polys, target_x, target_z):
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

top_f = find_loop(front_polys, 0.0, 0.32)
bot_f = find_loop(front_polys, 0.0, -0.45)
chest_f = find_loop(front_polys, 0.0, 0.16)
right_f = find_loop(front_polys, 0.15, 0.16)

uv_top_f = uv_lay.data[top_f].uv
uv_bot_f = uv_lay.data[bot_f].uv
uv_chest_f = uv_lay.data[chest_f].uv

du = uv_top_f.x - uv_bot_f.x
dv = uv_top_f.y - uv_bot_f.y
rot_angle_f = math.pi / 2.0 - math.atan2(dv, du)
cos_af = math.cos(rot_angle_f)
sin_af = math.sin(rot_angle_f)

scale_f = 0.34 / max(0.01, math.sqrt(du*du + dv*dv))

uv_right_f = uv_lay.data[right_f].uv
u_r_rot = (uv_right_f.x - uv_chest_f.x) * cos_af - (uv_right_f.y - uv_chest_f.y) * sin_af
flip_u_f = 1.0 if u_r_rot > 0 else -1.0

target_u_f = 564.0 / 2048.0
target_v_f = (2048.0 - 1220.0) / 2048.0

front_loop_indices = [l for p in front_polys for l in p.loop_indices]
for l in front_loop_indices:
    u = uv_lay.data[l].uv.x - uv_chest_f.x
    v = uv_lay.data[l].uv.y - uv_chest_f.y
    ru = u * cos_af - v * sin_af
    rv = u * sin_af + v * cos_af
    uv_lay.data[l].uv = (target_u_f + ru * scale_f * flip_u_f, target_v_f + rv * scale_f)

print("6. Selecting back torso faces...")
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
    is_collar = (c.z > 0.36 and r_xy < 0.16)
    is_shoulder = (c.z > 0.38)
    
    if is_exterior and not is_sleeve and not is_collar and not is_shoulder:
        if c.y > 0.01 or (abs(c.y) <= 0.01 and n.y >= 0):
            p.select = True
            back_polys.append(p)

print(f"Back torso faces: {len(back_polys)}")
sys.stdout.flush()

print("7. Unwrapping back torso...")
sys.stdout.flush()
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

print("8. Aligning back UV island...")
sys.stdout.flush()
top_b = find_loop(back_polys, 0.0, 0.32)
bot_b = find_loop(back_polys, 0.0, -0.45)
center_b = find_loop(back_polys, 0.0, 0.16)
right_b = find_loop(back_polys, -0.15, 0.16)

uv_top_b = uv_lay.data[top_b].uv
uv_bot_b = uv_lay.data[bot_b].uv
uv_center_b = uv_lay.data[center_b].uv

du_b = uv_top_b.x - uv_bot_b.x
dv_b = uv_top_b.y - uv_bot_b.y
rot_angle_b = math.pi / 2.0 - math.atan2(dv_b, du_b)
cos_ab = math.cos(rot_angle_b)
sin_ab = math.sin(rot_angle_b)
scale_b = 0.34 / max(0.01, math.sqrt(du_b*du_b + dv_b*dv_b))

uv_right_b = uv_lay.data[right_b].uv
u_rb_rot = (uv_right_b.x - uv_center_b.x) * cos_ab - (uv_right_b.y - uv_center_b.y) * sin_ab
flip_u_b = 1.0 if u_rb_rot > 0 else -1.0

target_u_b = 1536.0 / 2048.0
target_v_b = target_v_f

back_loop_indices = [l for p in back_polys for l in p.loop_indices]
for l in back_loop_indices:
    u = uv_lay.data[l].uv.x - uv_center_b.x
    v = uv_lay.data[l].uv.y - uv_center_b.y
    ru = u * cos_ab - v * sin_ab
    rv = u * sin_ab + v * cos_ab
    uv_lay.data[l].uv = (target_u_b + ru * scale_b * flip_u_b, target_v_b + rv * scale_b)

print("9. Exporting standard GLB...")
sys.stdout.flush()
bpy.ops.export_scene.gltf(
    filepath=out_opt,
    export_format='GLB'
)
print(f"Exported standard GLB to {out_opt}: {os.path.getsize(out_opt)} bytes")
