import bpy
import math
import os

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"
pub_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models"
insp_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"
os.makedirs(pub_dir, exist_ok=True)
os.makedirs(insp_dir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src_path)

objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for m in objs:
    m.select_set(True)
bpy.context.view_layer.objects.active = objs[0]
if len(objs) > 1:
    bpy.ops.object.join()

obj = bpy.context.active_object

# Clean duplicates
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0002)
bpy.ops.object.mode_set(mode='OBJECT')

# Decimate smoothly for 60fps WebGL
mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
mod.ratio = 0.35
bpy.ops.object.modifier_apply(modifier="Decimate")

# Center at (0, 0, 0)
verts = [v.co for v in obj.data.vertices]
min_x, max_x = min(v.x for v in verts), max(v.x for v in verts)
min_y, max_y = min(v.y for v in verts), max(v.y for v in verts)
min_z, max_z = min(v.z for v in verts), max(v.z for v in verts)

cx = (min_x + max_x) / 2
cy = (min_y + max_y) / 2
cz = (min_z + max_z) / 2

for v in obj.data.vertices:
    v.co.x -= cx
    v.co.y -= cy
    v.co.z -= cz

width = max_x - min_x
height = max_z - min_z
depth = max_y - min_y
print(f"Centered Woman Shirt: W={width:.3f}, H={height:.3f}, D={depth:.3f}")

target_front_u = 548.0 / 2048.0
target_back_u = 1536.0 / 2048.0
target_v = 720.0 / 2048.0

scale_v = 0.38
spread_v = scale_v / (height / 2.0)
scale_u = spread_v * (width / 2.0)
chest_z = 0.27

# Clean fabric area (no decals ever drawn here)
clean_fabric_u = 0.50
clean_fabric_v = 0.05

if not obj.data.uv_layers:
    obj.data.uv_layers.new(name="UVMap")
uv_layer = obj.data.uv_layers.active

for poly in obj.data.polygons:
    outward_xy = (poly.center.x, poly.center.y)
    dot = poly.normal.x * outward_xy[0] + poly.normal.y * outward_xy[1]
    is_exterior = (dot > 0)
    
    if not is_exterior:
        # Interior lining of collar, back and front: MAP TO CLEAN FABRIC ONLY
        for l_idx in poly.loop_indices:
            uv_layer.data[l_idx].uv = (clean_fabric_u, clean_fabric_v)
    else:
        # Exterior surface only:
        is_front = (poly.center.y <= 0)
        for l_idx in poly.loop_indices:
            v_idx = obj.data.loops[l_idx].vertex_index
            v = obj.data.vertices[v_idx].co
            v_coord = target_v + (v.z - chest_z) * (scale_v / (height / 2.0))
            if is_front:
                u_coord = target_front_u + (v.x / (width / 2.0)) * scale_u
            else:
                u_coord = target_back_u - (v.x / (width / 2.0)) * scale_u
            uv_layer.data[l_idx].uv = (u_coord, v_coord)

# Export standard GLB
out_opt = os.path.join(pub_dir, "shirt_woman_opt.glb")
bpy.ops.export_scene.gltf(
    filepath=out_opt,
    export_format='GLB'
)
print("Saved shirt_woman_opt.glb:", os.path.getsize(out_opt))

# Export Draco compressed GLB
out_draco = os.path.join(pub_dir, "shirt_woman_draco.glb")
bpy.ops.export_scene.gltf(
    filepath=out_draco,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12
)
print("Saved shirt_woman_draco.glb:", os.path.getsize(out_draco))

# Render test looking slightly down into the neck (high angle like user's screenshot)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.view_settings.view_transform = 'Standard'
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'

# Test texture with circular decal on front
tex_img = bpy.data.images.new("DecalTestCleanInterior", width=2048, height=2048)
pixels = [0.85, 0.82, 0.76, 1.0] * (2048 * 2048) # Beige fabric like user screenshot

cx_f = 548
cy_f = int(target_v * 2048)
r = 200

for y in range(max(0, cy_f - r), min(2048, cy_f + r)):
    for x in range(max(0, cx_f - r), min(2048, cx_f + r)):
        if (x - cx_f)**2 + (y - cy_f)**2 < r**2:
            idx = (y * 2048 + x) * 4
            pixels[idx] = 0.65
            pixels[idx+1] = 0.10
            pixels[idx+2] = 0.85
            pixels[idx+3] = 1.0

tex_img.pixels = pixels

mat = bpy.data.materials.new(name="Mat")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
tex_node = mat.node_tree.nodes.new("ShaderNodeTexImage")
tex_node.image = tex_img
mat.node_tree.links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
obj.data.materials.clear()
obj.data.materials.append(mat)

cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 50
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

# Position camera looking slightly down into the collar (Z=1.2, Y=-2.8, angle 70 deg)
cam.location = (0, -2.8, 1.2)
cam.rotation_euler = (math.radians(68), 0, 0)

key_l = bpy.data.lights.new(name="K", type='AREA')
key_l.energy = 200
key_o = bpy.data.objects.new("K", key_l)
scene.collection.objects.link(key_o)
key_o.location = (1.5, -2.0, 2.0)

fill_l = bpy.data.lights.new(name="F", type='AREA')
fill_l.energy = 80
fill_o = bpy.data.objects.new("F", fill_l)
scene.collection.objects.link(fill_o)
fill_o.location = (-1.5, -2.0, 1.0)

test_render_file = os.path.join(insp_dir, "test_woman_collar_inside_clean.png")
scene.render.filepath = test_render_file
bpy.ops.render.render(write_still=True)
print("Rendered collar inspection to:", test_render_file)
