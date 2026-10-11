import bpy
import math
import os

tex_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection\test_woman_tex.png"
glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_opt.glb"
out_render = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection\test_woman_render.png"

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.film_transparent = True

bpy.ops.import_scene.gltf(filepath=glb_path)
objs = [o for o in scene.collection.objects if o.type == 'MESH']

# Center
all_verts = [o.matrix_world @ v.co for o in objs for v in o.data.vertices]
min_x, max_x = min(v.x for v in all_verts), max(v.x for v in all_verts)
min_y, max_y = min(v.y for v in all_verts), max(v.y for v in all_verts)
min_z, max_z = min(v.z for v in all_verts), max(v.z for v in all_verts)

cx = (min_x + max_x) / 2.0
cy = (min_y + max_y) / 2.0
cz = (min_z + max_z) / 2.0

for o in objs:
    o.location.x -= cx
    o.location.y -= cy
    o.location.z -= cz

# Camera
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 55
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

height = max_z - min_z
width = max_x - min_x
dist = max(width, height) * 1.55
cam.location = (0, -dist, 0.0)
cam.rotation_euler = (math.radians(90), 0, 0)

# Light
light_data = bpy.data.lights.new(name="Light", type='AREA')
light_data.energy = 250
light_data.size = 2.0
light_obj = bpy.data.objects.new("Light", light_data)
scene.collection.objects.link(light_obj)
light_obj.location = (0.5, -dist * 0.8, 1.0)
light_obj.rotation_euler = (math.radians(60), 0, math.radians(20))

# Fill light
fill_data = bpy.data.lights.new(name="FillLight", type='AREA')
fill_data.energy = 100
fill_data.size = 3.0
fill_obj = bpy.data.objects.new("FillLight", fill_data)
scene.collection.objects.link(fill_obj)
fill_obj.location = (-0.5, -dist * 0.8, 0.5)
fill_obj.rotation_euler = (math.radians(60), 0, math.radians(-20))

# Material with texture
mat = bpy.data.materials.new(name="ShirtMat")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get('Principled BSDF')

tex_node = mat.node_tree.nodes.new('ShaderNodeTexImage')
tex_node.image = bpy.data.images.load(tex_path)
mat.node_tree.links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])

for o in objs:
    o.data.materials.clear()
    o.data.materials.append(mat)

scene.render.filepath = out_render
bpy.ops.render.render(write_still=True)
print(f"Rendered test woman decal to: {out_render}")
