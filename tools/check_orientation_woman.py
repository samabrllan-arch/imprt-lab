import bpy
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.scene.collection.objects[0]

# Check bust vs back: bust has larger curvature and sticks out forward
front_y_min = min(v.co.y for v in obj.data.vertices)
back_y_max = max(v.co.y for v in obj.data.vertices)
print(f"Y min: {front_y_min:.4f}, Y max: {back_y_max:.4f}")

# Look at normals of faces with Z near 0.1 (chest area)
chest_faces_y_neg = [f for f in obj.data.polygons if f.center.y < -0.05 and abs(f.center.z) < 0.2]
chest_faces_y_pos = [f for f in obj.data.polygons if f.center.y > 0.05 and abs(f.center.z) < 0.2]
print(f"Faces Y < -0.05 (chest): {len(chest_faces_y_neg)}")
print(f"Faces Y > 0.05 (back):  {len(chest_faces_y_pos)}")
