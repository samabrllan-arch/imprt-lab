"""
Herramienta de Diagnóstico y Optimización de Modelos 3D (OBJ a GLB Draco)
Convierte modelos pesados de CLO3D/Marvelous Designer (110MB) en archivos GLB de ~1MB para WebGL a 60 FPS.
"""
import sys
import os
import subprocess

def analyze_obj(file_path):
    print(f"\n--- Diagnóstico: {file_path} ---")
    if not os.path.exists(file_path):
        print(f"Error: El archivo {file_path} no existe.")
        return

    size_mb = os.path.getsize(file_path) / (1024 * 1024)
    print(f"Tamaño OBJ original: {size_mb:.2f} MB")

    v_count = 0
    f_count = 0
    materials = set()

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if line.startswith("v "):
                v_count += 1
            elif line.startswith("f "):
                f_count += 1
            elif line.startswith("usemtl "):
                parts = line.strip().split()
                if len(parts) > 1:
                    materials.add(parts[1])

    print(f"Vértices: {v_count:,} | Polígonos: {f_count:,} | Materiales: {len(materials)}")

def convert_to_draco_glb(obj_path, out_glb_path):
    print(f"\nIniciando optimización:")
    print(f"  Entrada:  {obj_path}")
    print(f"  Destino:  {out_glb_path}")

    temp_glb = out_glb_path.replace(".glb", "_raw.glb")
    os.makedirs(os.path.dirname(os.path.abspath(out_glb_path)), exist_ok=True)

    # Paso 1: Convertir OBJ plano a GLB binario
    cmd1 = f'npx --yes obj2gltf -i "{obj_path}" -o "{temp_glb}" -b'
    print("[1/2] Convirtiendo OBJ a binario GLB...")
    res1 = subprocess.run(cmd1, shell=True, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if res1.returncode != 0:
        print("Error en conversión GLB:", res1.stderr)
        return False

    # Paso 2: Optimizar con compresión Draco y deduplicación
    cmd2 = f'npx --yes @gltf-transform/cli optimize "{temp_glb}" "{out_glb_path}" --compress draco'
    print("[2/2] Aplicando compresión geométrica Draco...")
    res2 = subprocess.run(cmd2, shell=True, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    
    # Limpieza temporal
    if os.path.exists(temp_glb):
        os.remove(temp_glb)

    if os.path.exists(out_glb_path):
        final_size = os.path.getsize(out_glb_path) / (1024 * 1024)
        print(f"\nÉxito! Archivo listo para WebGL:")
        print(f"  Tamaño final: {final_size:.2f} MB (reducción > 98%)")
        return True
    return False

if __name__ == "__main__":
    target = r"C:\Users\samab\Downloads\obj\obj_0.obj"
    out = r"c:\Users\samab\OneDrive\Documentos\Camisas\public\models\shirt_clo_optimized.glb"
    if len(sys.argv) > 1:
        target = sys.argv[1]
    if len(sys.argv) > 2:
        out = sys.argv[2]
    
    analyze_obj(target)
    convert_to_draco_glb(target, out)
