import json

glb_path = r"c:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_draco.glb"

with open(glb_path, "rb") as f:
    magic = f.read(4)
    version = int.from_bytes(f.read(4), 'little')
    length = int.from_bytes(f.read(4), 'little')
    chunk_len = int.from_bytes(f.read(4), 'little')
    chunk_type = f.read(4)
    json_bytes = f.read(chunk_len)
    gltf = json.loads(json_bytes.decode('utf-8'))

print("GLTF Nodes:")
for i, node in enumerate(gltf.get('nodes', [])):
    print(f"Node {i}: {node}")

print("GLTF Meshes:")
for i, mesh in enumerate(gltf.get('meshes', [])):
    print(f"Mesh {i}: {mesh.get('name')}, Primitives: {len(mesh.get('primitives', []))}")
