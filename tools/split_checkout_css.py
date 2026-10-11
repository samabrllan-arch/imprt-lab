import re

# Quita de checkoutModal.css lo que ahora vive en checkoutSelectors.css (materiales, gramajes y sus reglas claras)
p = 'src/styles/checkoutModal.css'
t = open(p, encoding='utf-8').read()

start = t.index('/* Materiales */')
end = t.index('/* Tarjeta de Validación de Precio */')
t = t[:start] + t[end:]

t = t.replace('[data-theme="light"] .btn-checkout-mat { background: #f8fafc; border-color: #e2e8f0; }\n', '')
t = t.replace('[data-theme="light"] .btn-checkout-gram { background: #f8fafc; border-color: #e2e8f0; }\n', '')
t = t.replace('[data-theme="light"] .btn-checkout-size { background: #f8fafc; border-color: #e2e8f0; color: #0f172a; }\n',
              '[data-theme="light"] .btn-checkout-size { background: #f8fafc; border-color: #e2e8f0; color: #0f172a; }\n')
open(p, 'w', encoding='utf-8').write(t)
print('lineas checkoutModal.css:', len(t.splitlines()))

# Enlazar la nueva hoja en index.html justo después de checkoutModal.css
h = open('index.html', encoding='utf-8').read()
anchor = '<link rel="stylesheet" href="./src/styles/checkoutModal.css">'
new = anchor + '\n  <link rel="stylesheet" href="./src/styles/checkoutSelectors.css">'
if 'checkoutSelectors.css' not in h:
    assert anchor in h
    h = h.replace(anchor, new, 1)
    open('index.html', 'w', encoding='utf-8').write(h)
print('index.html enlazado:', 'checkoutSelectors.css' in open('index.html', encoding='utf-8').read())

# Accesibilidad: aria-pressed en las opciones del checkout
v = 'src/ui/checkoutModalView.js'
s = open(v, encoding='utf-8').read()
s = s.replace('''                    class="btn-checkout-size ${isSelected ? 'active' : ''}" \n''',
              '''                    class="btn-checkout-size ${isSelected ? 'active' : ''}" \n                    aria-pressed="${isSelected}"\n''')
s = s.replace('''                  class="btn-checkout-mat ${m.id === selectedMaterial ? 'active' : ''}" \n''',
              '''                  class="btn-checkout-mat ${m.id === selectedMaterial ? 'active' : ''}" \n                  aria-pressed="${m.id === selectedMaterial}"\n''')
s = s.replace('''                    class="btn-checkout-gram ${isSelected ? 'active' : ''}" \n''',
              '''                    class="btn-checkout-gram ${isSelected ? 'active' : ''}" \n                    aria-pressed="${isSelected}"\n''')
open(v, 'w', encoding='utf-8').write(s)
print('aria-pressed:', s.count('aria-pressed'))
