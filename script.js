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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createButton);
  createButton.addEventListener('click', () => {
    fetchMlApiAddCart(id);
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {}

function createCartItemElement({ id, title, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchMlApi = () => {
  const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(urlApi)
  .then(response => response.json())
  .then((response) => {
    response.results.forEach((result) => {
      const product = createProductItemElement(result);
      document.querySelector('.items').appendChild(product);
    })
  })
};

const fetchMlApiAddCart = id => {  
  const urlApiCart = `https://api.mercadolibre.com/items/${id}`;
  return fetch(urlApiCart)
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
  })
};

window.onload = function onload() {
  fetchMlApi();
};
