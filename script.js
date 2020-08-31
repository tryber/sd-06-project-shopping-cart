/* eslint-disable arrow-parens */
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const clearCart = () => {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
};

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addItemToCart = (event) => {
  const apiUrl = 'https://api.mercadolibre.com/items/';
  const endpoint = getSkuFromProductItem(event.target.parentElement);
  const url = `${apiUrl}${endpoint}`;
  fetch(url)
    .then(response => response.json())
    .then(object => {
      const productObject = { sku: object.id, name: object.title, salePrice: object.price };
      const productItem = createCartItemElement(productObject);
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(productItem);
    });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addItemToCart);
  }
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

const getProducts = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
    .then(response => response.json())
    .then(data => data.results)
    .then(results => results.forEach((result) => {
      const resultObj = { sku: result.id, name: result.title, image: result.thumbnail };
      const itemSection = document.querySelector('.items');
      itemSection.appendChild(createProductItemElement(resultObj));
    }));
};

window.onload = function onload() {
  getProducts();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};
