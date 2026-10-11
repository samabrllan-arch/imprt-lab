import bpy
import bmesh
import math
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.scene.collection.objects[0]
bpy.context.view_layer.objects.active = obj

# Mode Edit to clear selection
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

for p in obj.data.polygons:
    c = p.center
    n = p.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    is_sleeve = (abs(c.x) > 0.24 and c.z > 0.12)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.44 and r_xy < 0.15)
    
    if is_exterior and not is_sleeve and not is_collar:
        if c.y < -0.01 or (abs(c.y) <= 0.01 and n.y < 0):
            p.select = True

# Unwrap selected faces with CONFORMAL
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='CONFORMAL', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

bm = bmesh.new()
bm.from_mesh(obj.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active

planar_ratio_errors = []
fold_faces = 0

for f in bm.faces:
    # Check specifically chest region where user saw the D stretch (z in [-0.2, 0.25], x in [-0.2, 0.2])
    c = f.calc_center_median()
    if f.select and -0.2 < c.z < 0.25 and abs(c.x) < 0.2:
        for l in f.loops:
            e = l.edge
            v1 = e.verts[0].co
            v2 = e.verts[1].co
            d3d = (v1 - v2).length
            other_l = l.link_loop_next if l.link_loop_next.vert == e.verts[1] else l.link_loop_prev
            duv = (l[uv_lay].uv - other_l[uv_lay].uv).length
            if duv > 1e-6 and d3d > 1e-4:
                planar_ratio_errors.append(d3d / duv)
        fold_faces += 1

print(f"Analyzed {fold_faces} CHEST faces after CONFORMAL unwrap.")
if planar_ratio_errors:
    avg_r = sum(planar_ratio_errors) / len(planar_ratio_errors)
    max_r = max(planar_ratio_errors)
    min_r = min(planar_ratio_errors)
    print(f"CHEST UV Stretch Ratio: Min={min_r:.2f}, Avg={avg_r:.2f}, Max={max_r:.2f}, Max/Avg={max_r/avg_r:.2f}x")

bm.free()
