(function () {
  console.log('Famozo catalog-db version: COLOR_A55959_BUTTONS_WHITE_V10_FINAL');
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, function (ch) {
      return ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'})[ch];
    });
  }

  const WHATSAPP_NUMBER = '77775479888';

  // Единые цвета фонов секций каталога.
  // Новые категории из админки автоматически получают эти цвета,
  // потому что секции строятся динамически из SQLite.
  const CATALOG_LIGHT_BG = '#ffeada';
  const CATALOG_DARK_BG = '#a55959';

  function cleanText(text) {
    return text ? text.replace(/\s+/g, ' ').trim() : '';
  }

  function extractArticle(text) {
    if (!text) return '';
    const match = text.match(/арт(?:\s+для\s+[^:]+)?\s*:\s*([^\n,]+)/i);
    return match ? cleanText(match[1]) : '';
  }

  function absoluteUrl(src) {
    if (!src) return '';
    try {
      return new URL(src, window.location.href).href;
    } catch (e) {
      return src;
    }
  }

  function createMessage(name, article, image) {
    let text = `Здравствуйте !\nМеня интересует ${name}`;
    text += article ? ` с арт ${article}` : ` с арт ...`;
    if (image) text += `\n${image}`;
    return text;
  }

  function htmlToText(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.innerText || div.textContent || '';
  }

  function whatsappUrl(name, descriptionHtml, imageSrc) {
    const article = extractArticle(htmlToText(descriptionHtml));
    const imageUrl = absoluteUrl(imageSrc || '');
    const message = createMessage(cleanText(name || 'товар'), article, imageUrl);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function bindWhatsAppButtons() {
    if (document.documentElement.dataset.whatsappButtonsBound === '1') return;
    document.documentElement.dataset.whatsappButtonsBound = '1';

    document.addEventListener('click', function (e) {
      const target = e.target;
      const button = target && target.closest ? target.closest('a.item-btn') : null;
      if (!button) return;

      e.preventDefault();

      const card = button.closest('.item-wrapper');
      if (!card) return;

      const titleEl = card.querySelector('.item-title');
      const textEl = card.querySelector('.mbr-text');
      const imgEl = card.querySelector('.item-img img');

      const productName = cleanText(titleEl ? titleEl.textContent : 'товар');
      const article = extractArticle(textEl ? textEl.innerText : '');
      const imageUrl = absoluteUrl(imgEl ? imgEl.getAttribute('src') : '');

      const message = createMessage(productName, article, imageUrl);
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      button.setAttribute('href', waLink);
      window.open(waLink, '_blank');
    }, true);
  }

  function productCard(product, index) {
    const title = escapeHtml(product.title);
    const image = escapeHtml(product.image);
    const alt = escapeHtml(product.alt || product.title);
    const description = product.description_html || '';
    const buttonUrl = escapeHtml(whatsappUrl(product.title, description, product.image));
    return `
      <div class="item features-image col-12 col-md-6 col-lg-3">
        <div class="item-wrapper">
          <div class="item-img"><img src="${image}" alt="${alt}" data-slide-to="${index}" data-bs-slide-to="${index}"></div>
          <div class="item-content">
            <h3 class="item-title mbr-fonts-style display-7"><strong>${title}</strong><br></h3>
            <p class="mbr-text mbr-fonts-style mt-3 display-7">${description}</p>
          </div>
          <div class="mbr-section-btn item-footer mt-2"><a href="${buttonUrl}" class="btn btn-primary item-btn display-7" target="_blank" style="color: #ffffff !important;">Заказать</a></div>
        </div>
      </div>`;
  }

  function categoryCard(category) {
    const title = escapeHtml(category.title);
    const image = escapeHtml(category.image || 'assets/images/catalog-meta.png');
    const alt = escapeHtml(category.alt || category.title);
    const sectionId = escapeHtml(category.section_id || ('cat-' + category.category_key));
    return `
      <div class="item features-image col-6 col-md-4 col-lg-2 active">
        <div class="item-wrapper">
          <div class="item-img"><a href="catalog.html#${sectionId}"><img alt="${alt}" data-bs-slide-to="0" data-slide-to="0" src="${image}" title=""></a></div>
          <div class="item-content align-left mt-3"><h3 class="item-title mbr-fonts-style mb-3 display-7"><strong>${title}</strong></h3></div>
        </div>
      </div>`;
  }

  function categorySection(category, products, sectionIndex) {
    const sectionId = escapeHtml(category.section_id || ('cat-' + category.category_key));
    const bgClass = sectionIndex % 2 === 0 ? 'catalog-bg-1' : 'catalog-bg-2';
    const bgColor = sectionIndex % 2 === 0 ? CATALOG_LIGHT_BG : CATALOG_DARK_BG;
    const collectionTitle = escapeHtml(category.collection_title || 'Каталог');
    const title = escapeHtml(category.title);
    const items = products.length
      ? products.map(productCard).join('')
      : '<div class="col-12 text-center mbr-fonts-style display-7">В этой категории пока нет товаров.</div>';
    return `
      <section class="features3 cid-uXGo4y7p2b ${bgClass}" data-bs-version="5.1" id="${sectionId}" style="background: ${bgColor} !important; background-color: ${bgColor} !important; color: #000000 !important;">
        <div class="container">
          <div class="mbr-section-head" style="color: #000000 !important;">
            <h2 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2"><strong>${collectionTitle}<br></strong></h2>
            <h3 class="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-2">${title}<br><br></h3>
          </div>
          <div class="row mt-4" data-products-category="${escapeHtml(category.category_key)}" style="color: #000000 !important;">${items}</div>
        </div>
      </section>`;
  }


  function forceCatalogColorsV9() {
    const sections = document.querySelectorAll('#dynamic-catalog-sections section');
    sections.forEach(function (section, index) {
      const color = index % 2 === 0 ? CATALOG_LIGHT_BG : CATALOG_DARK_BG;
      section.style.setProperty('background', color, 'important');
      section.style.setProperty('background-color', color, 'important');
      section.style.setProperty('color', '#000000', 'important');
      section.querySelectorAll('*:not(a.item-btn):not(a.item-btn *)').forEach(function (el) {
        el.style.setProperty('color', '#000000', 'important');
      });
      section.querySelectorAll('a.item-btn, a.item-btn *').forEach(function (el) {
        el.style.setProperty('color', '#ffffff', 'important');
      });
    });
  }

  function keepForcingCatalogColorsV9() {
    forceCatalogColorsV9();
    const area = document.getElementById('dynamic-catalog-sections');
    if (!area || area.dataset.colorObserverV9 === '1') return;
    area.dataset.colorObserverV9 = '1';
    const observer = new MutationObserver(function () { forceCatalogColorsV9(); });
    observer.observe(area, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }

  function buildDynamicArea() {
    const categoryLinks = document.getElementById('features013-a');
    const footer = document.getElementById('footer3-1');

    let area = document.getElementById('dynamic-catalog-sections');
    if (!area) {
      area = document.createElement('div');
      area.id = 'dynamic-catalog-sections';
    }

    // ВАЖНО: удаляем старые статические секции товаров Mobirise.
    // Раньше они оставались на странице, поэтому пользователь видел старые фоны,
    // а новые динамические секции могли быть ниже/выше и казалось, что изменения не работают.
    const knownOldIds = new Set([
      'features3-c', 'polo', 'futbolki', 'features3-d', 'features3-m', 'features3-l',
      'features3-g', 'features3-h', 'features3-i', 'features3-j', 'features3-k', 'features3-1m'
    ]);

    Array.from(document.querySelectorAll('section')).forEach(function (section) {
      if (section.id === 'dynamic-catalog-sections') return;
      if (section.closest && section.closest('#dynamic-catalog-sections')) return;
      if (section.querySelector('[data-products-category]') || knownOldIds.has(section.id)) {
        section.remove();
      }
    });

    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(area, footer);
    } else if (categoryLinks && categoryLinks.parentNode) {
      categoryLinks.parentNode.insertBefore(area, categoryLinks.nextSibling);
    } else {
      document.body.appendChild(area);
    }

    return area;
  }

  async function loadCatalog() {
    const categoryLinksRow = document.querySelector('#features013-a .row.mbr-section-content');
    const area = buildDynamicArea();
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ]);
      if (!categoriesRes.ok) throw new Error('Categories API returned ' + categoriesRes.status);
      if (!productsRes.ok) throw new Error('Products API returned ' + productsRes.status);
      const categories = await categoriesRes.json();
      const products = await productsRes.json();

      if (categoryLinksRow) {
        categoryLinksRow.innerHTML = categories.length
          ? categories.map(categoryCard).join('')
          : '<div class="col-12 text-center mbr-fonts-style display-7">Категории пока не созданы.</div>';
      }
      area.innerHTML = categories.map(function (category, index) {
        const categoryProducts = products.filter(function (p) { return p.category_key === category.category_key; });
        return categorySection(category, categoryProducts, index);
      }).join('');
      keepForcingCatalogColorsV9();
      bindWhatsAppButtons();
    } catch (error) {
      area.innerHTML = '<section class="features3"><div class="container"><div class="col-12 text-center mbr-fonts-style display-7">Не удалось загрузить каталог. Запустите сайт через <strong>python server.py</strong>, а не двойным кликом по HTML.</div></div></section>';
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindWhatsAppButtons();
    loadCatalog();
  });
})();
