# Famozo catalog

Каталог теперь работает как статический сайт для GitHub Pages.

## Что добавлено
- `database/categories.json` — статические данные категорий.
- `database/products.json` — статические данные товаров.
- `database/catalog.json` — объединённые данные каталога.
- `assets/catalog-db.js` — выводит товары из статических JSON в существующую карточку товара.
- `admin.html` — страница для просмотра каталога без серверной части.

## Запуск
Открыть `catalog.html` напрямую в браузере или через GitHub Pages.

## category_key для существующих категорий
bryuki, futbolki, galstuki, kartholdery, kashne, klatchi, klyuchnicy, polo, portmane, remni, sorochki, sumki

Перенесено товаров: 109.

## Важные детали

- Проект не требует Python, Flask, SQLite или локального сервера.
- Каталог загружается напрямую из статических JSON-файлов.
- Для GitHub Pages достаточно загрузить репозиторий с этими файлами.
