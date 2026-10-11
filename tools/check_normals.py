import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"public\models\shirt_woman_draco.glb")
o = [obj for obj in bpy.context.scene.collection.objects if obj.type == 'MESH'][0]

print("Mesh name:", o.name)
print("Verts:", len(o.data.vertices), "Polys:", len(o.data.polygons))

# Check polygon normals on the back of the shirt (at center X=0, Y > 0.1, Z around 0.3)
back_polys = []
for p in o.data.polygons:
    if abs(p.center.x) < 0.05 and p.center.y > 0.05 and 0.1 < p.center.z < 0.4:
        back_polys.append(p)

print(f"Found {len(back_polys)} back torso polygons")
if back_polys:
    normals_y = [p.normal.y for p in back_polys]
    print("Normal Y range on back:", min(normals_y), "to", max(normals_y))
    # Count how many have normal.y < 0 (pointing inward or forward)
    inward = [p for p in back_polys if p.normal.y < 0]
    outward = [p for p in back_polys if p.normal.y > 0]
    print(f"Outward facing (+Y): {len(outward)}, Inward facing (-Y): {len(inward)}")
