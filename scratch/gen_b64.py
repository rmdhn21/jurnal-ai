import base64
import os

template_path = 'assets/jmp-template.docx'
output_path = 'js/jmp-template-b64.js'

if os.path.exists(template_path):
    with open(template_path, 'rb') as f:
        encoded = base64.b64encode(f.read()).decode('utf-8')
        with open(output_path, 'w') as out:
            out.write('window.JMP_TEMPLATE_B64 = "' + encoded + '";')
    print("Success: " + output_path + " generated.")
else:
    print("Error: " + template_path + " not found.")
