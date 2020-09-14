function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const cart = [];

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function appendCart(product) {
  document.getElementById('cart').appendChild(product);
}

let localCart = [];

function removeItem(item) {
  for (let i = 0; i < cart.length; i += 1) {
    if (item === cart[i]) {
      for (let j = i; j < cart.length - 1; j += 1) {
        cart[j] = cart[j + 1];
        localCart[j] = localCart[j + 1];
      }
      cart[cart.length - 1] = null;
      localCart[localCart.length - 1] = null;
    }
  }
}

function storeCart() {
  localStorage.removeItem('cart');
  localStorage.setItem('cart', localCart);
}

function cartItemClickListener(event) {
  document.getElementById('cart').removeChild(event.target);
  removeItem(event.target);
  storeCart();
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cart.push(li);
  return li;
}

async function addProductToCart(item) {
  sku = getSkuFromProductItem(item.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${sku}`;
  const result = await fetch(url);
  const dataSheet = await result.json();
  appendCart(createCartItemElement(dataSheet.id, dataSheet.title, dataSheet.price));
  localCart.push(dataSheet.id);
  storeCart();
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addProductToCart);
  section.appendChild(button);

  return section;
}

function appendProduct(product) {
  const itemsList = document.getElementById('items');
  itemsList.appendChild(product);
}

async function getProducts() {
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataSheet = await result.json();
  const items = dataSheet.results;
  items.forEach((product) => {
    appendProduct(createProductItemElement(product.id, product.title, product.thumbnail));
  });
}

function emptyCart() {
  const list = document.getElementById('cart');
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  localCart = [];
  localStorage.removeItem('cart');
}

async function addProductFromSKU(sku) {
  if (sku !== null && sku !== '') {
    const url = `https://api.mercadolibre.com/items/${sku}`;
    const result = await fetch(url);
    const dataSheet = await result.json();
    appendCart(createCartItemElement(dataSheet.id, dataSheet.title, dataSheet.price));
    localCart.push(dataSheet.id);
  }
}

function restoreCart() {
  let tempCart = [];
  if (localStorage.length) {
    tempCart = localStorage.getItem('cart').split(',');
  }
  if (tempCart.length !== 0) {
    for (let i = 0; i < tempCart.length; i += 1) {
      addProductFromSKU(tempCart[i]);
    }
  }
}

window.onload = function onload() {
  getProducts();

  document.getElementById('empty').addEventListener('click', emptyCart);

  setTimeout(() => {
    document.getElementById('loading').remove();
  }, 500);

  restoreCart();
};
