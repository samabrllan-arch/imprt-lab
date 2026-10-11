import bpy
import bmesh
import math
import os

base_dir = r"c:\Users\samab\OneDrive\Documentos\Camisas"
glb_path = os.path.join(base_dir, "public", "models", "shirt_woman_draco.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.scene.collection.objects[0]
bpy.context.view_layer.objects.active = obj

# Create BMesh
bm = bmesh.new()
bm.from_mesh(obj.data)
bm.faces.ensure_lookup_table()

print(f"Total faces: {len(bm.faces)}")

# 1. Classify faces:
# Exterior vs interior:
# For each face, test if its normal points outward relative to body axis (0, 0, z)
# Body center in XY is roughly (0, 0)
front_faces = []
back_faces = []
other_faces = []

for f in bm.faces:
    c = f.calc_center_median()
    n = f.normal
    
    # Exterior test: dot product of normal with vector from center
    # On cylinder, outward vector is (c.x, c.y)
    outward_dot = n.x * c.x + n.y * c.y
    is_exterior = (outward_dot > -0.04)
    
    # Check if torso (exclude sleeves where |c.x| > 0.26 and z > 0.12)
    is_sleeve = (abs(c.x) > 0.25 and c.z > 0.12)
    
    # Check if neck opening (high Z and small radius)
    r_xy = math.sqrt(c.x*c.x + c.y*c.y)
    is_collar = (c.z > 0.44 and r_xy < 0.15)
    
    if is_exterior and not is_sleeve and not is_collar:
        # Separate front (c.y < 0) vs back (c.y > 0)
        # Add slight margin to avoid seam confusion
        if c.y < -0.01:
            front_faces.append(f)
        elif c.y > 0.01:
            back_faces.append(f)
        else:
            # Lateral boundary: assign based on normal.y
            if n.y < 0:
                front_faces.append(f)
            else:
                back_faces.append(f)
    else:
        other_faces.append(f)

print(f"Front faces: {len(front_faces)}")
print(f"Back faces:  {len(back_faces)}")
print(f"Other faces (sleeves/collar/interior): {len(other_faces)}")

bm.to_mesh(obj.data)
bm.free()

# 2. Select front faces and unwrap
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

for idx, p in enumerate(obj.data.polygons):
    p.select = (idx < len(front_faces)) # just test selection mechanism
    
print("Diagnostic test completed successfully")
