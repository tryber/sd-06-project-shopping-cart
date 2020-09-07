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

async function sumTotalPrice() {
  const priceStringArray = setTimeout(() => Object.values(localStorage), 500);
  const priceArray = await priceStringArray.map(item => parseFloat(item));
  const totalPrice = await priceArray.reduce((acc, curr) => acc + curr);
  const pricePlace = document.querySelector('.total-price-tag');
  pricePlace.innerText = await `${totalPrice}`;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.parentNode.removeChild(cartItem);
  localStorage.removeItem(cartItem.id);
  sumTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const cartItemsList = document.querySelectorAll('.cart__item');
  const itemIndex = cartItemsList.length;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  const itemData = { id: sku, title: name, price: salePrice };
  console.log(JSON.stringify(itemData));
  localStorage.setItem(`0${itemIndex}`, JSON.stringify(itemData));

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

function createTotalPriceStructure() {
  const totalPriceDiv = document.querySelector('.total-price');
  totalPriceDiv.innerHTML = '';
  const priceLabel = document.createElement('h3');
  priceLabel.innerText = 'Preço total: ';
  priceLabel.className = 'total-price-label';
  const priceTag = document.createElement('p');
  priceTag.className = 'total-price-tag';
  totalPriceDiv.appendChild(priceLabel);
  totalPriceDiv.appendChild(priceTag);
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
  sumTotalPrice();
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
    const cartItems = Object.keys(localStorage).sort((a, b) => parseFloat(a) - parseFloat(b));
    const cartItemsData = cartItems.map(storageKey => JSON.parse(localStorage.getItem(storageKey)));
    localStorage.clear();
    cartItemsData.forEach((item) =>{
      const cartItemStored = createCartItemElement(item);
      cartListContainer.appendChild(cartItemStored);
    });
  }
}

function emptyCart() {
  const currentCart = document.querySelector('.cart__items');
  currentCart.innerHTML = '';
  localStorage.clear();
}

function handleEmptyCartClick() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
}

window.onload = function onload() {
  makeProductQuery('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  createTotalPriceStructure();
  loadPreviousCart();
  handleEmptyCartClick();
  sumTotalPrice();
};
