import json

glb_path = r"c:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_draco.glb"

with open(glb_path, "rb") as f:
    f.read(12)
    chunk_len = int.from_bytes(f.read(4), 'little')
    f.read(4)
    gltf = json.loads(f.read(chunk_len).decode('utf-8'))

mesh = gltf['meshes'][0]
print(f"Mesh has {len(mesh['primitives'])} primitives:")
for i, prim in enumerate(mesh['primitives']):
    print(f"Prim {i}:")
    print(f"  attributes: {list(prim['attributes'].keys())}")
    draco = prim.get('extensions', {}).get('KHR_draco_mesh_compression', {})
    print(f"  draco attributes: {list(draco.get('attributes', {}).keys())}")
    if 'material' in prim:
        mat_idx = prim['material']
        print(f"  material {mat_idx}: {gltf.get('materials', [{}])[mat_idx].get('name')}")
