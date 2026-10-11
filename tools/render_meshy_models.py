import bpy
import os
import math

models = [
    (r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb", "model_1790817952206"),
    (r"C:\Users\samab\Downloads\meshy_model_1790817568058.glb", "model_1790817568058"),
    (r"C:\Users\samab\Downloads\meshy_model_1790817328271.glb", "model_1790817328271"),
]

out_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"
os.makedirs(out_dir, exist_ok=True)

def setup_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 800
    scene.render.resolution_y = 800
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'

    # Camera
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 65
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj
    cam_obj.location = (0, -2.8, 0.1)
    cam_obj.rotation_euler = (math.radians(88), 0, 0)

    # Lighting
    # Key light
    key_light = bpy.data.lights.new(name="KeyLight", type='AREA')
    key_light.energy = 450
    key_light.size = 2.0
    key_obj = bpy.data.objects.new(name="KeyLight", object_data=key_light)
    scene.collection.objects.link(key_obj)
    key_obj.location = (1.5, -2.2, 1.8)
    key_obj.rotation_euler = (math.radians(55), 0, math.radians(35))

    # Fill light
    fill_light = bpy.data.lights.new(name="FillLight", type='AREA')
    fill_light.energy = 220
    fill_light.size = 2.5
    fill_obj = bpy.data.objects.new(name="FillLight", object_data=fill_light)
    scene.collection.objects.link(fill_obj)
    fill_obj.location = (-1.8, -1.8, 1.2)
    fill_obj.rotation_euler = (math.radians(50), 0, math.radians(-45))

    # Rim light
    rim_light = bpy.data.lights.new(name="RimLight", type='POINT')
    rim_light.energy = 300
    rim_obj = bpy.data.objects.new(name="RimLight", object_data=rim_light)
    scene.collection.objects.link(rim_obj)
    rim_obj.location = (0, 1.8, 1.5)

    return scene, cam_obj

def render_model(glb_path, name):
    scene, cam_obj = setup_scene()
    
    # Import GLB
    bpy.ops.import_scene.gltf(filepath=glb_path)
    
    # Get imported objects
    imported_objs = [obj for obj in scene.collection.objects if obj.type == 'MESH']
    if not imported_objs:
        print(f"No mesh found in {glb_path}")
        return

    # Create dark luxury material for visibility if not assigned or unshaded
    mat = bpy.data.materials.new(name="DarkGarment")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.08, 0.08, 0.09, 1.0)
        bsdf.inputs['Roughness'].default_value = 0.85

    for obj in imported_objs:
        obj.data.materials.clear()
        obj.data.materials.append(mat)

    # Calculate bounding box & center
    min_z = min([obj.location.z + min([v.co.z for v in obj.data.vertices]) for obj in imported_objs])
    max_z = max([obj.location.z + max([v.co.z for v in obj.data.vertices]) for obj in imported_objs])
    mid_z = (min_z + max_z) / 2.0

    min_y = min([obj.location.y + min([v.co.y for v in obj.data.vertices]) for obj in imported_objs])
    max_y = max([obj.location.y + max([v.co.y for v in obj.data.vertices]) for obj in imported_objs])
    mid_y = (min_y + max_y) / 2.0

    for obj in imported_objs:
        obj.location.z -= mid_z
        obj.location.y -= mid_y

    # Front render
    scene.render.filepath = os.path.join(out_dir, f"{name}_front.png")
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {scene.render.filepath}")

    # Slight angle render
    cam_obj.location = (0.9, -2.5, 0.3)
    cam_obj.rotation_euler = (math.radians(85), 0, math.radians(20))
    scene.render.filepath = os.path.join(out_dir, f"{name}_angle.png")
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {scene.render.filepath}")

for glb_path, name in models:
    if os.path.exists(glb_path):
        print(f"Rendering {name}...")
        render_model(glb_path, name)
    else:
        print(f"File not found: {glb_path}")

print("ALL RENDERS COMPLETED SUCCESSFULLY")
