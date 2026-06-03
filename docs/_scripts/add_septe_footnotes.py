# -*- coding: utf-8 -*-
"""Agrega notas al pie a las estadisticas del analisis SEPTE del Informe (manual 5.3)."""
import os, shutil, win32com.client

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DOC = os.path.join(BASE, '01-Informe-Proyecto.docx')
BAK = os.path.join(BASE, '01-Informe-Proyecto.bak.docx')

# (substring buscado dentro del parrafo, texto de la nota al pie)
TARGETS = [
    ("solo cerca del 8",
     "Red Nacional de Recicladores del Perú (2022). Diagnóstico del Reciclador en Perú; MINAM (2023), SINIA."),
    ("menos del 15%",
     "MINAM (2023). Sistema Nacional de Información Ambiental (SINIA) — Estadísticas de Residuos Sólidos Municipales."),
    ("toneladas/d",
     "MINAM (2023). SINIA — Estadísticas de Residuos Sólidos Municipales; OEFA (2022)."),
    ("el 3.9",
     "OEFA (2022). Fiscalización Ambiental en Residuos Sólidos de Gestión Municipal Provincial — Informe 2022."),
    ("1.5 toneladas",
     "U.S. EPA (2023). Recycling Basics and Benefits; Ellen MacArthur Foundation (2021), Plastics and the Circular Economy."),
    ("Ley General de Residuos",
     "Ley N° 27314 — Ley General de Residuos Sólidos y Decreto Legislativo N° 1278 (2017)."),
    ("29419",
     "Ley N° 29419 (2009) y su Reglamento D.S. N° 005-2010-MINAM."),
    ("del MEF otorga",
     "MEF (2024). Programa de Incentivos a la Mejora de la Gestión Municipal — Guía Metodológica."),
]

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = 0
try:
    if os.path.exists(BAK):
        shutil.copy2(BAK, DOC)   # restaurar version limpia antes de editar
    else:
        shutil.copy2(DOC, BAK)   # primer respaldo
    doc = word.Documents.Open(DOC)
    used = set()
    added = 0
    for para in doc.Paragraphs:
        txt = para.Range.Text
        for key, note in TARGETS:
            if key in used:
                continue
            if key in txt:
                end = para.Range.End - 1  # antes de la marca de parrafo
                rng = doc.Range(end, end)
                # Add(Range, Reference, Text) -- pasar Text posicional (el binding
                # tardio de COM ignora el argumento con nombre Text=)
                fn = doc.Footnotes.Add(rng, "", note)
                fn.Range.Text = note  # garantiza el contenido
                used.add(key)
                added += 1
                print(f"OK  -> nota agregada para: '{key}'")
                break
    missing = [k for k, _ in TARGETS if k not in used]
    for m in missing:
        print(f"AVISO: no se encontro el texto: '{m}'")
    doc.Save()
    doc.Close()
    print(f"Total notas agregadas: {added}/{len(TARGETS)}")
finally:
    word.Quit()
