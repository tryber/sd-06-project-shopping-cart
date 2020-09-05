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

function makeProductQuery(url) {
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => responseJson.results)
    .then((results) => createProductListing(results))
    .catch(() => new Error('Endpoint not found'));
}

function makeItemQuery(idToFetch) {
  fetch(`https://api.mercadolibre.com/items/${idToFetch}`)
    .then((response) => response.json())
    .then((result) => result);
}

function addItemToCart(event) {
  const itemId = event.target.parentNode.firstElementChild.innerText;
  const cartElement = document.querySelector('.cart__items');
  cartElement.appendChild(createCartItemElement({ id: 'MLB1341706310', title: 'o que for', price: 1399}));
  // makeItemQuery(itemId)
  //   .then(fetchedItem => alert('worked'));
}

function handleClickAddItem() {
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach(button => button.addEventListener('click', addItemToCart));
}

window.onload = function onload() {
  makeProductQuery('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  handleClickAddItem();
};
