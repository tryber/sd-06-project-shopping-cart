// const fetch = require('node-fetch');
const api = 'https://api.mercadolibre.com/';
const endpoint = 'sites';
const siteId = 'MLB';
const resourse = 'search?q=';
const query = 'computador';

function makeQuery (url) {
  return new Promise((resolve, reject) => {
    if (url === `${api}${endpoint}/${siteId}/${resourse}${query}`) {
      const myObject = {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      };
      fetch(url)
        .then(response => response.json())
        .then(data => resolve(data));
    } else {
      reject(new Error('Endpoint not found'));
    }
  })
}

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

function logData() {
  const data = makeQuery('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolved => resolved['results'])
    .catch(err => console.log(err));
}

window.onload = function onload() { 
  const hey = logData();
};
