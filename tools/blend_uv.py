from PIL import Image

uv_map_path = r"C:\Users\samab\.gemini\antigravity-ide\brain\3b32ae4e-6084-4fcb-8357-d8479a901d31\uv_layout_rendered.png"
sim_path = r"C:\Users\samab\.gemini\antigravity-ide\brain\3b32ae4e-6084-4fcb-8357-d8479a901d31\simulated_canvas.png"

uv_img = Image.open(uv_map_path).resize((2048, 2048))
sim_img = Image.open(sim_path)

blended = Image.blend(uv_img.convert("RGB"), sim_img.convert("RGB"), 0.5)
out_path = r"C:\Users\samab\.gemini\antigravity-ide\brain\3b32ae4e-6084-4fcb-8357-d8479a901d31\overlay_check.png"
blended.save(out_path)
print("Overlay guardado en:", out_path)
