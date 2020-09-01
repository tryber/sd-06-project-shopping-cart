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

function saveCurrentList() {
  const cartList = document.querySelector('.cart__items');
  const listSaver = cartList.innerHTML;
  localStorage.setItem('SavedList', listSaver);
}

function loadingMessage(status) {
  const loadingDisplay = document.querySelector('.loading');
  if (status === 'on') {
    loadingDisplay.innerText = 'loading...';
  } else {
    loadingDisplay.innerText = '';
  }
}

async function totalValueUpdater() {
  loadingMessage('on');
  const cartList = document.querySelector('.cart__items');
  const cartItemsValues = [];
  for (let x = cartList.firstElementChild; x; x = x.nextElementSibling) {
    const currentItemText = x.innerText;
    const currentItemValue = currentItemText.split(' | ')[2].substr(8);
    cartItemsValues.push(currentItemValue);
  }
  const totalValue = await cartItemsValues
    .reduce((acc, curr) => {
      const formattedCurrentNumber = parseFloat(curr);
      return acc + formattedCurrentNumber;
    }, 0);
  const totalValueDisplay = document.querySelector('.total-price');
  totalValueDisplay.innerText = await totalValue;
  loadingMessage('off');
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  saveCurrentList();
  totalValueUpdater();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemList() {
  loadingMessage('on');
  const apiList = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(apiList).then(response => response.json()).then((data) => {
    data.results.forEach((computer) => {
      const itemList = document.querySelector('.items');
      itemList.appendChild(createProductItemElement(computer));
    });
  }).then(() => loadingMessage('off'));
}

async function fetchItem(itemID) {
  loadingMessage('on');
  const apiItem = `https://api.mercadolibre.com/items/${itemID}`;
  const response = await (await fetch(apiItem)).json();
  loadingMessage('off');
  return response;
}

function addItemToCart(eventElement) {
  if (eventElement.className === 'item__add') {
    const selectedItem = eventElement.parentNode;
    const itemID = getSkuFromProductItem(selectedItem);
    fetchItem(itemID)
      .then((data) => {
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(createCartItemElement(data));
        saveCurrentList();
        totalValueUpdater();
      });
  }
}

function cartItensHandler() {
  const savedList = localStorage.getItem('SavedList');
  if (savedList) {
    const cartList = document.querySelector('.cart__items');
    cartList.innerHTML = savedList;
    for (let x = cartList.firstElementChild; x; x = x.nextElementSibling) {
      x.addEventListener('click', cartItemClickListener);
    }
    totalValueUpdater();
  }
}

window.onload = function onload() {
  createItemList();
  cartItensHandler();

  const addButton = document.querySelector('.items');
  const clearCartButton = document.querySelector('.empty-cart');

  addButton.addEventListener('click', () => {
    const button = event.target;
    addItemToCart(button);
  });
  clearCartButton.addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    cartList.innerHTML = '';
    totalValueUpdater();
  });
};
