import bpy
import math
import os

out_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models"

targets = [
    (r"C:\Users\samab\Downloads\meshy_model_1790817328271.glb", "shirt_man_draco.glb", "shirt_man_opt.glb"),
    (r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb", "shirt_woman_draco.glb", "shirt_woman_opt.glb"),
]

for src_path, draco_name, opt_name in targets:
    print(f"\nProcessing {src_path}...")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=src_path)

    meshes = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
    if not meshes:
        continue

    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    obj = bpy.context.active_object

    # Clean duplicates
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=0.0002)
    bpy.ops.object.mode_set(mode='OBJECT')

    # Decimate to 35% ratio (retains crisp folds, reduces from ~400k to ~140k tris)
    orig_poly = len(obj.data.polygons)
    mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
    mod.ratio = 0.35
    bpy.ops.object.modifier_apply(modifier="Decimate")
    print(f"Polys: {orig_poly} -> {len(obj.data.polygons)}")

    # Center object at (0, 0, 0)
    all_verts = [v.co for v in obj.data.vertices]
    min_x, max_x = min([v.x for v in all_verts]), max([v.x for v in all_verts])
    min_y, max_y = min([v.y for v in all_verts]), max([v.y for v in all_verts])
    min_z, max_z = min([v.z for v in all_verts]), max([v.z for v in all_verts])

    cx = (min_x + max_x) / 2.0
    cy = (min_y + max_y) / 2.0
    cz = (min_z + max_z) / 2.0
    for v in obj.data.vertices:
        v.co.x -= cx
        v.co.y -= cy
        v.co.z -= cz

    # Normalize height to 1.0 (Z is height)
    h = max_z - min_z
    scale_f = 1.0 / h
    for v in obj.data.vertices:
        v.co.x *= scale_f
        v.co.y *= scale_f
        v.co.z *= scale_f

    # Create / replace UV map matching the Atelier UV pattern:
    # Front Center: U=0.257, V=0.648
    # Back Center : U=0.750, V=0.648
    if not obj.data.uv_layers:
        uv_layer = obj.data.uv_layers.new(name="UVMap")
    else:
        uv_layer = obj.data.uv_layers.active
        uv_layer.name = "UVMap"

    mesh = obj.data
    uv_data = uv_layer.data

    # Map each polygon loop to UV
    for poly in mesh.polygons:
        # Check normal Y (in this orientation, Y is depth: front vs back)
        is_front = poly.normal.y < 0
        for loop_idx in poly.loop_indices:
            v_idx = mesh.loops[loop_idx].vertex_index
            vx = mesh.vertices[v_idx].co.x
            vz = mesh.vertices[v_idx].co.z # height [-0.5, 0.5]

            if is_front:
                # Front island centered at U=0.257, V=0.648
                u = 0.257 + vx * 0.45
                v = 0.648 + vz * 0.45
            else:
                # Back island centered at U=0.750, V=0.648 (mirrored X)
                u = 0.750 - vx * 0.45
                v = 0.648 + vz * 0.45

            uv_data[loop_idx].uv = (u, v)

    # Export Draco
    draco_path = os.path.join(out_dir, draco_name)
    bpy.ops.export_scene.gltf(
        filepath=draco_path,
        export_format='GLB',
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7
    )
    print(f"Exported Draco GLB: {draco_path} ({os.path.getsize(draco_path)/(1024*1024):.2f} MB)")

    # Export Standard
    opt_path = os.path.join(out_dir, opt_name)
    bpy.ops.export_scene.gltf(
        filepath=opt_path,
        export_format='GLB',
        use_selection=True
    )
    print(f"Exported Opt GLB: {opt_path} ({os.path.getsize(opt_path)/(1024*1024):.2f} MB)")

print("FINISHED UV MAPPING AND COMPRESSING BOTH MODELS")
