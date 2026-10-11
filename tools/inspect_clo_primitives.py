import bpy

glb_p = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_p)

# Inspect all mesh objects
for o in bpy.context.scene.collection.objects:
    if o.type == 'MESH':
        uv_layer = o.data.uv_layers.active
        if not uv_layer:
            continue
        print(f"\nMesh: {o.name} ({len(o.data.vertices)} verts, {len(o.data.polygons)} polys)")
        # Check bounding box in 3D
        verts = [o.matrix_world @ v.co for v in o.data.vertices]
        min_x, max_x = min(v.x for v in verts), max(v.x for v in verts)
        min_y, max_y = min(v.y for v in verts), max(v.y for v in verts)
        min_z, max_z = min(v.z for v in verts), max(v.z for v in verts)
        print(f"  3D Box: X=[{min_x:.3f}, {max_x:.3f}], Y=[{min_y:.3f}, {max_y:.3f}], Z=[{min_z:.3f}, {max_z:.3f}]")
        
        # Check UV range
        uvs = [uv_layer.data[l].uv for l in range(len(uv_layer.data))]
        min_u, max_u = min(uv.x for uv in uvs), max(uv.x for uv in uvs)
        min_v, max_v = min(uv.y for uv in uvs), max(uv.y for uv in uvs)
        avg_u, avg_v = sum(uv.x for uv in uvs)/len(uvs), sum(uv.y for uv in uvs)/len(uvs)
        print(f"  UV Box: U=[{min_u:.3f}, {max_u:.3f}] avg={avg_u:.3f}, V=[{min_v:.3f}, {max_v:.3f}] avg={avg_v:.3f}")
