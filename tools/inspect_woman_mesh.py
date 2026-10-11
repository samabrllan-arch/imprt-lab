import bpy
import math
import os

src_path = r"C:\Users\samab\Downloads\meshy_model_1790817952206.glb"
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
print(f"Woman raw mesh: {len(obj.data.vertices)} verts, {len(obj.data.polygons)} polys")

# Clean duplicate vertices
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0002)
bpy.ops.object.mode_set(mode='OBJECT')

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
depth = max_y - min_y
height = max_z - min_z
print(f"Centered: Width={width:.3f}, Depth={depth:.3f}, Height={height:.3f}")
print(f"X in [{-width/2:.3f}, {width/2:.3f}], Z in [{-height/2:.3f}, {height/2:.3f}], Y in [{-depth/2:.3f}, {depth/2:.3f}]")
