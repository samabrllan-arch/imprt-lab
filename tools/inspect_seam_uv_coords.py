import bpy
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_seam_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
o = bpy.context.scene.collection.objects[0]
uv_lay = o.data.uv_layers.active

# Check UVs of vertices along the front center line (x ~ 0, y < 0)
for z_val in [0.40, 0.30, 0.20, 0.10, 0.0, -0.10, -0.20, -0.30, -0.40]:
    matching = []
    for p in o.data.polygons:
        if abs(p.center.x) < 0.02 and p.center.y < 0 and abs(p.center.z - z_val) < 0.03:
            for l_idx in p.loop_indices:
                uv = uv_lay.data[l_idx].uv
                matching.append((uv.x, uv.y))
    if matching:
        avg_u = sum(m[0] for m in matching) / len(matching)
        avg_v = sum(m[1] for m in matching) / len(matching)
        canvas_x = round(avg_u * 2048)
        canvas_y = round((1.0 - avg_v) * 2048)
        print(f"Z={z_val:+.2f} -> UV=({avg_u:.3f}, {avg_v:.3f}) -> Canvas=({canvas_x}, {canvas_y})")

# Check shoulder vertices (abs(x) > 0.18, z > 0.35, y < 0)
shoulder_uvs = []
for p in o.data.polygons:
    if p.center.z > 0.35 and abs(p.center.x) > 0.15 and p.center.y < 0:
        for l_idx in p.loop_indices:
            uv = uv_lay.data[l_idx].uv
            shoulder_uvs.append((uv.x, uv.y))

if shoulder_uvs:
    u_vals = [s[0] for s in shoulder_uvs]
    v_vals = [s[1] for s in shoulder_uvs]
    print(f"Shoulder UV: U in [{min(u_vals):.3f}, {max(u_vals):.3f}], V in [{min(v_vals):.3f}, {max(v_vals):.3f}]")
    print(f"Shoulder Canvas: X in [{round(min(u_vals)*2048)}, {round(max(u_vals)*2048)}], Y in [{round((1-max(v_vals))*2048)}, {round((1-min(v_vals))*2048)}]")
