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

// function getSkuFromProductItemitem)
//  return item.querySelector('span.item__sku').innerText;
// }

function setLocalStorage() {
  const storageItems = document.querySelector('.cart__items').innerHTML;
  localStorage.cartShop = storageItems;
}

function cartItemClickListener(event) {
  const selectedItem = event.target;
  const ol = document.querySelector('.cart__items');
  ol.removeChild(selectedItem);
  setLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
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
  }
}

window.onload = function onload() {
  getApi();
  loadStorage();
};
