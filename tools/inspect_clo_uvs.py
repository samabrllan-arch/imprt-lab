import bpy
import os

glb_clo = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_clo)

print("\n--- CLO3D SHIRT UV ANALYSIS ---")
for o in bpy.context.scene.collection.objects:
    if o.type == 'MESH':
        uv_layer = o.data.uv_layers.active
        if uv_layer:
            print(f"\nObject {o.name}: {len(o.data.vertices)} vertices, {len(o.data.polygons)} polygons")
            
            front_uvs = []
            back_uvs = []
            chest_uvs = []
            
            for poly in o.data.polygons:
                # normal.y < -0.5 is front
                if poly.normal.y < -0.4:
                    for loop_idx in poly.loop_indices:
                        uv = uv_layer.data[loop_idx].uv
                        front_uvs.append(uv)
                        # Check chest area: Z between 0.1 and 0.5 (upper torso)
                        vert_z = o.data.vertices[o.data.loops[loop_idx].vertex_index].co.z
                        if 0.05 < vert_z < 0.40:
                            chest_uvs.append(uv)
                elif poly.normal.y > 0.4:
                    for loop_idx in poly.loop_indices:
                        back_uvs.append(uv_layer.data[loop_idx].uv)
            
            if front_uvs:
                u_coords = [uv.x for uv in front_uvs]
                v_coords = [uv.y for uv in front_uvs]
                print(f"  ALL FRONT: U in [{min(u_coords):.3f}, {max(u_coords):.3f}] avg={sum(u_coords)/len(u_coords):.3f}")
                print(f"             V in [{min(v_coords):.3f}, {max(v_coords):.3f}] avg={sum(v_coords)/len(v_coords):.3f}")
            if chest_uvs:
                u_coords = [uv.x for uv in chest_uvs]
                v_coords = [uv.y for uv in chest_uvs]
                print(f"  CHEST:     U in [{min(u_coords):.3f}, {max(u_coords):.3f}] center=({(min(u_coords)+max(u_coords))/2:.3f}, {(min(v_coords)+max(v_coords))/2:.3f})")
                print(f"             V in [{min(v_coords):.3f}, {max(v_coords):.3f}]")
            if back_uvs:
                u_coords = [uv.x for uv in back_uvs]
                v_coords = [uv.y for uv in back_uvs]
                print(f"  ALL BACK:  U in [{min(u_coords):.3f}, {max(u_coords):.3f}] avg={sum(u_coords)/len(u_coords):.3f}")
                print(f"             V in [{min(v_coords):.3f}, {max(v_coords):.3f}] avg={sum(v_coords)/len(v_coords):.3f}")

print("\n--- ANALYSIS COMPLETED ---")
