import bpy
import math

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"public\models\shirt_woman_draco.glb")
o = [obj for obj in bpy.context.scene.collection.objects if obj.type == 'MESH'][0]

exterior_count = 0
interior_count = 0

for p in o.data.polygons:
    # vector from central spine (0, 0, z) to polygon center
    # XY direction from center of body outwards
    outward_xy = (p.center.x, p.center.y)
    dot = p.normal.x * outward_xy[0] + p.normal.y * outward_xy[1]
    
    if dot > 0:
        exterior_count += 1
    else:
        interior_count += 1

print(f"Total polygons: {len(o.data.polygons)}")
print(f"Exterior polygons: {exterior_count} ({exterior_count/len(o.data.polygons)*100:.1f}%)")
print(f"Interior polygons: {interior_count} ({interior_count/len(o.data.polygons)*100:.1f}%)")
