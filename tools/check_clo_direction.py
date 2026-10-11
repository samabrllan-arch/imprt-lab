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
            z = o.data.vertices[v_idx].co.z
            uv = uv_layer.data[l_idx].uv
            front_verts.append((z, uv.x, uv.y))

front_verts.sort(key=lambda p: p[0])
print("\n=== CLO UV VERTICAL DIRECTION ===")
print("Lowest Z (hem):    z =", front_verts[0][0], " -> U =", front_verts[0][1], ", V =", front_verts[0][2])
mid = front_verts[len(front_verts)//2]
print("Mid Z (torso):     z =", mid[0], " -> U =", mid[1], ", V =", mid[2])
chest = front_verts[int(len(front_verts)*0.80)]
print("Chest Z:           z =", chest[0], " -> U =", chest[1], ", V =", chest[2])
top = front_verts[-1]
print("Highest Z (collar): z =", top[0], " -> U =", top[1], ", V =", top[2])
print("=================================\n")
