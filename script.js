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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function appendCart(product) {
  const cart = document.getElementById('cart');
  cart.appendChild(product);
}

function cartItemClickListener(event) {
  document.getElementById('cart').removeChild(event.target);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToCart(item) {
  sku = getSkuFromProductItem(item.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${sku}`;
  const result = await fetch(url);
  const dataSheet = await result.json();
  appendCart(createCartItemElement(dataSheet.id, dataSheet.title, dataSheet.price));
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

window.onload = function onload() {
  getProducts();
};
