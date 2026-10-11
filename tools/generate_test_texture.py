import os
from PIL import Image

tex_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection\test_woman_tex.png"
os.makedirs(r"C:\Users\samab\OneDrive\Documentos\Camisas\temp_inspection", exist_ok=True)

img_canvas = Image.new("RGBA", (2048, 2048), (18, 18, 20, 255))
logo_path = r"C:\Users\samab\OneDrive\Documentos\Camisas\public\assets\logo.jpg"

if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    logo = logo.resize((440, 440))
    # Front at (548, 720) -> In PIL (top origin): (548 - 220, 720 - 220)
    img_canvas.paste(logo, (548 - 220, 720 - 220), logo)
    # Back at (1536, 720)
    img_canvas.paste(logo, (1536 - 220, 720 - 220), logo)

img_canvas.save(tex_path)
print("Saved 2-sided test texture to", tex_path)
