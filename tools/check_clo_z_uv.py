import bpy

glb_p = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_draco.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_p)

# Find front chest vertices
front_points = []
back_points = []

for o in bpy.context.scene.collection.objects:
    if o.type == 'MESH':
        uv_layer = o.data.uv_layers.active
        if not uv_layer:
            continue
        for poly in o.data.polygons:
            if poly.normal.y < -0.4:
                for l_idx in poly.loop_indices:
                    v_idx = o.data.loops[l_idx].vertex_index
                    co = o.matrix_world @ o.data.vertices[v_idx].co
                    uv = uv_layer.data[l_idx].uv
                    front_points.append((co.x, co.y, co.z, uv.x, uv.y))
            elif poly.normal.y > 0.4:
                for l_idx in poly.loop_indices:
                    v_idx = o.data.loops[l_idx].vertex_index
                    co = o.matrix_world @ o.data.vertices[v_idx].co
                    uv = uv_layer.data[l_idx].uv
                    back_points.append((co.x, co.y, co.z, uv.x, uv.y))

# Filter chest: around center X in [-0.05, 0.05]
chest = [p for p in front_points if abs(p[0]) < 0.05]
chest.sort(key=lambda p: p[2])

back_mid = [p for p in back_points if abs(p[0]) < 0.05]
back_mid.sort(key=lambda p: p[2])

print(f"CLO Front mid points: {len(chest)}")
if chest:
    print("Lowest front (hem):", chest[0])
    print("Mid torso front:   ", chest[len(chest)//2])
    print("Chest front:       ", chest[int(len(chest)*0.75)])
    print("Collar front:      ", chest[-1])

print(f"\nCLO Back mid points: {len(back_mid)}")
if back_mid:
    print("Lowest back (hem): ", back_mid[0])
    print("Mid back:          ", back_mid[len(back_mid)//2])
    print("Upper back:        ", back_mid[int(len(back_mid)*0.75)])
    print("Collar back:       ", back_mid[-1])
