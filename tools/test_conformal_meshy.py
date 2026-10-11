import bpy
import bmesh
import os
import math

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)

objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
o = objs[0]
bpy.context.view_layer.objects.active = o

bm = bmesh.new()
bm.from_mesh(o.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active

# Select front exterior faces
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

front_count = 0
for f in o.data.polygons:
    # Front facing: normal.y < -0.1 and center.y < 0
    if f.normal.y < -0.1 and f.center.y < 0.05 and abs(f.center.x) < 0.35 and f.center.z > -0.4:
        f.select = True
        front_count += 1

print(f"Selected {front_count} front faces for unwrap")

bpy.ops.object.mode_set(mode='EDIT')
# Test Angle-Based unwrap
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.005)
bpy.ops.object.mode_set(mode='OBJECT')

# Now let's test the stretch on the fold faces of these selected faces!
bm = bmesh.new()
bm.from_mesh(o.data)
bm.faces.ensure_lookup_table()
uv_lay = bm.loops.layers.uv.active

ratios = []
for f in bm.faces:
    if f.select and abs(f.normal.x) > 0.5 and f.normal.z < 0.7:
        for l in f.loops:
            e = l.edge
            d3d = (e.verts[0].co - e.verts[1].co).length
            other_l = l.link_loop_next if l.link_loop_next.vert == e.verts[1] else l.link_loop_prev
            duv = (l[uv_lay].uv - other_l[uv_lay].uv).length
            if duv > 1e-6 and d3d > 1e-4:
                ratios.append(d3d / duv)

if ratios:
    avg_r = sum(ratios) / len(ratios)
    max_r = max(ratios)
    print(f"CONFORMAL UNWRAP RESULT:")
    print(f"Ratios: Min={min(ratios):.2f}, Avg={avg_r:.2f}, Max={max_r:.2f}, Max/Avg={max_r/avg_r:.2f}x")
else:
    print("No fold faces in selection")

bm.free()
