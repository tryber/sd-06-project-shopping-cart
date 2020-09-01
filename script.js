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

function cartItemClickListener(event, sku) {
  localStorage.removeItem(sku);
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => {
    cartItemClickListener(event, sku);
  });
  localStorage.setItem(sku, li.innerHTML);
  return li;
}

function fetchItem(itemID) {
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(item => item.json())
    .then((item) => {
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(item));
    });
}

function addItemToCart(event, sku) {
  if (event.target.className === 'item__add') fetchItem(sku);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const loading = document.querySelector('.loading');
  loading.style.display = 'none';
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', event => addItemToCart(event, sku));
  return section;
}

function renderItemsProducts(arrayProducts) {
  return arrayProducts.forEach((product) => {
    const itemsContainer = document.querySelector('.items');
    itemsContainer.appendChild(createProductItemElement(product));
  });
}

function fetchListOfProducts() {
  const QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(products => products.json())
    .then(products => renderItemsProducts(products.results));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
}

function loadCartItem() {
  const localStorageKeys = Object.keys(localStorage);
  const localStorageValues = localStorageKeys.forEach((item) => {
    const li = document.createElement('li');
    const cartItems = document.querySelector('.cart__items');
    li.className = 'cart__item';
    li.innerHTML = localStorage.getItem(item);
    cartItems.appendChild(li);
  });
  return localStorageValues;
}

function loadMessageRequest() {
  const div = document.createElement('div');
  const items = document.querySelector('.items');
  div.className = 'loading';
  div.innerHTML = 'LOADING...';
  items.appendChild(div);
}

window.onload = function onload() {
  fetchListOfProducts();
  loadCartItem();
  loadMessageRequest();
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', clearCart);
};
