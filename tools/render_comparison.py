import bpy
import os
import math

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
tex_path = os.path.join(base_dir, "tools", "bench_tex.png")

def render_model(model_name, glb_rel_path, out_rel_path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Import GLB
    glb_path = os.path.join(base_dir, glb_rel_path)
    bpy.ops.import_scene.gltf(filepath=glb_path)
    
    # Find mesh objects
    objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
    if not objs:
        print(f"No mesh found for {model_name}")
        return

    # Create Material with Texture
    mat = bpy.data.materials.new(name=f"Mat_{model_name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    tex_node = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex_node.image = bpy.data.images.load(tex_path)
    mat.node_tree.links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
    
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mat)
    
    # Calculate bounding box of all meshes
    # Add Camera
    cam_data = bpy.data.cameras.new("Camera")
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    bpy.context.scene.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    
    # Position camera looking at chest from 3/4 angle
    # Scale model to 1.05 height like Three.js
    max_z = max(max(v.co.z for v in o.data.vertices) for o in objs)
    min_z = min(min(v.co.z for v in o.data.vertices) for o in objs)
    height = max_z - min_z
    scale = 1.05 / height
    for o in objs:
        o.scale = (scale, scale, scale)
        bpy.context.view_layer.update()
    
    # Set camera
    cam_obj.location = (0.35, -0.9, 0.55 * scale * height if min_z >= 0 else 0.1)
    cam_obj.rotation_euler = (math.radians(82), 0, math.radians(22))
    
    # Add light
    light_data = bpy.data.lights.new(name="Sun", type='SUN')
    light_data.energy = 3.0
    light_obj = bpy.data.objects.new(name="Sun", object_data=light_data)
    bpy.context.scene.collection.objects.link(light_obj)
    light_obj.location = (1, -2, 2)
    
    # Render settings
    scene = bpy.context.scene
    scene.render.resolution_x = 800
    scene.render.resolution_y = 800
    scene.render.filepath = os.path.join(base_dir, out_rel_path)
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {model_name} to {out_rel_path}")

render_model("man", "public/models/shirt_clo_draco.glb", "tools/render_man.png")
render_model("woman_fitted", "public/models/shirt_woman_fitted_draco.glb", "tools/render_woman_fitted.png")
render_model("woman_meshy", "public/models/shirt_woman_draco.glb", "tools/render_woman_meshy.png")
