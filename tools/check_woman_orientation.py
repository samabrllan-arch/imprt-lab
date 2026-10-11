import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"public\models\shirt_woman_draco.glb")
o = [obj for obj in bpy.context.scene.collection.objects if obj.type == 'MESH'][0]

print("Mesh name:", o.name)
print("Rotation:", o.rotation_euler)
print("Scale:", o.scale)

# Check top vs bottom vertices in Blender
verts = [v.co for v in o.data.vertices]
verts_by_z = sorted(verts, key=lambda v: v.z)

print("Lowest Z vert:", verts_by_z[0])
print("Highest Z vert:", verts_by_z[-1])

# Is the collar at highest Z or lowest Z?
# Collar is narrow in X and Z, hem is wide
lowest_100 = verts_by_z[:100]
highest_100 = verts_by_z[-100:]

avg_width_low = max(v.x for v in lowest_100) - min(v.x for v in lowest_100)
avg_width_high = max(v.x for v in highest_100) - min(v.x for v in highest_100)

print("Width at lowest Z:", avg_width_low)
print("Width at highest Z:", avg_width_high)
