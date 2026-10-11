import bpy
import os

glb_p = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_draco.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_p)

print("\n--- SHIRT WOMAN DRACO UV ANALYSIS ---")
for o in bpy.context.scene.collection.objects:
    if o.type == 'MESH':
        uv_layer = o.data.uv_layers.active
        print(f"Object {o.name}: {len(o.data.vertices)} verts, {len(o.data.polygons)} polys")
        
        # Check where chest vertices (Z > 0.0, Y < -0.05) map to in UV space!
        chest_uvs = []
        back_uvs = []
        for poly in o.data.polygons:
            poly_center = poly.center
            if poly.normal.y < -0.4 and poly_center.z > 0.05:
                for l_idx in poly.loop_indices:
                    chest_uvs.append(uv_layer.data[l_idx].uv)
            elif poly.normal.y > 0.4 and poly_center.z > 0.05:
                for l_idx in poly.loop_indices:
                    back_uvs.append(uv_layer.data[l_idx].uv)
                    
        if chest_uvs:
            us = [uv.x for uv in chest_uvs]
            vs = [uv.y for uv in chest_uvs]
            print(f"  CHEST UV: U in [{min(us):.4f}, {max(us):.4f}] avg={sum(us)/len(us):.4f}")
            print(f"            V in [{min(vs):.4f}, {max(vs):.4f}] avg={sum(vs)/len(vs):.4f}")
        if back_uvs:
            us = [uv.x for uv in back_uvs]
            vs = [uv.y for uv in back_uvs]
            print(f"  BACK UV:  U in [{min(us):.4f}, {max(us):.4f}] avg={sum(us)/len(us):.4f}")
            print(f"            V in [{min(vs):.4f}, {max(vs):.4f}] avg={sum(vs)/len(vs):.4f}")

