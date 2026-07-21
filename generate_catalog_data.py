import json
from pathlib import Path

root = Path(__file__).resolve().parent
with open(root / 'database' / 'catalog.json', 'r', encoding='utf-8') as fh:
    data = json.load(fh)

content = "window.FAMOZO_STATIC_CATALOG = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
(root / 'assets' / 'catalog-data.js').write_text(content, encoding='utf-8')
print('wrote', root / 'assets' / 'catalog-data.js')
