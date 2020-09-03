
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

function cartItemClickListener(event) {
  // event.parentNode.removeChild(event);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getListOfProducts() {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const jsonFormattedResponse = await response.json();
  const productsLists = jsonFormattedResponse.results;
  return productsLists;
}

async function mountCartItem(product) {
  const productSku = getSkuFromProductItem(product);
  const url = `https://api.mercadolibre.com/items/${productSku}`;
  const response = await fetch(url);
  const itemInfo = await response.json();
  const cartItem = {
    sku: itemInfo.id,
    name: itemInfo.title,
    salePrice: itemInfo.price,
  };
  return cartItem;
}

async function addItemToCart(product) {
  const mountedCartItem = await mountCartItem(product);
  const cartItemsField = document.querySelector('.cart__items');
  const cartItemElement = createCartItemElement(mountedCartItem);
  cartItemsField.appendChild(cartItemElement);
  // localStorage.setItem('cartItems', cartItemsField.innerHTML);
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
    // console.log(cartItemsListElement);
  }
}

function setupEventHandlers() {
  window.addEventListener('beforeunload', () => {
    const cartItemsElement = document.querySelector('.cart__items');
    localStorage.setItem('cartItems', cartItemsElement.innerHTML);
  });
}

window.onload = async function onload() {
  setupEventHandlers();
  await renderProducts();
  showStoredCartItems();
};
