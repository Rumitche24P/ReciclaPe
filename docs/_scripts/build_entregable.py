# -*- coding: utf-8 -*-
"""Arma la carpeta 'entregable/' con un ZIP de toda la documentacion a entregar."""
import os, zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # reciclape/
DOCS = os.path.join(ROOT, 'docs')
OUT_DIR = os.path.join(ROOT, 'entregable')
os.makedirs(OUT_DIR, exist_ok=True)
ZIP_PATH = os.path.join(OUT_DIR, 'ReciclaPe-Entrega.zip')
TOP = 'ReciclaPe-Entrega'  # carpeta raiz dentro del zip

# Archivos sueltos (origen relativo a docs/  ->  destino dentro del TOP)
FILES = [
    ('01-Informe-Proyecto.docx',                  '01-Informe-Proyecto.docx'),
    ('02-Plan-Tecnico.docx',                      '02-Plan-Tecnico.docx'),
    ('00-Analisis-Silabo-vs-Proyecto.docx',       '00-Analisis-Silabo-vs-Proyecto.docx'),
    ('Presentacion-Sustentacion.pptx',            'Presentacion-Sustentacion.pptx'),
    ('Anexo-B-Script-SQL.sql',                    'Anexo-B-Script-SQL.sql'),
    ('Anexo-D-ReciclaPe.postman_collection.json', 'Anexo-D-ReciclaPe.postman_collection.json'),
    ('Anexo-E-Guion-Video.docx',                  'Anexo-E-Guion-Video.docx'),
]
# Carpeta completa de diagramas (md + img + src + config)
FOLDERS = [('Anexo-A-Diagramas', 'Anexo-A-Diagramas')]

LEEME = """\
ReciclaPe - Documentacion del Proyecto
Curso: Desarrollo de Aplicaciones Web II (4697) - CIBERTEC - Ciclo Sexto - 2026

CONTENIDO DE LA ENTREGA
=======================
- 01-Informe-Proyecto.docx ............ Informe completo del proyecto (con notas al pie del SEPTE).
- 02-Plan-Tecnico.docx ................ Plan tecnico del equipo (stack, roles, cronograma).
- 00-Analisis-Silabo-vs-Proyecto.docx . Analisis de alineacion silabo vs proyecto.
- Presentacion-Sustentacion.pptx ...... Presentacion para la sustentacion (16 diapositivas).

ANEXOS
------
- Anexo-A-Diagramas/ .................. 9 diagramas (imagenes PNG + fuentes Mermaid).
    ReciclaPe-Diagramas.md ............ Documento con todos los diagramas explicados.
    img/ .............................. Diagramas exportados a PNG.
    src/ .............................. Codigo fuente Mermaid editable (.mmd).
- Anexo-B-Script-SQL.sql .............. Script PostgreSQL 16 (auth_db + recojo_db) con datos semilla.
- Anexo-D-ReciclaPe.postman_collection.json . Coleccion Postman con todos los endpoints REST.
- Anexo-E-Guion-Video.docx ............ Guion del Video Demo Reel (3-5 min).

NOTAS
-----
- Base de datos: PostgreSQL 16. Ejecutar el script con psql:
      psql -U postgres -f Anexo-B-Script-SQL.sql
- Usuario de prueba (todos): password = ReciclaPe2026
- PENDIENTE: completar la caratula del informe y la portada de la presentacion con
  los nombres del profesor, aula, coordinador e integrantes del grupo.
"""

added = []
with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as z:
    for src, dst in FILES:
        p = os.path.join(DOCS, src)
        if os.path.exists(p):
            z.write(p, f'{TOP}/{dst}')
            added.append(dst)
    for src_dir, dst_dir in FOLDERS:
        base = os.path.join(DOCS, src_dir)
        for root, _, files in os.walk(base):
            for f in files:
                fp = os.path.join(root, f)
                rel = os.path.relpath(fp, base)
                z.write(fp, f'{TOP}/{dst_dir}/{rel}'.replace('\\', '/'))
                added.append(f'{dst_dir}/{rel}')
    z.writestr(f'{TOP}/LEEME.txt', LEEME)
    added.append('LEEME.txt')

size = os.path.getsize(ZIP_PATH)
print(f'ZIP creado: {ZIP_PATH}')
print(f'Tamano: {size/1024:.1f} KB | {len(added)} elementos')
for a in added:
    print('  +', a)
