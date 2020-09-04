
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function getTotalValueOfCart() {
  const cart = document.querySelector('.cart__items');
  const cartItems = cart.childNodes;
  let itemsPrices = 0;
  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      itemsPrices += parseFloat(item.innerText.split('$')[1]);
    });
  }
  return itemsPrices;
}

async function updateTotalValueOfCart() {
  const totalValueOfCart = await getTotalValueOfCart();
  const totalValueField = document.querySelector('.total-price');
  totalValueField.innerText = totalValueOfCart;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function cartItemClickListener(event) {
  event.target.remove();
  const cartItemsField = document.querySelector('.cart__items');
  updateTotalValueOfCart();
  localStorage.setItem('cartItems', cartItemsField.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function showLoadingMessage() {
  const loadingElement = document.createElement('div');
  loadingElement.classList.add('loading');
  loadingElement.innerText = 'loading...';
  document.querySelector('.container').appendChild(loadingElement);
}

function hideLoadingMessage() {
  const loadingMessage = document.querySelector('.loading');
  document.querySelector('.container').removeChild(loadingMessage);
}

async function getListOfProducts() {
  showLoadingMessage();
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const jsonFormattedResponse = await response.json();
  const productsLists = jsonFormattedResponse.results;
  hideLoadingMessage();
  return productsLists;
}

async function mountCartItem(product) {
  showLoadingMessage();
  const productSku = getSkuFromProductItem(product);
  const url = `https://api.mercadolibre.com/items/${productSku}`;
  const response = await fetch(url);
  const itemInfo = await response.json();
  const cartItem = {
    sku: itemInfo.id,
    name: itemInfo.title,
    salePrice: itemInfo.price,
  };
  hideLoadingMessage();
  return cartItem;
}

async function addItemToCart(product) {
  const mountedCartItem = await mountCartItem(product);
  const cartItemsField = document.querySelector('.cart__items');
  const cartItemElement = createCartItemElement(mountedCartItem);
  cartItemsField.appendChild(cartItemElement);
  updateTotalValueOfCart();
  localStorage.setItem('cartItems', cartItemsField.innerHTML);
}

function emptyCart() {
  const cartItemsField = document.querySelector('.cart__items');
  while (cartItemsField.firstElementChild) {
    cartItemsField.firstElementChild.remove();
    updateTotalValueOfCart();
    localStorage.setItem('cartItems', cartItemsField.innerHTML);
  }
}

async function renderProducts() {
  const productsRetrieved = await getListOfProducts();
  const itemsField = document.querySelector('.items');
  productsRetrieved.forEach((element) => {
    const product = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const productElement = createProductItemElement(product);
    const addToCartButton = productElement.querySelector('.item__add');
    addToCartButton.addEventListener('click', () => addItemToCart(productElement));
    itemsField.appendChild(productElement);
  });
}

function showStoredCartItems() {
  storedCartItems = localStorage.getItem('cartItems');
  if (storedCartItems) {
    const cartItemsListElement = document.querySelector('.cart__items');
    cartItemsListElement.innerHTML = storedCartItems;
    cartItemsListElement.querySelectorAll('.cart__item')
      .forEach((cartItem) => {
        cartItem.addEventListener('click', cartItemClickListener);
      });
  }
}

function setupEventHandlers() {
  // Empty cart
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
}

window.onload = async function onload() {
  await renderProducts();
  showStoredCartItems();
  await getTotalValueOfCart();
  updateTotalValueOfCart();
  setupEventHandlers();
};
