import bpy
import os

for model_name in ['shirt_man_draco.glb', 'shirt_clo_draco.glb', 'shirt_woman_draco.glb']:
    p = os.path.join(r'C:\Users\samab\OneDrive\Documentos\Camisas\public\models', model_name)
    if not os.path.exists(p): continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=p)
    meshes = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
    if not meshes: continue
    obj = meshes[0]
    mesh = obj.data
    uv_layer = mesh.uv_layers.active
    if not uv_layer:
        print(model_name, 'No UV layer')
        continue
    uv_data = uv_layer.data
    center_u_vals = []
    for poly in mesh.polygons:
        # Front faces
        is_front = poly.normal.y < -0.2 or poly.normal.z > 0.2
        if is_front:
            for l_idx in poly.loop_indices:
                v_idx = mesh.loops[l_idx].vertex_index
                vx = mesh.vertices[v_idx].co.x
                if abs(vx) < 0.005:
                    u, v = uv_data[l_idx].uv
                    center_u_vals.append(u)
    if center_u_vals:
        avg_u = sum(center_u_vals) / len(center_u_vals)
        print(f"{model_name}: Center line X=0 has avg U={avg_u:.4f} (Canvas X={avg_u * 2048:.1f}px)")
