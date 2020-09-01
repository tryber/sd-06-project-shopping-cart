const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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
function addtoStorage() {
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.Lista = list;
}
async function subValue(price) {
  const p = document.querySelector('.total-price');
  p.innerText = Math.round(((Number(p.innerText) - Number(price)) * 100)) / 100;
  localStorage.price = p.innerText;
}
async function sumValue(price) {
  const p = document.querySelector('.total-price');
  p.innerText = Math.round((Number(p.innerText) + price) * 100) / 100;
  localStorage.price = Number(p.innerText);
}
async function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  const price = event.target.innerText.split('$')[1];
  await subValue(price);
  ol.removeChild(event.target);
  addtoStorage();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function addCart(sku) {
  const newURL = `https://api.mercadolibre.com/items/${sku}`;
  fetch(newURL)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      const li = createCartItemElement({ sku: id, name: title, salePrice: price });
      document.querySelector('.cart__items').appendChild(li);
      addtoStorage();
      sumValue(price);
    });
}

function fetchProducts() {
  const container = document.querySelector('.container');
  const loading = document.querySelector('.loading');

  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        item.addEventListener('click', (event) => {
          if (event.target.className === 'item__add') {
            const ids = (getSkuFromProductItem(event.target.parentElement));
            addCart(ids);
          }
        });
        document.querySelector('.items').appendChild(item);
      });
      container.removeChild(loading);
    });
}
function loadStorage() {
  if (localStorage.Lista) {
    document.querySelector('.cart__items').innerHTML = localStorage.Lista;
    document.querySelectorAll('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    const price = Number(localStorage.price);
    document.querySelector('.total-price').innerText = price;
  }
}
function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    while (ol.firstChild) {
      ol.removeChild(ol.firstChild);
    }
    addtoStorage();
    document.querySelector('.total-price').innerText = '';
    localStorage.removeItem('price');
  });
}
window.onload = function onload() {
  loadStorage();
  fetchProducts();
  emptyCart();
};
