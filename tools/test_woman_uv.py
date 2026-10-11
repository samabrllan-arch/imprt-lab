import bpy
import math
import os

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"
out_dir = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection"
os.makedirs(out_dir, exist_ok=True)

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

# Decimate slightly to ~120k polys for crisp 60fps performance and fast Draco loading
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0002)
bpy.ops.object.mode_set(mode='OBJECT')

mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
mod.ratio = 0.35
bpy.ops.object.modifier_apply(modifier="Decimate")

# Center object at (0, 0, 0)
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
print(f"Woman Shirt Dimensions: W={width:.3f}, H={height:.3f}, D={depth:.3f}")

# Target coordinates on 2048x2048 canvas:
# Front center: Canvas X=548, Y=720 -> U=0.2676, V = 1.0 - 720/2048 = 0.6484
# Back center:  Canvas X=1536, Y=720 -> U=0.7500, V = 1.0 - 720/2048 = 0.6484
# Chest height in model: around Z = +0.28 (where chest/pectoral is)

target_front_u = 548.0 / 2048.0
target_back_u = 1536.0 / 2048.0
target_v = 1.0 - (720.0 / 2048.0) # 0.6484

# Ensure UV layer exists
if not obj.data.uv_layers:
    obj.data.uv_layers.new(name="UVMap")
uv_layer = obj.data.uv_layers.active

# Project UVs manually per-polygon-loop based on normal
# Scale factor so torso width in UV is approx 0.40
# Torso width in model is ~0.90, so scale_x ≈ 0.40 / 0.90 ≈ 0.444
# Height in model is 1.90, so scale_z ≈ 0.80 / 1.90 ≈ 0.421

scale_u = 0.26  # horizontal spread
scale_v = 0.44  # vertical spread
chest_z = 0.28  # vertical anchor of the chest center

for poly in obj.data.polygons:
    # Determine if face belongs to front or back based on normal and center
    # Normal.y < 0 faces front (-Y direction)
    is_front = (poly.normal.y < 0)
    
    # Smooth seam bias based on polygon center Y
    if abs(poly.normal.y) < 0.2:
        is_front = (poly.center.y <= 0)

    for l_idx in poly.loop_indices:
        v_idx = obj.data.loops[l_idx].vertex_index
        v = obj.data.vertices[v_idx].co
        
        # Calculate normalized vertical V (same for front and back)
        v_coord = target_v + (v.z - chest_z) * (scale_v / (height / 2.0))
        
        if is_front:
            # Front: looking from -Y, X is to the right
            u_coord = target_front_u + (v.x / (width / 2.0)) * scale_u
        else:
            # Back: looking from +Y, -X is to the right
            u_coord = target_back_u - (v.x / (width / 2.0)) * scale_u
            
        uv_layer.data[l_idx].uv = (u_coord, v_coord)

print("UV unwrap complete! Verifying UV ranges:")
uvs = [uv_layer.data[l].uv for l in range(len(uv_layer.data))]
print(f"U in [{min(u.x for u in uvs):.3f}, {max(u.x for u in uvs):.3f}]")
print(f"V in [{min(u.y for u in uvs):.3f}, {max(u.y for u in uvs):.3f}]")

# Export test GLB
test_glb = os.path.join(out_dir, "test_woman_mapped.glb")
bpy.ops.export_scene.gltf(filepath=test_glb, export_format='GLB')
print("Exported test GLB:", test_glb)
