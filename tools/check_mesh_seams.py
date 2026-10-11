import bpy
import bmesh
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.scene.collection.objects[0]

bm = bmesh.new()
bm.from_mesh(obj.data)

seam_edges = [e for e in bm.edges if e.seam]
sharp_edges = [e for e in bm.edges if not e.smooth]
print(f"Total edges: {len(bm.edges)}")
print(f"Seam edges: {len(seam_edges)}")
print(f"Sharp edges: {len(sharp_edges)}")
print(f"Vertex groups: {len(obj.vertex_groups)}")
bm.free()
