# -*- coding: utf-8 -*-
"""Normaliza el autor en los metadatos (docProps/core.xml) de los .docx/.pptx,
tocando unicamente core.xml para no alterar el contenido (incluidas notas al pie)."""
import os, re, zipfile

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
AUTOR = 'ziro vasquez'
ARCHIVOS = [
    '00-Analisis-Silabo-vs-Proyecto.docx',
    '01-Informe-Proyecto.docx',
    '02-Plan-Tecnico.docx',
    'Anexo-E-Guion-Video.docx',
    'Presentacion-Sustentacion.pptx',
]


def set_tag(xml, tag, valor):
    pat = re.compile(rf'<{tag}>.*?</{tag}>|<{tag}/>', re.DOTALL)
    nuevo = f'<{tag}>{valor}</{tag}>'
    if pat.search(xml):
        return pat.sub(nuevo, xml, count=1)
    # insertar antes de cerrar coreProperties si no existe
    return xml.replace('</cp:coreProperties>', f'{nuevo}</cp:coreProperties>')


def fix(path):
    tmp = path + '.tmp'
    with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'docProps/core.xml':
                t = data.decode('utf-8')
                t = set_tag(t, 'dc:creator', AUTOR)
                t = set_tag(t, 'cp:lastModifiedBy', AUTOR)
                data = t.encode('utf-8')
            zout.writestr(item, data)
    os.replace(tmp, path)


for nombre in ARCHIVOS:
    p = os.path.join(BASE, nombre)
    if os.path.exists(p):
        fix(p)
        with zipfile.ZipFile(p) as z:
            core = z.read('docProps/core.xml').decode('utf-8')
        cre = re.search(r'<dc:creator>(.*?)</dc:creator>', core)
        mod = re.search(r'<cp:lastModifiedBy>(.*?)</cp:lastModifiedBy>', core)
        print(f'{nombre}: creator={cre.group(1) if cre else "-"} | lastModifiedBy={mod.group(1) if mod else "-"}')
