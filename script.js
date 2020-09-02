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

function savingStorage() {
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.myList = list;
}

async function subPrice(price) {
  const prodPrice = document.querySelector('.total-price');
  prodPrice.innerText = Math.round(((Number(prodPrice.innerText) - Number(price)) * 100)) / 100;
  localStorage.price = prodPrice.innerText;
}
async function sumPrice(price) {
  const prodPrice = document.querySelector('.total-price');
  prodPrice.innerText = Math.round((Number(prodPrice.innerText) + price) * 100) / 100;
  localStorage.price = Number(prodPrice.innerText);
}

async function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  const price = event.target.innerText.split('$')[1];
  await subPrice(price);
  ol.removeChild(event.target);
  savingStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function includeInCart(sku) {
  const URL2 = `https://api.mercadolibre.com/items/${sku}`;
  fetch(URL2)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      const li = createCartItemElement({ sku: id, name: title, salePrice: price });
      document.querySelector('.cart__items').appendChild(li);
      savingStorage();
      sumPrice(price);
    });
}

function upStorage() {
  if (localStorage.myList) {
    document.querySelector('.cart__items').innerHTML = localStorage.myList;
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
    savingStorage();
    document.querySelector('.total-price').innerText = '';
    localStorage.removeItem('price');
  });
}

function ProductsfromML() {
  const container = document.querySelector('.container');
  const loading = document.querySelector('.loading');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        item.addEventListener('click', (event) => {
          if (event.target.className === 'item__add') {
            const ids = (getSkuFromProductItem(event.target.parentElement));
            includeInCart(ids);
          }
        });
        document.querySelector('.items').appendChild(item);
      });
      container.removeChild(loading);
    });
}

window.onload = function onload() {
  upStorage();
  emptyCart();
  ProductsfromML();
};
