import bpy

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)

objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
# Center
all_verts = [o.matrix_world @ v.co for o in objs for v in o.data.vertices]
cx = (min(v.x for v in all_verts) + max(v.x for v in all_verts)) / 2.0
cy = (min(v.y for v in all_verts) + max(v.y for v in all_verts)) / 2.0
cz = (min(v.z for v in all_verts) + max(v.z for v in all_verts)) / 2.0

for o in objs:
    o.location.x -= cx
    o.location.y -= cy
    o.location.z -= cz

candidates = []
for o in objs:
    uv_layer = o.data.uv_layers.active
    if not uv_layer: continue
    for p in o.data.polygons:
        # Front chest
        if p.center.y < -0.05:
            for l_idx in p.loop_indices:
                v_idx = o.data.loops[l_idx].vertex_index
                v = o.data.vertices[v_idx]
                dist = (v.co.x)**2 + (v.co.z - 0.05)**2
                candidates.append((dist, v.co, uv_layer.data[l_idx].uv))

candidates.sort(key=lambda it: it[0])
best = candidates[0]
print(f"CLO Man closest to (x=0, z=0.05): co={best[1]}, UV=({best[2].x:.4f}, {best[2].y:.4f})")
print(f"CLO Man UV * 2048: X={best[2].x * 2048:.1f}, Y_blender={best[2].y * 2048:.1f}")

# Also back
back_cands = []
for o in objs:
    uv_layer = o.data.uv_layers.active
    if not uv_layer: continue
    for p in o.data.polygons:
        if p.center.y > 0.05:
            for l_idx in p.loop_indices:
                v_idx = o.data.loops[l_idx].vertex_index
                v = o.data.vertices[v_idx]
                dist = (v.co.x)**2 + (v.co.z - 0.05)**2
                back_cands.append((dist, v.co, uv_layer.data[l_idx].uv))

back_cands.sort(key=lambda it: it[0])
best_b = back_cands[0]
print(f"CLO Man Back closest to (x=0, z=0.05): co={best_b[1]}, UV=({best_b[2].x:.4f}, {best_b[2].y:.4f})")
print(f"CLO Man Back UV * 2048: X={best_b[2].x * 2048:.1f}, Y_blender={best_b[2].y * 2048:.1f}")
