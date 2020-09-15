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
};

function deleteChild() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(cartItem => cartItem.remove());
};

function cartItemClickListener() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', deleteChild);
};

function createCartItemElement(item) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${item.id} | NAME: ${item.title} | PRICE: $${item.price}`;
  const cartItems = document.querySelector('.cart__items').appendChild(li);
  return cartItems;
};

const fetchMlApiAddCart = (id) => {
  const urlApiCart = `https://api.mercadolibre.com/items/${id}`;
  return fetch(urlApiCart)
  .then(response => response.json())
  .then(response => createCartItemElement(response));
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createButton);
  createButton.addEventListener('dbclick', () => {
    fetchMlApiAddCart(id);
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function renderCart() {
  const getProduct = document.querySelector('.items');
  getProduct.addEventListener('click', (event) => {
    if (event.target.type === 'submit') {
      const item = event.target.parentNode;
      const id = item.querySelector('.item__sku').innerHTML;
      fetchMlApiAddCart(id);
    }
  });
}

const fetchMlApi = () => {
  const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(urlApi)
  .then(response => response.json())
  .then((response) => {
    response.results.forEach((result) => {
      const product = createProductItemElement(result);
      document.querySelector('.items').appendChild(product);
    });
  });
};

window.onload = function onload() {
  fetchMlApi();
  renderCart();
  cartItemClickListener();
};
