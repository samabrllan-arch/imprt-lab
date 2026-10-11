import bpy
import math

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_opt.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH'][0]
uv_layer = obj.data.uv_layers.active

# Let's find 3 key reference points on the front centerline:
# 1. Collar center (x=0, y < -0.1, z high)
# 2. Chest center (x=0, y < -0.1, z=0)
# 3. Hem center (x=0, y < -0.1, z low)
# And 2 horizontal points on chest:
# 4. Left chest (x = -0.15, z=0)
# 5. Right chest (x = +0.15, z=0)

def find_closest(tx, ty_sign, tz):
    cand = []
    for p in obj.data.polygons:
        if (ty_sign < 0 and p.center.y < -0.1) or (ty_sign > 0 and p.center.y > 0.1):
            for l_idx in p.loop_indices:
                v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
                d = (v.co.x - tx)**2 + (v.co.z - tz)**2
                cand.append((d, v.co, uv_layer.data[l_idx].uv))
    cand.sort(key=lambda it: it[0])
    return cand[0]

collar = find_closest(0.0, -1, 0.45)
chest = find_closest(0.0, -1, 0.05)
hem = find_closest(0.0, -1, -0.70)
left_ch = find_closest(-0.15, -1, 0.05)
right_ch = find_closest(0.15, -1, 0.05)

print(f"Collar (x=0, z=0.45): UV=({collar[2].x:.4f}, {collar[2].y:.4f})")
print(f"Chest (x=0, z=0.05):  UV=({chest[2].x:.4f}, {chest[2].y:.4f})")
print(f"Hem (x=0, z=-0.70):   UV=({hem[2].x:.4f}, {hem[2].y:.4f})")
print(f"Left ch (x=-0.15):    UV=({left_ch[2].x:.4f}, {left_ch[2].y:.4f})")
print(f"Right ch (x=+0.15):   UV=({right_ch[2].x:.4f}, {right_ch[2].y:.4f})")

# Check vector from Hem to Collar in UV space
d_vert_u = collar[2].x - hem[2].x
d_vert_v = collar[2].y - hem[2].y
angle_deg = math.degrees(math.atan2(d_vert_v, d_vert_u))
print(f"Vertical vector (Hem->Collar) in UV: dU={d_vert_u:.4f}, dV={d_vert_v:.4f}, angle={angle_deg:.1f}°")

# Check horizontal vector
d_horiz_u = right_ch[2].x - left_ch[2].x
d_horiz_v = right_ch[2].y - left_ch[2].y
print(f"Horizontal vector (Left->Right) in UV: dU={d_horiz_u:.4f}, dV={d_horiz_v:.4f}")
