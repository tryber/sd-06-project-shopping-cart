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
  const cartItem = event.target;
  cartItem.parentNode.removeChild(cartItem);
  localStorage.removeItem(cartItem.id);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(sku, { id: sku, title: name, price: salePrice });

  return li;
}

function createProductListing(listOfProducts) {
  const productDisplay = document.querySelector('.items');
  listOfProducts
    .forEach(product => productDisplay.appendChild(createProductItemElement(product)));
}

async function makeItemQuery(idToFetch) {
  const response = await fetch(`https://api.mercadolibre.com/items/${idToFetch}`);
  const result = await response.json();
  return result;
}

function createElementAndAdd(requestedItem) {
  const cartList = document.querySelector('.cart__items');
  makeItemQuery(requestedItem)
    .then(fetchedItem => createCartItemElement(fetchedItem))
    .then(newCartItem => cartList.appendChild(newCartItem));
}

function addItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  createElementAndAdd(itemId);
}

function handleClickAddItem() {
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach(button => button.addEventListener('click', addItemToCart));
}

function makeProductQuery(url) {
  fetch(url)
    .then(response => response.json())
    .then(responseJson => createProductListing(responseJson.results))
    .then(() => handleClickAddItem())
    .catch(() => new Error('Endpoint not found'));
}

function loadPreviousCart() {
  const cartListContainer = document.querySelector('.cart__items');
  if (cartListContainer.innerHTML === '') {
    const cartItems = Object.keys(localStorage).reverse();
    localStorage.clear();
    cartItems.forEach(item => createElementAndAdd(item));
  }
}

window.onload = function onload() {
  makeProductQuery('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  loadPreviousCart();
};
