function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

let cart = [];

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

function funcaoSeparadaSoPraTirarAComplexidadeDessaDesgracaDeCodeClimate(item) {
  let temp;
  for (let i = 0; i < cart.length; i += 1) {
    if (cart[i] === item) {
      temp = i;
    }
  }
  return temp;
}

function removeItem(item) {
  const temp = funcaoSeparadaSoPraTirarAComplexidadeDessaDesgracaDeCodeClimate(item);
  if (temp !== -1) {
    for (let j = temp; j < cart.length - 1; j += 1) {
      cart[j] = cart[j + 1];
      localCart[j] = localCart[j + 1];
    }
    cart[cart.length - 1] = null;
    localCart[localCart.length - 1] = null;
  }
}

async function getPriceFromSKU(sku) {
  const url = `https://api.mercadolibre.com/items/${sku}`;
  const result = await fetch(url);
  const dataSheet = await result.json();
  return dataSheet.price;
}

async function sumCart() {
  let sum = 0;
  let totalSum = [];
  for (let i = 0; i < localCart.length; i += 1) {
    if (localCart[i] !== null && localCart[i] !== '') {
      totalSum.push(getPriceFromSKU(localCart[i]));
    }
  }
  totalSum = await Promise.all(totalSum);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (totalSum.length !== 0) {
    sum = totalSum.reduce(reducer);
  }
  document.getElementById('total-price').innerText = sum;
}

function storeCart() {
  localStorage.removeItem('cart');
  const cartText = document.getElementById('cart').innerHTML;
  localStorage.setItem('cart', cartText);
  localStorage.setItem('cartIds', localCart);
  sumCart();
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
  cart = [];
  storeCart();
  localStorage.removeItem('cart');
}

// async function addProductFromSKU(sku) {
//   if (sku !== null && sku !== '') {
//     const url = `https://api.mercadolibre.com/items/${sku}`;
//     const result = await fetch(url);
//     const dataSheet = await result.json();
//     appendCart(createCartItemElement(dataSheet.id, dataSheet.title, dataSheet.price));
//     localCart.push(dataSheet.id);
//   }
//   await sumCart();
// }

function restoreCart() {
  let tempCart = [];
  if (localStorage.length) {
    tempCart = localStorage.getItem('cartIds').split(',');
  }
  tempCart.forEach((sku) => {
    if (sku !== null && sku !== '') {
      localCart.push(sku);
    }
  });
  // if (tempCart.length !== 0) {
  //   for (let i = 0; i < tempCart.length; i += 1) {
  //     addProductFromSKU(tempCart[i]);
  //   }
  // }
  document.getElementById('cart').innerHTML = localStorage.getItem('cart');
  sumCart();
}

window.onload = function onload() {
  getProducts();

  document.getElementById('empty').addEventListener('click', emptyCart);

  setTimeout(() => {
    document.getElementById('loading').remove();
  }, 500);

  restoreCart();
};
