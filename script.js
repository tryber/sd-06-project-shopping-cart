const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
let urlId = 'https://api.mercadolibre.com/items/';


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

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/


function handleComputerObj(item) {
  const computerObj = {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  };
  return computerObj;
}

function handleCartItemObj(item) {
  const computerObj = {
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  };
  return computerObj;
}

function createLoadingH1() {
  const h1 = document.createElement('h1');
  h1.innerText = 'Loading...';
  h1.className = 'loading';
  console.log(h1);
  document.querySelector('.items').appendChild(h1);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  document.querySelector('.items').removeChild(loading);
}

function fetchComputers() {
  fetch(url)
    .then((response => response.json()))
    .then((object) => {
      removeLoading();
      object.results.forEach((computer) => {
        document
        .querySelector('.items')
        .appendChild(createProductItemElement(handleComputerObj(computer)));
      });
    });
}

function handleLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  const totalPrice = document.querySelector('.total-price').innerText;
  localStorage.clear();
  localStorage.setItem('cartItens', cartItems);
  localStorage.setItem('price', totalPrice);
}

function subtractCartItem(item) {
  let sum = parseFloat(document.querySelector('.total-price').innerText, 10);
  const itemPrice = parseFloat(item.innerText.split('$')[1], 10);
  sum -= itemPrice;
  return sum;
}

function subtractClickListener() {
  document.querySelector('.cart__items').addEventListener('click', function (event) {
    document.querySelector('.total-price').innerText = subtractCartItem(event.target);
    handleLocalStorage();
  });
}

function cartItemClickListener() {
  event.target.remove();
  // Pq não posso usar removeChild após carregar o storage se a estrutura do HTML é a mesma.
  handleLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/*
function fetchComputersId(newUrlId) {
  if (newUrlId) {
    fetch(newUrlId)
    .then((response => response.json()))
    .then((object) => {
      document
      .querySelector('.cart__items')
      .appendChild(createCartItemElement(handleCartItemObj(object)));
      handleLocalStorage();
    });
  }
}
*/

function sumEachCartItem(item) {
  let sum = parseFloat(document.querySelector('.total-price').innerText, 10);
  sum += item.price;
  return sum;
}

async function fetchComputersId2(newUrlId) {
  if (newUrlId) {
    const response = await fetch(newUrlId);
    const object = await response.json();
    document.querySelector('.cart__items').appendChild(createCartItemElement(handleCartItemObj(object)));
    document.querySelector('.total-price').innerText = sumEachCartItem(object);
    handleLocalStorage();
  }
}


function getItemId() {
  const itemsSection = document.querySelector('.items');
  itemsSection.addEventListener('click', function (event) {
    if (event.target.className === 'item__add') {
      const endpoint = event.target.parentNode.firstChild.innerText;
      urlId = `${urlId}${endpoint}`;
      fetchComputersId2(urlId);
      urlId = 'https://api.mercadolibre.com/items/';
    }
  });
}

function loadLocalStorage() {
  if (localStorage.length > 0) {
    const cartList = document.querySelector('.cart__items');
    cartList.addEventListener('click', cartItemClickListener);
    cartList.innerHTML = localStorage.getItem('cartItens');
    const fullPrice = document.querySelector('.total-price');
    fullPrice.innerText = localStorage.getItem('price');
  }
}

function clearShoppingCart() {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerText = '0';
}

function onClickClearShoppingCard() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', clearShoppingCart);
}

window.onload = function onload() {
  createLoadingH1();
  fetchComputers();
  getItemId();
  loadLocalStorage();
  onClickClearShoppingCard();
  fetchComputersId2();
  subtractClickListener();
};
