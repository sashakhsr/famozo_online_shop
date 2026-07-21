import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
with open(root / 'database' / 'catalog.json', 'r', encoding='utf-8') as fh:
    data = json.load(fh)

categories = data.get('categories', [])
products = data.get('products', [])

assert categories, 'categories should not be empty'
assert products, 'products should not be empty'
assert any(c['category_key'] == 'sorochki' for c in categories)
assert any(p['category_key'] == 'bryuki' for p in products)

print('Verified static catalog data:', len(categories), 'categories,', len(products), 'products')
