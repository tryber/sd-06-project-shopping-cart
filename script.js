
function loadText() {
  const pText = document.createElement('span');
  const containerText = document.querySelector('.container');
  pText.className = 'loading';
  pText.innerHTML = 'loading...';
  containerText.appendChild(pText);
}
function saveOrDelete() {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('Item', ol.innerHTML);
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
function sumPrices() {
  const carts = document.querySelectorAll('.cart__item');
  let sum = 0;
  carts.forEach((item) => {
    const cart = item.innerHTML;
    const value = parseFloat(cart.split('$')[1]);
    sum += value;
  });
  return localStorage.setItem('totalPrices', sum);
}
function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  const ol = document.querySelector('.cart__items');
  ol.removeChild(item);
  saveOrDelete();
  sumPrices();
  const pagar = document.querySelector('.total-price');
  pagar.innerHTML = (`Total a pagar: ${localStorage.getItem('totalPrices')}`);
}
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  saveOrDelete();
  sumPrices();
  const pagar = document.querySelector('.total-price');
  pagar.innerHTML = (`Total a pagar: ${localStorage.getItem('totalPrices')}`);
  return li;
}
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const gallery = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const halfUrl = 'https://api.mercadolibre.com/items/';
    const item = id;
    const url = `${halfUrl}${item}`;
    fetch(url)
    .then(response => response.json())
    .then(json => createCartItemElement(json));
  });
  gallery.appendChild(section);
  return section;
}
function urlItemOnload() {
  loadText();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .then((json) => {
      document.querySelector('.container').removeChild(document.querySelector('.loading'));
      json.results.forEach(ele => createProductItemElement(ele));
    });
}
function cleanAll() {
  const ol = document.querySelector('.cart__items');
  const btnClean = document.querySelector('.empty-cart');
  const pagar = document.querySelector('.total-price');
  btnClean.addEventListener('click', () => {
    ol.innerHTML = '';
    pagar.innerHTML = '';
  });
}
/* function sumPrices() {
  const carts = document.querySelectorAll('.cart__item');
  let sum = 0;
  carts.forEach((item) => {
    const cart = item.innerHTML;
    const value = parseFloat(cart.split('$')[1]);
    sum += value;
  });
  return localStorage.setItem('totalPrices', sum);
} */
window.onload = function onload() {
  urlItemOnload();
  if (localStorage.Item) {
    document.querySelector('.cart__items').innerHTML = localStorage.Item;
    const btnClear = document.querySelector('.cart__items');
    btnClear.addEventListener('click', (event) => {
      const escolhido = event.target;
      const ol = document.querySelector('.cart__items');
      ol.removeChild(escolhido);
      localStorage.removeItem('Item');
    });
  }
  cleanAll();
};
