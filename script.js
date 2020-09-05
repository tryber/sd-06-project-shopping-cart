// const fetch = require('node-fetch');
const api = 'https://api.mercadolibre.com/';
const endpoint = 'sites';
const siteId = 'MLB';
const resourse = 'search?q=';
const query = 'computador';

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductListing(listOfProducts) {
  const productDisplay = document.querySelector('.items');
  listOfProducts
    .forEach(product => productDisplay.appendChild(createProductItemElement(product)));
}

async function makeItemQuery(idToFetch) {
  const response = await fetch(`https://api.mercadolibre.com/items/${idToFetch}`);
  const result = await response.json();
  return result;
}

function addItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const cartElement = document.querySelector('.cart__items');
  makeItemQuery(itemId)
    .then((fetchedItem) => createCartItemElement(fetchedItem))
    .then((newCartItem) => cartElement.appendChild(newCartItem));
}

function handleClickAddItem() {
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach((button) => button.addEventListener('click', addItemToCart));
}

function makeProductQuery(url) {
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => createProductListing(responseJson.results))
    .then(() => handleClickAddItem())
    .catch(() => new Error('Endpoint not found'));
}

window.onload = function onload() {
  makeProductQuery('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};
