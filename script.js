const CART = document.querySelector('.cart__items');

const RETRIEVE_CART = function () { CART.innerHTML = localStorage.cart; };
const UPDATE_CART_STORAGE = function () { localStorage.cart = CART.innerHTML; };
const ADD_TOTAL_PRICE = function (amount) {
  if (document.querySelector('.total-price')) {
    document.querySelector('.total-price').remove();
  }
  const DIV = document.createElement('div');
  DIV.className = 'total-price';
  document.querySelector('.cart').appendChild(DIV);
  const DIV_PRICE = document.createElement('div');
  DIV_PRICE.innerHTML = amount;
  DIV.appendChild(DIV_PRICE);
};

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

const GET_CART_ITEMS = () => document.querySelectorAll('.cart__item');
const SUM_ITEMS = items => Object.keys(items).reduce((total, cartItem) =>
((total + ((Math.round(items[cartItem].dataset.price * 100)) / 100))), 0);

async function calcTotalCart() {
  const GET_CART_ITEMS_RESPONSE = await GET_CART_ITEMS();
  const SUM_ITEMS_RESPONSE = await SUM_ITEMS(GET_CART_ITEMS_RESPONSE);
  ADD_TOTAL_PRICE(SUM_ITEMS_RESPONSE);
}

function cartItemClickListener(item) {
  document.querySelector(`#${item.id}`).remove();
  UPDATE_CART_STORAGE();
  calcTotalCart();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.id = `${id}`;
  li.dataset.price = price;
  CART.appendChild(li);
  UPDATE_CART_STORAGE();
  calcTotalCart();
  return li;
}

document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelectorAll('.cart__item').forEach(e => cartItemClickListener(e));
});

const fetchItem = (productId) => {
  fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then(resp => resp.json())
    .then(itemObj => createCartItemElement(itemObj))
    .catch(error => console.error('Error: ', error));
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  document.querySelector('.items').appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  document.querySelector('.item__add').id = `${id}`;
  section.addEventListener('click', () => fetchItem(id));
  return section;
}

const ML_URL = () => {
  const CONTAINER = document.querySelector('.container');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(CONTAINER.appendChild(createCustomElement('h1', 'loading', 'loading...')))
    .then(resp => resp.json())
    .then(data => data.results.forEach(result => createProductItemElement(result)))
    .then(document.querySelector('.loading').remove())
    .catch(error => console.error('Error: ', error));
};

window.onload = function onload() {
  ML_URL();
  document.querySelector('.cart__items').addEventListener('click', e =>
    cartItemClickListener(e.target));
  if (localStorage.getItem('cart')) {
    RETRIEVE_CART();
  }
  calcTotalCart();
};
