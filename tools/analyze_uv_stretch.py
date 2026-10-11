import bpy
import bmesh
import math
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"

def analyze_mesh_uvs(model_name, rel_path):
    print(f"\n=======================================================")
    print(f"ANALYZING: {model_name} ({rel_path})")
    print(f"=======================================================")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    glb_path = os.path.join(base_dir, rel_path)
    bpy.ops.import_scene.gltf(filepath=glb_path)
    
    mesh_objs = [o for o in bpy.context.scene.collection.objects if o.type == 'MESH']
    for o in mesh_objs:
        bm = bmesh.new()
        bm.from_mesh(o.data)
        bm.faces.ensure_lookup_table()
        
        uv_lay = bm.loops.layers.uv.active
        if not uv_lay:
            print(f"  {o.name}: NO ACTIVE UV LAYER")
            bm.free()
            continue
            
        # Find faces on front chest where normal points somewhat sideways (folds!)
        # i.e. normal.z < 0.6 and abs(normal.x) > 0.5 (steep sides of folds)
        # Check ratio of 3D edge length to UV edge length
        planar_ratio_errors = []
        fold_faces = 0
        
        for f in bm.faces:
            # Check if front-facing and in chest region
            # We check face center
            center = f.calc_center_median()
            norm = f.normal
            
            # If normal is steep on X (side of a fold/crease)
            if abs(norm.x) > 0.5 and norm.z < 0.7:
                # Calculate UV width vs 3D width
                # In planar projection: U = X * const.
                # So if normal.x is large (surface goes in depth Z),
                # dU across the edge in 3D is small even though 3D distance is large!
                # That causes huge stretching: 3D distance / UV distance is huge!
                for l in f.loops:
                    e = l.edge
                    v1 = e.verts[0].co
                    v2 = e.verts[1].co
                    d3d = (v1 - v2).length
                    
                    uv1 = l[uv_lay].uv
                    # Find uv of other vert in this face
                    other_l = l.link_loop_next if l.link_loop_next.vert == e.verts[1] else l.link_loop_prev
                    uv2 = other_l[uv_lay].uv
                    duv = (uv1 - uv2).length
                    
                    if duv > 1e-6 and d3d > 1e-4:
                        # Ratio of 3D length to UV length
                        ratio = d3d / duv
                        planar_ratio_errors.append((ratio, norm.x, norm.z, center))
                fold_faces += 1
                
        print(f"  {o.name}: {len(bm.faces)} faces, {fold_faces} fold faces analyzed.")
        if planar_ratio_errors:
            ratios = [p[0] for p in planar_ratio_errors]
            avg_r = sum(ratios) / len(ratios)
            max_r = max(ratios)
            min_r = min(ratios)
            print(f"  UV Stretch Ratio (3D/UV): Min={min_r:.1f}, Avg={avg_r:.1f}, Max={max_r:.1f}, Max/Avg={max_r/avg_r:.1f}x")
            # If Max/Avg is huge (> 10x or 50x), texture stretches massively on folds (laser effect!)
        bm.free()

analyze_mesh_uvs("HOMBRE (CLO3D)", "public/models/shirt_clo_draco.glb")
analyze_mesh_uvs("MUJER OPCION 1 (CLO3D)", "public/models/shirt_woman_fitted_draco.glb")
analyze_mesh_uvs("MUJER MESHY (ACTUAL)", "public/models/shirt_woman_draco.glb")
