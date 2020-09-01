/* eslint-disable no-restricted-globals */
/* eslint-disable arrow-parens */
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

function createItemList() {
  const apiList = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(apiList).then(response => response.json()).then((data) => {
    data.results.forEach((computer) => {
      const itemList = document.querySelector('.items');
      itemList.appendChild(createProductItemElement(computer));
    });
  });
}

function fetchItem(itemID) {
  const apiItem = `https://api.mercadolibre.com/items/${itemID}`;
  return fetch(apiItem).then(response => response.json());
}

function addItemToCart(eventElement) {
  if (eventElement.className === 'item__add') {
    const selectedItem = eventElement.parentNode;
    const itemID = getSkuFromProductItem(selectedItem);
    fetchItem(itemID)
      .then((data) => {
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(createCartItemElement(data));
      });
  }
}

window.onload = function onload() {
  createItemList();
  const addButton = document.querySelector('.items');
  addButton.addEventListener('click', () => {
    const button = event.target;
    addItemToCart(button);
  });
};
