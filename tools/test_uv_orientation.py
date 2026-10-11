import bpy

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_opt.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)

obj = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH'][0]
uv_layer = obj.data.uv_layers.active

# Let's check front vertices near chest: y < 0, z around chest
chest_polys = [p for p in obj.data.polygons if p.center.y < -0.05 and abs(p.center.z) < 0.2]
print(f"Total chest polys: {len(chest_polys)}")

# Check correlation between vertex X and UV U
x_and_u = []
z_and_v = []
for p in chest_polys[:100]:
    for l_idx in p.loop_indices:
        v_idx = obj.data.loops[l_idx].vertex_index
        co = obj.data.vertices[v_idx].co
        uv = uv_layer.data[l_idx].uv
        x_and_u.append((co.x, uv.x))
        z_and_v.append((co.z, uv.y))

# Check correlation
sorted_by_x = sorted(x_and_u, key=lambda item: item[0])
left_uv_u = sum(item[1] for item in sorted_by_x[:20]) / 20.0
right_uv_u = sum(item[1] for item in sorted_by_x[-20:]) / 20.0

sorted_by_z = sorted(z_and_v, key=lambda item: item[0])
bottom_uv_v = sum(item[1] for item in sorted_by_z[:20]) / 20.0
top_uv_v = sum(item[1] for item in sorted_by_z[-20:]) / 20.0

print(f"Mesh X min (left) UV U: {left_uv_u:.4f} -> Mesh X max (right) UV U: {right_uv_u:.4f}")
print(f"Mesh Z min (bottom) UV V: {bottom_uv_v:.4f} -> Mesh Z max (top) UV V: {top_uv_v:.4f}")

u_direction = "INCREASING (normal)" if right_uv_u > left_uv_u else "DECREASING (mirrored)"
v_direction = "INCREASING" if top_uv_v > bottom_uv_v else "DECREASING"
print(f"U direction: {u_direction}, V direction: {v_direction}")
