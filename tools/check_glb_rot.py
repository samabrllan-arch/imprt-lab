import json

glb_path = r"c:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_draco.glb"

with open(glb_path, "rb") as f:
    f.read(12)
    chunk_len = int.from_bytes(f.read(4), 'little')
    f.read(4)
    gltf = json.loads(f.read(chunk_len).decode('utf-8'))

for i, node in enumerate(gltf.get('nodes', [])):
    print(f"Node {i}:", node)
