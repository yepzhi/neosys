import fitz
import os
import re

def render_academic_pdf(md_filepath, output_pdf, is_cn=False):
    doc = fitz.open()
    page = None
    y_pos = 0
    margin_top = 70
    margin_bottom = 70
    margin_left = 60
    margin_right = 60
    page_width = 595.28  # A4 width
    page_height = 841.89 # A4 height
    
    # Fonts
    base_font = "china-t" if is_cn else "helv"
    bold_font = "china-t" if is_cn else "hebo"

    def new_page():
        nonlocal page, y_pos
        page = doc.new_page(width=page_width, height=page_height)
        y_pos = margin_top

    with open(md_filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into paragraphs
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]

    # --- PAGE 1: TITLE PAGE ---
    new_page()
    
    # Selection of title elements (everything before the first ###)
    title_elements = []
    body_elements = []
    found_first_heading = False
    
    for p in paragraphs:
        if not found_first_heading and p.startswith("### "):
            found_first_heading = True
        
        if not found_first_heading:
            title_elements.append(p)
        else:
            body_elements.append(p)

    # Render Title Page centered vertically
    # Typical title elements: # Header, NEOSYS AEON, Subtitle, Whitepaper v3.0, Divider
    title_y = page_height / 2 - 150
    for tp in title_elements:
        if tp in ["⸻", "***"]: continue # Skip dividers on title page for minimalist look
        
        tp_clean = tp.replace("# ", "").replace("**", "").replace("📄 ", "").replace("✨", "").strip()
        if not tp_clean: continue
        
        if "NEOSYS AEON" in tp_clean.upper():
            fs = 28
            fn = bold_font
            color = (0.0, 0.0, 0.0)
            spacing = 45
        elif "Whitepaper" in tp_clean or "白皮書" in tp_clean:
            fs = 14
            fn = base_font
            color = (0.3, 0.3, 0.3)
            spacing = 25
        else:
            fs = 12
            fn = base_font
            color = (0.5, 0.5, 0.5)
            spacing = 20
            
        rect = fitz.Rect(margin_left, title_y, page_width - margin_right, title_y + 100)
        page.insert_textbox(rect, tp_clean, fontsize=fs, fontname=fn, color=color, align=1)
        title_y += spacing

    # --- PAGE 2 & ONWARDS: BODY ---
    new_page()
    
    # Flag to ensure the first content (usually Mandamientos) starts at the top of Page 2
    for para in body_elements:
        # Detect if we should force a page break before specific sections (like Summary or Intro)
        # if "### Resumen" in para or "### 1. Introducción" in para:
        #     if y_pos > margin_top + 100: # Only if we already have some content on the page
        #         new_page()

        if para == "⸻" or para == "***":
            y_pos += 20
            page.draw_line(fitz.Point(margin_left + 150, y_pos), fitz.Point(page_width - margin_right - 150, y_pos), color=(0.9,0.9,0.9), width=0.5)
            y_pos += 30
            continue
            
        fontname = base_font
        fontsize = 10.5
        color = (0.1, 0.1, 0.1)
        alignment = 3 if not is_cn else 0 # Justify for non-CN
        
        # Heading Detection
        is_heading = False
        if para.startswith("### "):
            section_token = para.replace("### ", "").split(" ")[0].strip(".")
            force_new = False
            
            # User specific grouping rules:
            # Group 3-4 (Start on 3)
            # Group 5-8 (Start on 5)
            # Standalone Declaración Final
            if section_token in ["3", "5"] or "Declaración" in para or "Declaration" in para or "声明" in para:
                force_new = True
            elif section_token in ["1", "2"]: # Intro and Resumen usually standalone or start new
                 force_new = True
                 
            if force_new and y_pos > margin_top + 30:
                new_page()

            fontname = bold_font
            fontsize = 12.5
            color = (0, 0, 0)
            para = para.replace("### ", "")
            y_pos += 5
            alignment = 0
            is_heading = True
        elif para.startswith("## "):
            fontname = bold_font
            fontsize = 14
            para = para.replace("## ", "")
            y_pos += 10
            alignment = 0
            is_heading = True
            
        # Bold Commandments Detection
        is_commandment = False
        if re.match(r"^\*\*?[IVX]+\.", para):
            fontname = bold_font
            fontsize = 10.5
            y_pos += 6
            alignment = 0
            is_commandment = True

        # Cleanup
        para_render = para.replace("**", "").replace("*", "").replace("`", "")
        
        # List Handling
        if para_render.startswith("- "):
            lines = []
            for l in para_render.split('\n'):
                lines.append(l.replace("- ", "•  "))
            para_render = "\n".join(lines)
            alignment = 0
        
        # Page break logic
        if y_pos > page_height - margin_bottom - 60:
            new_page()
            
        rect = fitz.Rect(margin_left, y_pos, page_width - margin_right, page_height - margin_bottom)
        
        try:
            rc = page.insert_textbox(rect, para_render, fontsize=fontsize, fontname=fontname, color=color, align=alignment)
            if rc >= 0:
                # Tighten spacing: 12 for headings, 8 for commandments, 7 for body
                y_pos += (rect.height - rc) + (12 if is_heading else (8 if is_commandment else 7))
            else:
                new_page()
                rect = fitz.Rect(margin_left, y_pos, page_width - margin_right, page_height - margin_bottom)
                rc = page.insert_textbox(rect, para_render, fontsize=fontsize, fontname=fontname, color=color, align=alignment)
                if rc >= 0:
                    y_pos += (rect.height - rc) + (14 if is_heading else 9)
                else:
                    y_pos += 200 
        except Exception as e:
            print(f"Error at {md_filepath}: {e}")
            y_pos += 15

    # Page Numbering (Skip Page 1)
    for i in range(1, doc.page_count):
        p = doc[i]
        p.insert_text(fitz.Point(page_width/2 - 20, page_height - 40), f"NEOSYS AEON  |  {i}", fontsize=8, fontname="helv", color=(0.6, 0.6, 0.6))

    doc.save(output_pdf)
    print(f"✅ Generated {output_pdf} (Academic Design)")

files = [
    ("whitepaper-es.md", "neosysaeon-whitepaper-v4.1-es.pdf", False),
    ("whitepaper-en.md", "neosysaeon-whitepaper-v4.1-en.pdf", False),
    ("whitepaper-cn.md", "neosysaeon-whitepaper-v4.1-cn.pdf", True)
]

for md_file, pdf_file, is_cn in files:
    if os.path.exists(md_file):
        render_academic_pdf(md_file, pdf_file, is_cn)
