fetch('products.json')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('flavor-list');
        list.innerHTML = '';
        data.forEach(flavor => {
            const li = document.createElement('li');
            li.textContent = flavor;
            list.appendChild(li);
        });
    })
    .catch(error => console.error('Помилка завантаження:', error));
