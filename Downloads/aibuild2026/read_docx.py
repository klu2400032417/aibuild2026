import zipfile
import xml.etree.ElementTree as ET

docx_filename = "04 - NetworkIQ - Student Problem Statement.docx"
txt_filename = "problem_statement.txt"

try:
    # Open the docx zip archive
    with zipfile.ZipFile(docx_filename) as docx:
        # Read the main document content
        xml_content = docx.read('word/document.xml')
        
        # Parse XML
        root = ET.fromstring(xml_content)
        
        # Extract text from w:t tags (word text elements)
        # XML namespace map for docx
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for p in root.findall('.//w:p', namespaces):
            p_text = []
            for t in p.findall('.//w:t', namespaces):
                if t.text:
                    p_text.append(t.text)
            if p_text:
                paragraphs.append("".join(p_text))
                
        # Write to txt
        with open(txt_filename, "w", encoding="utf-8") as f:
            f.write("\n\n".join(paragraphs))
            
    print(f"Successfully extracted text from {docx_filename} to {txt_filename}!")
except Exception as e:
    print(f"Error reading docx: {str(e)}")
