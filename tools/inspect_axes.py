# Check vertex positions and orientations of shirt_clo_draco.glb
import json

glb_path = r"c:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_draco.glb"

# Let's inspect the OBJ vs GLB
obj_path = r"C:\Users\samab\Downloads\obj\obj_0.obj"

# Sample 5 vertices from obj
with open(obj_path, "r", encoding="utf-8", errors="ignore") as f:
    for i in range(15):
        line = f.readline()
        if line.startswith("v "):
            print("V:", line.strip())
