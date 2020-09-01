const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=computador',
};

const url = apiInfo.api;

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

function setLocalStorage() {
  const storageItems = document.querySelector('.cart__items').innerHTML;
  const storageSpan = document.querySelector('.total-price').innerHTML;
  localStorage.cartShop = storageItems;
  localStorage.totalPrice = storageSpan;
}

function getTotalPrice(price) {
  const span = document.querySelector('.total-price');
  const totalPrice = Math.round((Number(span.innerText) + price) * 100) / 100;
  span.innerText = totalPrice;
}

async function cartItemClickListener(event) {
  const selectedItem = event.target;
  const priceItem = Number(event.path[0].attributes[1].nodeValue);
  const ol = document.querySelector('.cart__items');
  ol.removeChild(selectedItem);
  await getTotalPrice(-priceItem);
  setLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.salePrice = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemClickListener(event) {
  const itemId = event.path[1].childNodes[0].innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const cartItem = createCartItemElement(object);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(cartItem).addEventListener('click', cartItemClickListener);
      getTotalPrice(object.price);
      setLocalStorage();
    });
}

function renderItem(arrayProducts) {
  arrayProducts.forEach((product) => {
    const newItem = createProductItemElement(product);
    newItem.addEventListener('click', itemClickListener);
    const section = document.querySelector('.items');
    section.appendChild(newItem);
  });
}

const getApi = () => {
  const endpoint = url;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const result = object.results;
      renderItem(result);
    });
};

function loadStorage() {
  if (localStorage.cartShop) {
    document.querySelector('.cart__items').innerHTML = localStorage.cartShop;
    document.querySelectorAll('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    document.querySelector('.total-price').innerHTML = localStorage.totalPrice;
  }
}

function clearCart() {
  const ol = document.querySelector('.cart__items');
  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
    document.querySelector('.total-price').innerText = 0;
    setLocalStorage();
  }
}

window.onload = function onload() {
  getApi();
  loadStorage();
  const clearAll = document.getElementById('clear-btn');
  clearAll.addEventListener('click', clearCart);
};
