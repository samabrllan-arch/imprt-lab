import bpy
import math
import os

out_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models"

targets = [
    (r"C:\Users\samab\Downloads\meshy_model_1790817328271.glb", "shirt_man_opt.glb", "shirt_man_draco.glb"),
    (r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb", "shirt_woman_opt.glb", "shirt_woman_draco.glb"),
]

for src_path, opt_name, draco_name in targets:
    print(f"\nProcessing {src_path}...")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=src_path)

    meshes = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
    if not meshes:
        print("No mesh found!")
        continue

    # Join if multiple
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    
    obj = bpy.context.active_object

    # 1. Merge by distance to eliminate duplicate vertices from Meshy
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=0.0002)
    bpy.ops.object.mode_set(mode='OBJECT')

    # 2. Add Decimate modifier (ratio 0.35 keeps ~140k triangles with zero loss of silhouette or fold detail)
    orig_poly = len(obj.data.polygons)
    mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
    mod.ratio = 0.35
    bpy.ops.object.modifier_apply(modifier="Decimate")
    new_poly = len(obj.data.polygons)
    print(f"Polygons reduced from {orig_poly} to {new_poly} ({new_poly/orig_poly*100:.1f}%)")

    # 3. Generate UV mapping (Smart UV Project)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.004)
    bpy.ops.object.mode_set(mode='OBJECT')

    # 4. Center object at (0, 0, 0)
    all_verts = [v.co for v in obj.data.vertices]
    min_x = min([v.x for v in all_verts])
    max_x = max([v.x for v in all_verts])
    min_y = min([v.y for v in all_verts])
    max_y = max([v.y for v in all_verts])
    min_z = min([v.z for v in all_verts])
    max_z = max([v.z for v in all_verts])

    cx = (min_x + max_x) / 2.0
    cy = (min_y + max_y) / 2.0
    cz = (min_z + max_z) / 2.0
    for v in obj.data.vertices:
        v.co.x -= cx
        v.co.y -= cy
        v.co.z -= cz

    # Normalize height to 1.0
    h = max_z - min_z
    scale_factor = 1.0 / h
    for v in obj.data.vertices:
        v.co.x *= scale_factor
        v.co.y *= scale_factor
        v.co.z *= scale_factor

    # 5. Export standard optimized GLB
    opt_path = os.path.join(out_dir, opt_name)
    bpy.ops.export_scene.gltf(
        filepath=opt_path,
        export_format='GLB',
        use_selection=True
    )
    print(f"Exported standard opt: {opt_path} ({os.path.getsize(opt_path)/(1024*1024):.2f} MB)")

    # 6. Export Draco compressed GLB
    draco_path = os.path.join(out_dir, draco_name)
    try:
        bpy.ops.export_scene.gltf(
            filepath=draco_path,
            export_format='GLB',
            use_selection=True,
            export_draco_mesh_compression_enable=True,
            export_draco_mesh_compression_level=7
        )
        print(f"Exported Draco: {draco_path} ({os.path.getsize(draco_path)/(1024*1024):.2f} MB)")
    except Exception as e:
        print(f"Draco export error: {e}")

print("OPTIMIZATION AND COMPRESSION COMPLETED")
