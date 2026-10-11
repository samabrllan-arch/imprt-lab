import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"public\models\shirt_clo_draco.glb")
o = [obj for obj in bpy.context.scene.collection.objects if obj.type == 'MESH'][0]
uv_layer = o.data.uv_layers.active

front_verts = []
for poly in o.data.polygons:
    if poly.normal.y < -0.4:
        for l_idx in poly.loop_indices:
            v_idx = o.data.loops[l_idx].vertex_index
            v = o.data.vertices[v_idx].co
            uv = uv_layer.data[l_idx].uv
            # Chest area: Z between 0.55 and 0.65
            if 0.55 < v.z < 0.65:
                front_verts.append((v.x, v.y, v.z, uv.x, uv.y))

# Sort by X
front_verts.sort(key=lambda p: p[0])
print("\n=== CLO FRONT U vs X ===")
print("Most negative X (user's left / model's right): x =", front_verts[0][0], "-> U =", front_verts[0][3], ", V =", front_verts[0][4])
mid = front_verts[len(front_verts)//2]
print("Center X:                                     x =", mid[0], "-> U =", mid[3], ", V =", mid[4])
print("Most positive X (user's right / model's left): x =", front_verts[-1][0], "-> U =", front_verts[-1][3], ", V =", front_verts[-1][4])
print("========================\n")
