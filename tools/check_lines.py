import os

paths = ["index.html"]
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith(('.js', '.css', '.html')):
            paths.append(os.path.join(root, f))

violators = []
for p in paths:
    with open(p, "r", encoding="utf-8", errors="ignore") as f:
        lines = len(f.readlines())
    status = "OK" if lines <= 300 else "VIOLATION"
    print(f"[{status}] {p}: {lines} lines")
    if lines > 300:
        violators.append((p, lines))

print(f"\nTotal violations: {len(violators)}")
