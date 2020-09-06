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

function lStorage() {
  const localStorageItem = document.querySelector('.cart__items').innerHTML;
  // console.log(X);
  localStorage.items = localStorageItem;
  return localStorage.items;
}

async function totalValue() {
  function toBeAssync() {
    console.log(lStorage());
    const cartItems = lStorage();
    console.log(cartItems);
    const separators = ['$', '<'];
    console.log('oi');
    const splittedItem = cartItems.split(new RegExp(`([${separators.join('')}])`));
    let value = 0;
    for (let x = 0; 4 + (6 * x) < splittedItem.length; x += 1) {
      contador = 4 + (6 * x);
      value += parseFloat(splittedItem[contador]);
    }
    finalValue = value;
    const valueHTML = document.querySelector('.value');
    valueHTML.innerHTML = `Preço total: $${finalValue}`;
    console.log('oi');
  }

  await setTimeout(toBeAssync(), 100);
}

function cartItemClickListener(event) {
  const selectedItem = event.target;
  const fatherOfProductToClean = document.querySelector('.cart__items');
  fatherOfProductToClean.removeChild(selectedItem);
  lStorage();
  totalValue();
}

function keepItens() {
  if (localStorage.items) {
    document.querySelector('.cart__items').innerHTML = localStorage.items;
  }
  document.querySelectorAll('.cart__item').forEach(element => element.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sendItemtoCart = (product) => {
  const { id: sku, title: name, price: salePrice } = product;
  console.log(product);
  const itemToCart = createCartItemElement({ sku, name, salePrice });
  console.log(itemToCart);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(itemToCart);
  lStorage();
  totalValue();
};

const computerObjectSearch = (inPutId) => {
  const productID = inPutId;
  console.log(productID);
  endpoint = `https://api.mercadolibre.com/items/${productID}`;
  console.log(endpoint);
  return fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      console.log(object);
      sendItemtoCart(object);
    });
};

const objectDetails = (productsArray) => {
  productsArray.forEach((elements) => {
    const section = document.querySelector('.items');
    const eachProductItem = createProductItemElement(elements);
    section.appendChild(eachProductItem);
    // console.log(eachProductItem);
    eachProductItem.lastChild.addEventListener('click', function () {
      // const { id: sku } = eachProductItem;
      // const idToSend = eachProductItem.results.sku;
      const idToSend = eachProductItem.firstChild.innerText;
      console.log(idToSend);
      computerObjectSearch(idToSend);
    });
  });
};

const itemSearch = () => {
  endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const itemSelector = document.querySelector('.items');
  const childH1 = document.createElement('h1');
  childH1.className = 'loading';
  childH1.innerHTML = 'loading...';
  itemSelector.appendChild(childH1);
  return fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      itemSelector.innerHTML = '';
      // console.log(object);
      objectDetails(object.results);
    });
};

const cleanCart = (event) => {
  const cleanFather = document.querySelector('.cart__items');
  cleanFather.innerHTML = '';
  lStorage();
  totalValue();
};

const setupCleanEvent = () => {
  cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', cleanCart);
};

window.onload = function onload() {
  itemSearch();
  setupCleanEvent();
  keepItens();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
