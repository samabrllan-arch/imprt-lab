import bpy
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
for name in ["shirt_woman_draco.glb", "shirt_woman_opt.glb", "shirt_woman.glb"]:
    p = os.path.join(base_dir, "public", "models", name)
    if os.path.exists(p):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=p)
        objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
        print(f"=== {name} ===")
        print(f"Mesh objects: {len(objs)}")
        for o in objs:
            print(f"  {o.name}: {len(o.data.vertices)} verts, {len(o.data.polygons)} faces")
            print(f"  Bounds: X=[{min(v.co.x for v in o.data.vertices):.3f}, {max(v.co.x for v in o.data.vertices):.3f}]")
            print(f"          Y=[{min(v.co.y for v in o.data.vertices):.3f}, {max(v.co.y for v in o.data.vertices):.3f}]")
            print(f"          Z=[{min(v.co.z for v in o.data.vertices):.3f}, {max(v.co.z for v in o.data.vertices):.3f}]")
            if o.data.uv_layers:
                print(f"  UV layers: {[l.name for l in o.data.uv_layers]}")
