import bpy

glb_p = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_draco.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_p)

o = bpy.context.scene.collection.objects[0]
uv_layer = o.data.uv_layers.active

# Let's inspect Z heights and corresponding V coordinates on front (normal.y < -0.4)
front_points = []
for poly in o.data.polygons:
    if poly.normal.y < -0.4:
        for l_idx in poly.loop_indices:
            v_idx = o.data.loops[l_idx].vertex_index
            z = o.data.vertices[v_idx].co.z
            uv = uv_layer.data[l_idx].uv
            front_points.append((z, uv.x, uv.y))

# Sort by Z
front_points.sort(key=lambda p: p[0])
print(f"Total front loop points: {len(front_points)}")
print("Lowest Z (bottom hem):", front_points[0])
print("Middle Z (navel/waist):", front_points[len(front_points)//4])
print("Chest Z (mid torso):", front_points[len(front_points)//2])
print("Upper chest Z (collar):", front_points[-1])
