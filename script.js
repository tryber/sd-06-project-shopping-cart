const saveItems = () => {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

function fetchCartFromStorage () {
  const storedCart = localStorage.getItem('cart');
  const cart = document.querySelector('.cart__items');
  if (storedCart === '') console.log('carrinho vazio');
  cart.innerHTML = storedCart;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener))
}

function cartItemClickListener(event) {
  const cartItem = event.target;
  const cart = document.querySelector('.cart__items');
  cart.removeChild(cartItem);
  saveItems();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  const cart = document.querySelector('.cart__items');
  cart.appendChild(li);
  saveItems();
  return li;
}

function addItemToCart() {
  const target = event.target;
  const parent = target.parentElement;
  const itemId = parent.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

  fetch(endpoint)
    .then(response => response.json())
    .then(object => createCartItemElement(object));
}

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const itemsDisplaySection = document.querySelector('.items');
  itemsDisplaySection.appendChild(section);

  section.addEventListener('click', addItemToCart);

  return section;
}

function fetchProducts(product) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;

  fetch(endpoint)
    .then(response => response.json())
    .then(object => object.results.forEach(item => createProductItemElement(item)));
}

window.onload = function onload() {
  fetchProducts('computador');
  fetchCartFromStorage();
};
