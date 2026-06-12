import json
import os
import re
import sqlite3
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database', 'catalog.db')

DEFAULT_BUTTON_URL = 'index.html#form6-e'
KEY_RE = re.compile(r'^[a-z0-9_-]+$')

def db_connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_first(form, name, default=''):
    return form.get(name, [default])[0]

def as_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default

def validate_category_key(key):
    key = (key or '').strip().lower()
    if not key or not KEY_RE.match(key):
        raise ValueError('Ключ категории может содержать только латинские буквы, цифры, дефис и подчёркивание.')
    return key

def category_from_form(form):
    key = validate_category_key(get_first(form, 'category_key'))
    title = get_first(form, 'title').strip()
    if not title:
        raise ValueError('Название категории обязательно.')
    return {
        'category_key': key,
        'title': title,
        'collection_title': get_first(form, 'collection_title').strip(),
        'image': get_first(form, 'image', 'assets/images/catalog-meta.png').strip() or 'assets/images/catalog-meta.png',
        'alt': get_first(form, 'alt').strip() or title,
        'section_id': get_first(form, 'section_id').strip() or ('cat-' + key),
        'sort_order': as_int(get_first(form, 'sort_order', '0'), 0),
        'is_active': 1 if get_first(form, 'is_active', '0') == '1' else 0,
    }

def product_from_form(form, conn):
    category_key = validate_category_key(get_first(form, 'category_key'))
    category = conn.execute('SELECT * FROM categories WHERE category_key=?', (category_key,)).fetchone()
    if not category:
        raise ValueError('Такой категории нет. Сначала создай категорию в админке.')
    return {
        'category_key': category_key,
        'category_title': category['title'],
        'collection_title': category['collection_title'] or '',
        'title': get_first(form, 'title').strip(),
        'description_html': get_first(form, 'description_html').strip(),
        'image': get_first(form, 'image').strip(),
        'alt': get_first(form, 'alt').strip(),
        'button_url': get_first(form, 'button_url', DEFAULT_BUTTON_URL).strip() or DEFAULT_BUTTON_URL,
        'sort_order': as_int(get_first(form, 'sort_order', '0'), 0),
        'is_active': 1 if get_first(form, 'is_active', '0') == '1' else 0,
    }

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location):
        self.send_response(303)
        self.send_header('Location', location)
        self.end_headers()

    def redirect_error(self, message):
        self.redirect('/admin.html?error=' + urllib.parse.quote(message))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/__version':
            self.send_json({'version': 'FAMOZO_V10_A55959_BUTTONS_WHITE'}); return
        if parsed.path == '/api/categories':
            with db_connect() as conn:
                rows = conn.execute('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, title').fetchall()
            self.send_json([dict(row) for row in rows]); return
        if parsed.path == '/api/all-categories':
            with db_connect() as conn:
                rows = conn.execute('SELECT c.*, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON p.category_key = c.category_key GROUP BY c.id ORDER BY c.sort_order, c.title').fetchall()
            self.send_json([dict(row) for row in rows]); return
        if parsed.path == '/api/products':
            with db_connect() as conn:
                rows = conn.execute('''
                    SELECT p.* FROM products p
                    JOIN categories c ON c.category_key = p.category_key
                    WHERE p.is_active = 1 AND c.is_active = 1
                    ORDER BY c.sort_order, p.sort_order, p.id
                ''').fetchall()
            self.send_json([dict(row) for row in rows]); return
        if parsed.path == '/api/all-products':
            with db_connect() as conn:
                rows = conn.execute('SELECT * FROM products ORDER BY category_key, sort_order, id').fetchall()
            self.send_json([dict(row) for row in rows]); return
        if parsed.path == '/':
            self.path = '/catalog.html'
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        length = int(self.headers.get('Content-Length', 0))
        form = urllib.parse.parse_qs(self.rfile.read(length).decode('utf-8'))
        try:
            if parsed.path == '/admin/category/add':
                c = category_from_form(form)
                with db_connect() as conn:
                    conn.execute('''INSERT INTO categories(category_key,title,collection_title,image,alt,section_id,sort_order,is_active)
                                    VALUES(:category_key,:title,:collection_title,:image,:alt,:section_id,:sort_order,:is_active)''', c)
                    conn.commit()
                self.redirect('/admin.html?category_saved=1'); return
            if parsed.path == '/admin/category/update':
                c = category_from_form(form); c['id'] = as_int(get_first(form, 'id', '0'), 0)
                with db_connect() as conn:
                    old = conn.execute('SELECT category_key FROM categories WHERE id=?', (c['id'],)).fetchone()
                    if not old:
                        raise ValueError('Категория не найдена.')
                    old_key = old['category_key']
                    conn.execute('''UPDATE categories SET category_key=:category_key,title=:title,collection_title=:collection_title,image=:image,alt=:alt,section_id=:section_id,sort_order=:sort_order,is_active=:is_active,updated_at=CURRENT_TIMESTAMP WHERE id=:id''', c)
                    if old_key != c['category_key']:
                        conn.execute('UPDATE products SET category_key=:new_key, category_title=:title, collection_title=:collection_title, updated_at=CURRENT_TIMESTAMP WHERE category_key=:old_key', {'new_key': c['category_key'], 'old_key': old_key, 'title': c['title'], 'collection_title': c['collection_title']})
                    else:
                        conn.execute('UPDATE products SET category_title=:title, collection_title=:collection_title, updated_at=CURRENT_TIMESTAMP WHERE category_key=:key', {'key': c['category_key'], 'title': c['title'], 'collection_title': c['collection_title']})
                    conn.commit()
                self.redirect('/admin.html?category_saved=1'); return
            if parsed.path == '/admin/category/delete':
                category_id = as_int(get_first(form, 'id', '0'), 0)
                with db_connect() as conn:
                    row = conn.execute('SELECT category_key FROM categories WHERE id=?', (category_id,)).fetchone()
                    if not row:
                        raise ValueError('Категория не найдена.')
                    count = conn.execute('SELECT COUNT(*) FROM products WHERE category_key=?', (row['category_key'],)).fetchone()[0]
                    if count:
                        raise ValueError('Нельзя удалить категорию, пока в ней есть товары. Сначала перенеси или удали товары.')
                    conn.execute('DELETE FROM categories WHERE id=?', (category_id,)); conn.commit()
                self.redirect('/admin.html?category_deleted=1'); return
            if parsed.path == '/admin/add':
                with db_connect() as conn:
                    p = product_from_form(form, conn)
                    conn.execute('''INSERT INTO products(category_key,category_title,collection_title,title,description_html,image,alt,button_url,sort_order,is_active)
                                    VALUES(:category_key,:category_title,:collection_title,:title,:description_html,:image,:alt,:button_url,:sort_order,:is_active)''', p)
                    conn.commit()
                self.redirect('/admin.html?saved=1'); return
            if parsed.path == '/admin/update':
                with db_connect() as conn:
                    p = product_from_form(form, conn); p['id'] = as_int(get_first(form, 'id', '0'), 0)
                    conn.execute('''UPDATE products SET category_key=:category_key, category_title=:category_title, collection_title=:collection_title, title=:title, description_html=:description_html, image=:image, alt=:alt, button_url=:button_url, sort_order=:sort_order, is_active=:is_active, updated_at=CURRENT_TIMESTAMP WHERE id=:id''', p)
                    conn.commit()
                self.redirect('/admin.html?saved=1'); return
            if parsed.path == '/admin/delete':
                product_id = as_int(get_first(form, 'id', '0'), 0)
                with db_connect() as conn:
                    conn.execute('DELETE FROM products WHERE id=?', (product_id,)); conn.commit()
                self.redirect('/admin.html?deleted=1'); return
        except sqlite3.IntegrityError as e:
            self.redirect_error('Ошибка SQLite: возможно, такой ключ категории уже существует.')
            return
        except ValueError as e:
            self.redirect_error(str(e)); return
        self.send_error(404)

if __name__ == '__main__':
    os.chdir(BASE_DIR)
    server = ThreadingHTTPServer(('127.0.0.1', 8000), Handler)
    print('Сайт запущен: http://127.0.0.1:8000/catalog.html')
    print('Админка:      http://127.0.0.1:8000/admin.html')
    print('Остановить сервер: Ctrl+C')
    server.serve_forever()
