import bpy
import bmesh
import math
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")
tex_path = os.path.join(base_dir, "tools", "bench_tex.png")
out_img = os.path.join(base_dir, "tools", "render_seam_unwrap_test.png")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.scene.collection.objects[0]
bpy.context.view_layer.objects.active = obj

# 1. Clear UVs to clean fabric (0.02, 0.02)
uv_lay = obj.data.uv_layers.active
for poly in obj.data.polygons:
    for l_idx in poly.loop_indices:
        uv_lay.data[l_idx].uv = (0.02, 0.02)

# 2. Select front torso faces
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

front_polys = []
for p in obj.data.polygons:
    c = p.center
    n = p.normal
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    is_sleeve = (abs(c.x) > 0.24 and c.z > 0.12)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.44 and r_xy < 0.15)
    
    if is_exterior and not is_sleeve and not is_collar:
        if c.y < -0.01 or (abs(c.y) <= 0.01 and n.y < 0):
            p.select = True
            front_polys.append(p)

print(f"Unwrapping {len(front_polys)} front faces...")
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# 3. Find orientation and align
# Find top loop (near neck c.x=0, c.z=0.35) and bottom loop (near hem c.x=0, c.z=-0.45)
top_l = None; min_top = 999
bot_l = None; min_bot = 999
chest_l = None; min_chest = 999

for p in front_polys:
    for l_idx in p.loop_indices:
        v = obj.data.vertices[obj.data.loops[l_idx].vertex_index]
        dt = v.co.x**2 + (v.co.z - 0.35)**2
        db = v.co.x**2 + (v.co.z + 0.45)**2
        dc = v.co.x**2 + (v.co.z - 0.05)**2
        if dt < min_top: min_top = dt; top_l = l_idx
        if db < min_bot: min_bot = db; bot_l = l_idx
        if dc < min_chest: min_chest = dc; chest_l = l_idx

uv_top = uv_lay.data[top_l].uv
uv_bot = uv_lay.data[bot_l].uv
uv_chest = uv_lay.data[chest_l].uv

# Angle to make top be up (positive V)
du = uv_top.x - uv_bot.x
dv = uv_top.y - uv_bot.y
rot_angle = math.pi / 2.0 - math.atan2(dv, du)
cos_a = math.cos(rot_angle)
sin_a = math.sin(rot_angle)

# Target center on canvas:
# In Three.js / CanvasTexture (2048x2048):
# Let's target U = 0.27 (550px), V = 0.65 (720px from top)
target_u = 548.0 / 2048.0
target_v = (2048.0 - 720.0) / 2048.0
scale_factor = 0.45 / max(0.01, math.sqrt(du*du + dv*dv))

# Rotate and translate front loop UVs
front_loop_set = set(l for p in front_polys for l in p.loop_indices)
for l in front_loop_set:
    u0 = uv_lay.data[l].uv.x - uv_chest.x
    v0 = uv_lay.data[l].uv.y - uv_chest.y
    ru = u0 * cos_a - v0 * sin_a
    rv = u0 * sin_a + v0 * cos_a
    uv_lay.data[l].uv = (target_u + ru * scale_factor, target_v + rv * scale_factor)

print("Front UV alignment complete.")

# 4. Render with material
mat = bpy.data.materials.new(name="Mat")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
tex_node = mat.node_tree.nodes.new("ShaderNodeTexImage")
tex_node.image = bpy.data.images.load(tex_path)
mat.node_tree.links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
obj.data.materials.clear()
obj.data.materials.append(mat)

# Camera zoomed into right side of chest (where the D was stretching)
cam_data = bpy.data.cameras.new("Cam")
cam_obj = bpy.data.objects.new("Cam", cam_data)
bpy.context.scene.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

cam_obj.location = (0.22, -0.65, 0.05)
cam_obj.rotation_euler = (math.radians(82), 0, math.radians(20))

light_data = bpy.data.lights.new(name="Sun", type='SUN')
light_data.energy = 4.0
light_obj = bpy.data.objects.new(name="Sun", object_data=light_data)
bpy.context.scene.collection.objects.link(light_obj)
light_obj.location = (1, -2, 2)

bpy.context.scene.render.resolution_x = 800
bpy.context.scene.render.resolution_y = 800
bpy.context.scene.render.filepath = out_img
bpy.ops.render.render(write_still=True)
print(f"Render saved to {out_img}")
