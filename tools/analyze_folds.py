import bpy
import math

glb_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_woman_opt.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH'][0]

# Exterior front vertices near chest z in [-0.02, 0.12], y < -0.15
verts = []
for v in obj.data.vertices:
    if abs(v.co.z - 0.05) < 0.03 and v.co.y < -0.15:
        verts.append(v.co)

# Sort by X
verts.sort(key=lambda c: c.x)
print(f"Total slice vertices: {len(verts)}")
print(f"X range: {verts[0].x:.3f} to {verts[-1].x:.3f}")

# Compute Euclidean distance vs arc-length along sorted vertices
total_arc = 0.0
arc_lengths = [0.0]
for i in range(1, len(verts)):
    dx = verts[i].x - verts[i-1].x
    dy = verts[i].y - verts[i-1].y
    dz = verts[i].z - verts[i-1].z
    d = math.sqrt(dx*dx + dy*dy + dz*dz)
    total_arc += d
    arc_lengths.append(total_arc)

print(f"X span: {verts[-1].x - verts[0].x:.3f}, Arc length along slice: {total_arc:.3f}")
ratio = total_arc / (verts[-1].x - verts[0].x)
print(f"Arc/X ratio: {ratio:.3f}")
