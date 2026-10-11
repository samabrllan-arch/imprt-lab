import bpy
import math
import os

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo.glb"
out_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"
os.makedirs(out_dir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.view_settings.view_transform = 'Standard'
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'

bpy.ops.import_scene.gltf(filepath=glb_path)
objs = [o for o in scene.collection.objects if o.type == 'MESH']

all_verts = [o.matrix_world @ v.co for o in objs for v in o.data.vertices]
min_x = min([v.x for v in all_verts])
max_x = max([v.x for v in all_verts])
min_y = min([v.y for v in all_verts])
max_y = max([v.y for v in all_verts])
min_z = min([v.z for v in all_verts])
max_z = max([v.z for v in all_verts])

width = max_x - min_x
height = max_z - min_z
depth = max_y - min_y
print(f"shirt_clo dimensions: Width={width:.3f}, Height={height:.3f}, Depth={depth:.3f}")

center_x = (min_x + max_x) / 2.0
center_y = (min_y + max_y) / 2.0
center_z = (min_z + max_z) / 2.0

for o in objs:
    o.location.x -= center_x
    o.location.y -= center_y
    o.location.z -= center_z

cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 55
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

max_dim = max(width, height)
dist = max_dim * 1.70
cam.location = (0, -dist, 0.0)
cam.rotation_euler = (math.radians(90), 0, 0)

# Studio Lights
key_l = bpy.data.lights.new(name="KeyLight", type='AREA')
key_l.energy = 140
key_l.size = 2.5
key_o = bpy.data.objects.new("KeyLight", key_l)
scene.collection.objects.link(key_o)
key_o.location = (1.5, -dist * 0.7, 1.2)
key_o.rotation_euler = (math.radians(55), 0, math.radians(35))

fill_l = bpy.data.lights.new(name="FillLight", type='AREA')
fill_l.energy = 60
fill_l.size = 3.0
fill_o = bpy.data.objects.new("FillLight", fill_l)
scene.collection.objects.link(fill_o)
fill_o.location = (-1.5, -dist * 0.7, 0.5)
fill_o.rotation_euler = (math.radians(60), 0, math.radians(-35))

rim_l = bpy.data.lights.new(name="RimLight", type='POINT')
rim_l.energy = 90
rim_o = bpy.data.objects.new("RimLight", rim_l)
scene.collection.objects.link(rim_o)
rim_o.location = (0, dist * 0.6, 1.6)

mat = bpy.data.materials.new(name="ShirtMaterial")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Roughness'].default_value = 0.88
bsdf.inputs['Base Color'].default_value = (0.012, 0.012, 0.014, 1.0)

for o in objs:
    o.data.materials.clear()
    o.data.materials.append(mat)

test_out = os.path.join(out_dir, "test_shirt_clo_black.png")
scene.render.filepath = test_out
bpy.ops.render.render(write_still=True)
print("TEST RENDER FINISHED:", test_out)
