import bpy

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_opt.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH'][0]

uv_layer = obj.data.uv_layers.active

# Find vertices closest to center of chest: x=0, y=min, z=0 (chest level)
min_y = min(v.co.y for v in obj.data.vertices)
print(f"Mesh Y range: {min_y:.3f} to {max(v.co.y for v in obj.data.vertices):.3f}")
print(f"Mesh Z range: {min(v.co.z for v in obj.data.vertices):.3f} to {max(v.co.z for v in obj.data.vertices):.3f}")

# Center chest point: x=0, y near min_y, z around 0.05
candidates = []
for p in obj.data.polygons:
    if p.center.y < -0.10: # exterior front
        for l_idx in p.loop_indices:
            v_idx = obj.data.loops[l_idx].vertex_index
            v = obj.data.vertices[v_idx]
            dist = (v.co.x)**2 + (v.co.z - 0.05)**2
            candidates.append((dist, v.co, uv_layer.data[l_idx].uv))

candidates.sort(key=lambda it: it[0])
best = candidates[0]
print(f"Closest vertex to (x=0, z=0.05): co={best[1]}, UV=({best[2].x:.4f}, {best[2].y:.4f})")
print(f"UV * 2048: X={best[2].x * 2048:.1f}, Y_blender={best[2].y * 2048:.1f}, Y_top={(1.0 - best[2].y) * 2048:.1f}")
