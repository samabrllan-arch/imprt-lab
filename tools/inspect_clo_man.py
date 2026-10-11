import bpy

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_draco.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)

objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
for o in objs:
    uv_layer = o.data.uv_layers.active
    # Find front chest polygons
    polys = [p for p in o.data.polygons if p.center.y < -0.05 and abs(p.center.z) < 0.2]
    if len(polys) > 50:
        print(f"Mesh {o.name}, polys: {len(polys)}")
        x_and_u = []
        z_and_v = []
        for p in polys[:100]:
            for l_idx in p.loop_indices:
                v_idx = o.data.loops[l_idx].vertex_index
                co = o.data.vertices[v_idx].co
                uv = uv_layer.data[l_idx].uv
                x_and_u.append((co.x, uv.x))
                z_and_v.append((co.z, uv.y))
        sorted_x = sorted(x_and_u, key=lambda it: it[0])
        sorted_z = sorted(z_and_v, key=lambda it: it[0])
        print(f"CLO Man X min U: {sorted_x[0][1]:.4f} -> X max U: {sorted_x[-1][1]:.4f}")
        print(f"CLO Man Z min V: {sorted_z[0][1]:.4f} -> Z max V: {sorted_z[-1][1]:.4f}")
