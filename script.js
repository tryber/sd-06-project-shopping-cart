function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// FETCH PROMISE

const apiSite = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const apiFetch = async () => {
  return fetch(apiSite)
    .then(function (response) {
      if (!response.ok) throw new Error('Erro de requisição');
      return response.json();
    })
    .then(function ({ results }) {
      results.forEach(function (v) {
        const prodIE = createProductItemElement({ sku: v.id, name: v.title, image: v.thumbnail });
        const itemInSe = document.querySelector('.items');
        itemInSe.appendChild(prodIE);
      });
    })
    .catch(function (Error) {
      console.error(Error);
    });
};

window.onload = async () => {
  await apiFetch();
};
// IE = ItemElement
// REFERENCIAS
// fetch
