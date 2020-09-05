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

async function sumTotalPriceOfCart() {
  const totalPrice = document.querySelector('.total-price');
  const totalItems = await Object.values(localStorage);
  const totalOfCart = await totalItems.map(item => Number(item.split('$')[1])).reduce((total, price) => total + price, 0);
  totalPrice.innerHTML = `Preço total $ ${totalOfCart.toFixed(2)}`;
}

function cartItemClickListener(event, sku) {
  localStorage.removeItem(sku);
  sumTotalPriceOfCart();
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', event => cartItemClickListener(event, sku));
  localStorage.setItem(sku, li.innerHTML);
  return li;
}

function fetchItem(itemID) {
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(item => item.json())
    .then((item) => {
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(item));
      sumTotalPriceOfCart(item);
    });
}

function addItemToCart(event, sku) {
  if (event.target.className === 'item__add') fetchItem(sku);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
    .then((products) => {
      const loading = document.querySelector('.loading');
      loading.remove();
      return renderItemsProducts(products.results);
    });
}

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
  sumTotalPriceOfCart();
}

function localStorageCartItem() {
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
  localStorageCartItem();
  loadMessageRequest();
  sumTotalPriceOfCart();
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', clearCart);
};
