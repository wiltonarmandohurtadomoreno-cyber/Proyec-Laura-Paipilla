"""
1) Genera assets/imagenes.js: copia de las imágenes en base64, para que
   index.html funcione también al abrirlo con doble clic.
2) Genera dist/juego.html: el juego completo en UN SOLO archivo.

Ejecútalo cada vez que cambies alguna imagen de /assets:
    python3 empaquetar.py
"""
import base64, re, pathlib, json

raiz = pathlib.Path(__file__).parent
rutas_js = (raiz / 'src' / 'rutas.js').read_text(encoding='utf-8')
imagenes = {}
for clave, archivo in re.findall(r"(\w+):\s*'(assets/[^']+)'", rutas_js):
    b64 = base64.b64encode((raiz / archivo).read_bytes()).decode()
    imagenes[clave] = 'data:image/png;base64,' + b64

(raiz / 'assets' / 'imagenes.js').write_text(
    '// Archivo generado por empaquetar.py: no editar a mano.\n'
    'const IMAGENES_INCRUSTADAS = ' + json.dumps(imagenes, indent=1) + ';\n',
    encoding='utf-8')
print('Listo: assets/imagenes.js')

html = (raiz / 'index.html').read_text(encoding='utf-8')
html = html.replace('  <script src="assets/imagenes.js"></script>\n', '')

def incrustar(m):
    ruta = m.group(1)
    codigo = (raiz / ruta).read_text(encoding='utf-8')
    if ruta.endswith('rutas.js'):
        codigo = 'let RUTAS = ' + json.dumps(imagenes) + ';\n'
    return f'<script>\n// ---- {ruta}\n{codigo}\n</script>'

html = re.sub(r'<script src="(src/[^"]+)"></script>', incrustar, html)
(raiz / 'dist').mkdir(exist_ok=True)
(raiz / 'dist' / 'juego.html').write_text(html, encoding='utf-8')
print('Listo: dist/juego.html')
