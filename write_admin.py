from pathlib import Path

content = """<!doctype html>
<html lang=\"ru\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>Админка каталога Famozo</title>
  <link rel=\"stylesheet\" href=\"assets/bootstrap/css/bootstrap.min.css\">
  <style>
    body { padding: 24px; }
    textarea { min-height: 110px; font-family: monospace; }
    .product-row, .category-row { border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .thumb { width: 90px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
    code { background: #f5f5f5; padding: 2px 5px; border-radius: 4px; }
    .hint { font-size: .9rem; color: #6c757d; }
    .section-title { margin-top: 42px; }
  </style>
</head>
<body>
  <div class=\"container-fluid\">
    <div class=\"d-flex justify-content-between align-items-center mb-4\">
      <div>
        <h1 class=\"mb-1\">Админка каталога — версия с категориями</h1>
        <p class=\"text-muted mb-0\">Категории и товары загружаются из статических JSON-файлов для GitHub Pages.</p>
      </div>
      <a class=\"btn btn-primary\" href=\"catalog.html\">Открыть каталог</a>
    </div>

    <div class=\"alert alert-info\"><strong>GitHub Pages:</strong> эта страница работает без Python, Flask, SQLite и локального сервера. Для редактирования каталога нужно обновить файлы <code>database/categories.json</code> и <code>database/products.json</code>.</div>
    <div class=\"alert alert-success\"><strong>Версия 2.0:</strong> категории и товары автоматически подхватываются из статических данных.</div>

    <h2 class=\"section-title\">Текущие категории</h2>
    <div id=\"categories\">Загрузка...</div>

    <h2 class=\"section-title\">Текущие товары</h2>
    <div id=\"products\">Загрузка...</div>
  </div>

  <script>
    let CATEGORIES = [];
    function esc(value) {
      return String(value ?? '').replace(/[&<>'\"]/g, function (ch) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', \"'\": '&#39;', '\"': '&quot;' })[ch];
      });
    }

    async function loadStaticData() {
      const response = await fetch('database/catalog.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load database/catalog.json');
      const data = await response.json();
      return {
        categories: Array.isArray(data.categories) ? data.categories : [],
        products: Array.isArray(data.products) ? data.products : []
      };
    }

    function renderCategories(categories) {
      CATEGORIES = categories;
      document.getElementById('categories').innerHTML = categories.length
        ? categories.map(function (c) {
            return `<div class=\"category-row\"><div class=\"row g-3 align-items-start\"><div class=\"col-md-1\"><img class=\"thumb\" src=\"${esc(c.image)}\" alt=\"\"></div><div class=\"col-md-2\"><label class=\"form-label\">Ключ</label><input class=\"form-control\" value=\"${esc(c.category_key)}\" disabled></div><div class=\"col-md-2\"><label class=\"form-label\">Название</label><input class=\"form-control\" value=\"${esc(c.title)}\" disabled></div><div class=\"col-md-2\"><label class=\"form-label\">Большой раздел</label><input class=\"form-control\" value=\"${esc(c.collection_title)}\" disabled></div><div class=\"col-md-3\"><label class=\"form-label\">Картинка ссылки</label><input class=\"form-control\" value=\"${esc(c.image)}\" disabled></div><div class=\"col-md-2\"><label class=\"form-label\">Alt</label><input class=\"form-control\" value=\"${esc(c.alt)}\" disabled></div><div class=\"col-md-2\"><label class=\"form-label\">ID секции</label><input class=\"form-control\" value=\"${esc(c.section_id || ('cat-' + c.category_key))}\" disabled></div><div class=\"col-md-1\"><label class=\"form-label\">Порядок</label><input class=\"form-control\" value=\"${esc(c.sort_order)}\" disabled></div><div class=\"col-md-2\"><label class=\"form-label\">Активна</label><input class=\"form-control\" value=\"${c.is_active ? 'Да' : 'Нет'}\" disabled></div><div class=\"col-md-2\"><label class=\"form-label\">Товаров</label><input class=\"form-control\" value=\"${c.product_count}\" disabled></div></div></div>`;
          }).join('')
        : '<div class=\"alert alert-warning\">Категорий пока нет.</div>';
    }

    function productRow(p) {
      return `<div class=\"product-row\"><div class=\"row g-3 align-items-start\"><div class=\"col-md-1\"><img class=\"thumb\" src=\"${esc(p.image)}\" alt=\"\"></div><div class=\"col-md-2\"><label class=\"form-label\">Категория</label><input class=\"form-control\" value=\"${esc(p.category_key)}\" disabled></div><div class=\"col-md-3\"><label class=\"form-label\">Название</label><input class=\"form-control\" value=\"${esc(p.title)}\" disabled></div><div class=\"col-md-1\"><label class=\"form-label\">Порядок</label><input class=\"form-control\" value=\"${esc(p.sort_order)}\" disabled></div><div class=\"col-md-4\"><label class=\"form-label\">Картинка</label><input class=\"form-control\" value=\"${esc(p.image)}\" disabled></div><div class=\"col-md-1\"><label class=\"form-label\">Активен</label><input class=\"form-control\" value=\"${p.is_active ? 'Да' : 'Нет'}\" disabled></div><div class=\"col-md-4\"><label class=\"form-label\">Alt</label><input class=\"form-control\" value=\"${esc(p.alt)}\" disabled></div><div class=\"col-md-4\"><label class=\"form-label\">Кнопка</label><input class=\"form-control\" value=\"${esc(p.button_url)}\" disabled></div><div class=\"col-12\"><label class=\"form-label\">Описание HTML</label><textarea class=\"form-control\" disabled>${esc(p.description_html)}</textarea></div></div></div>`;
    }

    function renderProducts(products) {
      document.getElementById('products').innerHTML = products.length
        ? products.map(productRow).join('')
        : '<div class=\"alert alert-warning\">Товаров пока нет.</div>';
    }

    async function init() {
      try {
        const data = await loadStaticData();
        renderCategories(data.categories);
        renderProducts(data.products);
      } catch (error) {
        document.getElementById('categories').innerHTML = '<div class=\"alert alert-danger\">Не удалось загрузить каталог. Проверьте файл database/catalog.json.</div>';
        document.getElementById('products').innerHTML = '';
        console.error(error);
      }
    }

    init();
  </script>
</body>
</html>
"""

Path('admin.html').write_text(content, encoding='utf-8')
print('updated admin.html')
