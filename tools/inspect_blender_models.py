import bpy
import os
import math

# Paths
base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
models = {
    "man": os.path.join(base_dir, "public", "models", "shirt_clo_draco.glb"),
    "woman_fitted": os.path.join(base_dir, "public", "models", "shirt_woman_fitted_draco.glb"),
    "woman_meshy": os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")
}

# First, create a test texture image with grid and text so we can clearly see any UV stretching
img_path = os.path.join(base_dir, "tools", "debug_texture.png")

# Let's inspect the models in blender
for name, mpath in models.items():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    try:
        bpy.ops.import_scene.gltf(filepath=mpath)
        objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
        print(f"=== {name} ({mpath}) ===")
        print(f"Mesh objects: {len(objs)}")
        for o in objs:
            print(f"  Obj: {o.name}, verts: {len(o.data.vertices)}, UV layers: {[l.name for l in o.data.uv_layers]}")
            # Check bounding box
            dim = o.dimensions
            print(f"  Dimensions: X={dim.x:.3f}, Y={dim.y:.3f}, Z={dim.z:.3f}")
    except Exception as e:
        print(f"Error loading {name}: {e}")
