// API URLS
const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const URL_ITEM = 'https://api.mercadolibre.com/items/';

// FUNCTION TO MAKE REQUEST TO API
function apiRequest(url, query, type, callback) {
  const loadingMsg = document.createElement('span');
  const title = document.querySelector('.cart__title');
  loadingMsg.innerHTML = 'loading...';
  loadingMsg.className = 'loading';
  loadingMsg.style.margin = '1%';
  loadingMsg.style.color = 'orange';
  title.appendChild(loadingMsg);
  const completeUrl = url + query;
  if (type === 'products') {
    fetch(completeUrl)
      .then(response => response.json())
        .then(json => json.results)
          .then((r) => {
            title.removeChild(loadingMsg);
            callback(r);
          });
  } else {
    fetch(completeUrl)
    .then(response => response.json())
        .then((r) => {
          title.removeChild(loadingMsg);
          callback(r);
        });
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// CALCULATE TOTAL PRICE
async function calculateTotalPrice(price) {
  if (!localStorage.total) {
    localStorage.total = price;
  } else {
    localStorage.total = parseFloat(localStorage.total) + price;
  }
  const totalPriceSection = document.querySelector('.total-price');
  totalPriceSection.innerHTML = localStorage.total;
}

// SAVE CART ON LOCALSTORAGE
function saveOnLocalStorage() {
  const itemsOnCart = document.querySelector('.cart__items');
  localStorage.cartItems = itemsOnCart.innerHTML;
}

function cartItemClickListener(event) {
  const cartSection = document.querySelector('.cart__items');
  cartSection.removeChild(event.target);
  const priceToRemove = -parseFloat(event.target.innerHTML.split('PRICE: $')[1]);
  calculateTotalPrice(priceToRemove);
  saveOnLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ADD ITEM TO CART
function addItemOnCart(event) {
  const skuToQuery = getSkuFromProductItem(event.target.parentElement);
  const getProductInfosAndCreateCartItem = (productInfos) => {
    const cartSection = document.querySelector('.cart__items');
    const item = createCartItemElement(productInfos);
    item.addEventListener('click', cartItemClickListener);
    cartSection.appendChild(item);
    calculateTotalPrice(productInfos.price);
    saveOnLocalStorage();
  };
  apiRequest(URL_ITEM, skuToQuery, 'item', getProductInfosAndCreateCartItem);
}

// REMOVE ALL CART ITEMS
function cleanCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = '';
  localStorage.cartItems = '';
  localStorage.total = 0;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addItemOnCart);
  section.appendChild(button);

  return section;
}

// ADD PRODUCTS ON PAGE
function addProductsOnPage(products) {
  const section = document.querySelector('.items');
  products.forEach(product => section.appendChild(createProductItemElement(product)));
}

// LOAD FROM LOCALSTORAGE
function loadFromLocalStorage() {
  // LOAD TOTAL PRICE
  const totalPriceSection = document.querySelector('.total-price');
  totalPriceSection.innerHTML = localStorage.total;

  // LOAD ITEMS
  const itemsOnCart = document.querySelector('.cart__items');
  itemsOnCart.innerHTML = localStorage.cartItems;
  itemsOnCart.childNodes.forEach(item => item.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  apiRequest(URL, 'computador', 'products', addProductsOnPage);
  if (localStorage.cartItems) loadFromLocalStorage();
  const buttonCleanCart = document.querySelector('.empty-cart');
  buttonCleanCart.addEventListener('click', cleanCart);
};
