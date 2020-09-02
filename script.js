async function getPrices(allItems) {
  const arrayPrices = [];
  allItems.forEach((item) => {
    const text = item.innerHTML;
    const price = parseFloat(text.substring(text.lastIndexOf("$") + 1));
    arrayPrices.push(price);
  });
  return arrayPrices;
}
async function sum() {
  const allItems = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total');
  const result = await getPrices(allItems)
    .then((total) => total.reduce((acc, curr) => acc + curr).toFixed(2));
  total.innerHTML = result;
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

function cartItemClickListener() {
  event.target.remove();
  localStorage.removeItem(event.target.id);
  sum();
}
let counter = 0;

const numbers = Object.keys(localStorage).map(number => parseInt(number, 10));
const orderKeys = numbers.sort((a, b) => a - b);
if (orderKeys.length !== 0) {
  counter = orderKeys[orderKeys.length - 1] + 1;
}

function createCartItemElement(number, { id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = number;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartFunction = () => {
  const itemId = event.target.parentNode.children[0].innerText;
  const urlItem = `https://api.mercadolibre.com/items/${itemId}`;
  const cart = document.querySelector('.cart__items');
  fetch(urlItem)
    .then(response => response.json())
    .then((object) => {
      cart.appendChild(createCartItemElement(counter, object));
      localStorage.setItem(counter, JSON.stringify(object));
      counter += 1;
      sum();
    });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addCartFunction);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  const items = document.querySelector('.items');
  const handleResults = (results) => {
    results.forEach((element) => {
      items.appendChild(createProductItemElement(element));
    });
  };
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then((response) => {
      items.removeChild(items.childNodes[0]);
      return response.json();
    })
    .then(object => handleResults(object.results));

  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerHTML = 'Loading...';
  items.appendChild(loading);
  const cart = document.querySelector('.cart__items');
  const getobject = num => JSON.parse(localStorage.getItem(num));
  orderKeys.forEach(key => cart.appendChild(createCartItemElement(key, getobject(key))));

  const buttonClean = document.querySelector('.empty-cart');
  buttonClean.addEventListener('click', () => {
    cart.innerHTML = '';
    localStorage.clear();
  });
  sum();
};


