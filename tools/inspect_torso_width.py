import bpy
import bmesh
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.scene.collection.objects[0]

# Inspect X span at different Z levels (waist, chest, armpits, shoulders)
for z_val in [-0.4, -0.2, 0.0, 0.1, 0.2, 0.3, 0.4]:
    verts = [v for v in obj.data.vertices if abs(v.co.z - z_val) < 0.02 and v.co.y < 0]
    if verts:
        xs = [v.co.x for v in verts]
        print(f"Z={z_val:+.2f} (Front): X in [{min(xs):.3f}, {max(xs):.3f}], Width={max(xs)-min(xs):.3f}")

# Armpits are typically where the torso narrows before sleeves flare out at Z in [0.05, 0.25]
