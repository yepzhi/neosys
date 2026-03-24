import fitz
import os

def render_markdown_to_pdf(md_filepath, output_pdf, is_cn=False):
    doc = fitz.open()
    page = None
    y_pos = 50
    margin_top = 50
    margin_bottom = 50
    margin_left = 50
    margin_right = 50
    page_width = 595.28
    page_height = 841.89
    
    def new_page():
        nonlocal page, y_pos
        page = doc.new_page(width=page_width, height=page_height)
        y_pos = margin_top

    new_page()
    
    with open(md_filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
    
    base_font = "cjk" if is_cn else "helv"
    bold_font = "cjk" if is_cn else "hebo"  # CJK handles bold natively sometimes but we can just use cjk
    
    for para in paragraphs:
        if para == "⸻" or para == "***":
            y_pos += 10
            page.draw_line(fitz.Point(margin_left, y_pos), fitz.Point(page_width - margin_right, y_pos), color=(0.8,0.8,0.8), width=1)
            y_pos += 20
            continue
            
        fontname = base_font
        fontsize = 11
        color = (0.1, 0.1, 0.1)
        
        if para.startswith("# "):
            fontname = bold_font
            fontsize = 18
            para = para.replace("# ", "")
        elif para.startswith("### "):
            fontname = bold_font
            fontsize = 13
            color = (0.655, 0.545, 0.98) # #A78BFA
            para = para.replace("### ", "")
            y_pos += 10
            
        para = para.replace("**", "").replace("*", "").replace("`", "")
        
        lines = []
        if para.startswith("- "):
            for l in para.split('\n'):
                lines.append(l.replace("- ", "•  "))
            para = "\n".join(lines)
        
        if y_pos > page_height - margin_bottom - 40:
            new_page()
            
        rect = fitz.Rect(margin_left, y_pos, page_width - margin_right, page_height - margin_bottom)
        
        try:
            rc = page.insert_textbox(rect, para, fontsize=fontsize, fontname=fontname, color=color, align=0)
            if rc >= 0:
                y_pos += (rect.height - rc) + 15
            else:
                new_page()
                rect = fitz.Rect(margin_left, y_pos, page_width - margin_right, page_height - margin_bottom)
                rc = page.insert_textbox(rect, para, fontsize=fontsize, fontname=fontname, color=color, align=0)
                if rc >= 0:
                    y_pos += (rect.height - rc) + 15
                else:
                    y_pos += 200 
        except Exception as e:
            print("Error parsing", repr(para[:20]), e)
            y_pos += 20

    doc.save(output_pdf)
    print(f"Generated {output_pdf}")

files = [
    ("whitepaper-es.md", "neosysaeon-whitepaper.pdf", False),
    ("whitepaper-en.md", "neosysaeon-whitepaper-en.pdf", False),
    ("whitepaper-cn.md", "neosysaeon-whitepaper-cn.pdf", True)
]

for md_file, pdf_file, is_cn in files:
    if os.path.exists(md_file):
        render_markdown_to_pdf(md_file, pdf_file, is_cn)
