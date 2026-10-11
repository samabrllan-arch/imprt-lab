import bpy
import bmesh
import math
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
src_glb = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src_glb)
obj = bpy.context.scene.collection.objects[0]
bpy.context.view_layer.objects.active = obj

# Clear all UVs
uv_lay = obj.data.uv_layers.active
for poly in obj.data.polygons:
    for l_idx in poly.loop_indices:
        uv_lay.data[l_idx].uv = (0.02, 0.02)

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

front_polys = []
for p in obj.data.polygons:
    c = p.center
    n = p.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    
    # Precise boundaries for front torso:
    # 1. Front only (c.y < -0.02, and normal pointing forward n.y < 0.1)
    is_front = (c.y < -0.02 and n.y < 0.1)
    
    # 2. Below shoulder seam: z < 0.40
    below_shoulder = (c.z < 0.40)
    
    # 3. Inside armhole seams:
    # Width profile of torso:
    # At bottom hem (z ~ -0.45): |x| < 0.28
    # At waist (z ~ -0.15): |x| < 0.23
    # At chest (z ~ 0.10): |x| < 0.24
    # At upper chest (z ~ 0.30): |x| < 0.22
    max_x = 0.24
    if c.z < -0.30: max_x = 0.28
    elif c.z > 0.20: max_x = 0.22
    inside_armholes = (abs(c.x) < max_x)
    
    # 4. Outside neck cavity:
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    outside_neck = not (c.z > 0.36 and r_xy < 0.12)
    
    if is_exterior and is_front and below_shoulder and inside_armholes and outside_neck:
        p.select = True
        front_polys.append(p)

print(f"Refined front torso faces: {len(front_polys)}")

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# Align: find top (c.x=0, z=0.30), bottom (c.x=0, z=-0.40), center (c.x=0, z=0.10), right (c.x=0.15, z=0.10)
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

top_f = find_loop(front_polys, 0.0, 0.30)
bot_f = find_loop(front_polys, 0.0, -0.40)
chest_f = find_loop(front_polys, 0.0, 0.10)
right_f = find_loop(front_polys, 0.15, 0.10)

uv_top = uv_lay.data[top_f].uv
uv_bot = uv_lay.data[bot_f].uv
uv_chest = uv_lay.data[chest_f].uv

du = uv_top.x - uv_bot.x
dv = uv_top.y - uv_bot.y
rot_angle = math.pi / 2.0 - math.atan2(dv, du)
cos_a = math.cos(rot_angle)
sin_a = math.sin(rot_angle)

raw_span = math.sqrt(du*du + dv*dv)
# We want the torso height (from z=-0.4 to z=0.3 -> 0.7m) to span 0.40 in UV space
scale = 0.40 / max(0.01, raw_span)

uv_right = uv_lay.data[right_f].uv
u_r_rot = (uv_right.x - uv_chest.x) * cos_a - (uv_right.y - uv_chest.y) * sin_a
flip_u = 1.0 if u_r_rot > 0 else -1.0

# Target chest center in UV:
# U = 0.27539 (Canvas X = 564)
# In Three.js: when chest is drawn at Y = 1220, Canvas Y = 1220 -> V = 1.0 - (1220/2048) = 0.4043
target_u = 564.0 / 2048.0
target_v = (2048.0 - 1220.0) / 2048.0

front_loop_indices = [l for p in front_polys for l in p.loop_indices]
for l in front_loop_indices:
    u = uv_lay.data[l].uv.x - uv_chest.x
    v = uv_lay.data[l].uv.y - uv_chest.y
    ru = u * cos_a - v * sin_a
    rv = u * sin_a + v * cos_a
    uv_lay.data[l].uv = (target_u + ru * scale * flip_u, target_v + rv * scale)

# Verify centerline alignment
print("\nCenterline UV coordinates:")
for z_val in [0.30, 0.20, 0.10, 0.0, -0.10, -0.20, -0.30, -0.40]:
    matching = []
    for p in front_polys:
        if abs(p.center.x) < 0.02 and abs(p.center.z - z_val) < 0.03:
            for l_idx in p.loop_indices:
                uv = uv_lay.data[l_idx].uv
                matching.append((uv.x, uv.y))
    if matching:
        avg_u = sum(m[0] for m in matching) / len(matching)
        avg_v = sum(m[1] for m in matching) / len(matching)
        canvas_x = round(avg_u * 2048)
        canvas_y = round((1.0 - avg_v) * 2048)
        print(f"Z={z_val:+.2f} -> UV=({avg_u:.3f}, {avg_v:.3f}) -> Canvas=({canvas_x}, {canvas_y})")

all_u = [uv_lay.data[l].uv.x for l in front_loop_indices]
all_v = [uv_lay.data[l].uv.y for l in front_loop_indices]
print(f"\nFront Island Bounds:")
print(f"U in [{min(all_u):.3f}, {max(all_u):.3f}] -> Canvas X in [{round(min(all_u)*2048)}, {round(max(all_u)*2048)}]")
print(f"V in [{min(all_v):.3f}, {max(all_v):.3f}] -> Canvas Y in [{round((1-max(all_v))*2048)}, {round((1-min(all_v))*2048)}]")
