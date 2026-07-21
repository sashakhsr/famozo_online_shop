import json
import sqlite3
from pathlib import Path

base = Path('database')
base.mkdir(exist_ok=True)
conn = sqlite3.connect(base / 'catalog.db')
conn.row_factory = sqlite3.Row

categories = []
for row in conn.execute('SELECT * FROM categories ORDER BY sort_order, title, id'):
    item = dict(row)
    item['product_count'] = conn.execute(
        'SELECT COUNT(*) FROM products WHERE category_key = ?',
        (item['category_key'],),
    ).fetchone()[0]
    categories.append(item)

products = [dict(row) for row in conn.execute('SELECT * FROM products ORDER BY category_key, sort_order, id')]

(base / 'categories.json').write_text(json.dumps(categories, ensure_ascii=False, indent=2), encoding='utf-8')
(base / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
(base / 'catalog.json').write_text(
    json.dumps({'categories': categories, 'products': products}, ensure_ascii=False, indent=2),
    encoding='utf-8',
)

print(f'Wrote {len(categories)} categories and {len(products)} products')
