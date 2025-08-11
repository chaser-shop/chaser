// main.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('catalog-root');

  fetch('/catalog.json')
    .then(res => {
      if (!res.ok) throw new Error('Не вдалося завантажити catalog.json: ' + res.status);
      return res.json();
    })
    .then(data => {
      // Очікуємо структуру: { "categories": [ { "title": "", "items": [ ... ] }, ... ] }
      const categories = data.categories || [];
      if (!categories.length) {
        root.innerHTML = '<p style="color:#ccc">Каталог порожній — додайте смаки в адмінці (/admin).</p>';
        return;
      }

      categories.forEach(cat => {
        const section = document.createElement('div');
        section.className = 'section';

        const h2 = document.createElement('h2');
        h2.textContent = cat.title || 'Без назви';
        section.appendChild(h2);

        const grid = document.createElement('div');
        grid.className = 'grid';

        (cat.items || []).forEach(item => {
          const card = document.createElement('div');
          card.className = 'card';

          const img = document.createElement('img');
          img.src = item.image || '';
          img.alt = item.name || '';
          card.appendChild(img);

          const h3 = document.createElement('h3');
          h3.textContent = item.name || 'Назва';
          card.appendChild(h3);

          const p = document.createElement('p');
          p.textContent = item.desc || '';
          card.appendChild(p);

          const price = document.createElement('div');
          price.className = 'price';
          price.textContent = item.price || '';
          card.appendChild(price);

          grid.appendChild(card);
        });

        section.appendChild(grid);
        root.appendChild(section);
      });
    })
    .catch(err => {
      console.error(err);
      root.innerHTML = `<p style="color:#f66">Помилка завантаження каталогу. ${err.message}</p>`;
    });
});
