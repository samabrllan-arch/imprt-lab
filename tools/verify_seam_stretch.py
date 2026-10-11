import bpy
import bmesh
import math
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_seam_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
o = bpy.context.scene.collection.objects[0]

bm = bmesh.new()
bm.from_mesh(o.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active

planar_ratio_errors = []
fold_faces = 0

for f in bm.faces:
    # Check fold faces on chest
    c = f.calc_center_median()
    if abs(f.normal.x) > 0.5 and f.normal.z < 0.7 and -0.25 < c.z < 0.25 and abs(c.x) < 0.22:
        for l in f.loops:
            e = l.edge
            d3d = (e.verts[0].co - e.verts[1].co).length
            other_l = l.link_loop_next if l.link_loop_next.vert == e.verts[1] else l.link_loop_prev
            duv = (l[uv_lay].uv - other_l[uv_lay].uv).length
            if duv > 1e-6 and d3d > 1e-4:
                planar_ratio_errors.append(d3d / duv)
        fold_faces += 1

print(f"Fold faces analyzed on chest: {fold_faces}")
if planar_ratio_errors:
    avg_r = sum(planar_ratio_errors) / len(planar_ratio_errors)
    max_r = max(planar_ratio_errors)
    min_r = min(planar_ratio_errors)
    print(f"SEAM-UNWRAPPED CHEST RATIO: Min={min_r:.2f}, Avg={avg_r:.2f}, Max={max_r:.2f}, Max/Avg={max_r/avg_r:.2f}x")

bm.free()
