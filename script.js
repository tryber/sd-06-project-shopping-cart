function toLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_products', cartItems);
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

function totalPrice() {
  const spanTotalPrice = document.querySelector('.total-price');
  const shoppingCart = document.querySelector('.cart__items');
  const arrayPrices = [];
  let getTotalPrice = 0;

  const list = shoppingCart.children;
  for (let index = 0; index < list.length; index += 1) {
    const arrayItems = list[index].innerHTML.split(' ');
    const price = arrayItems[arrayItems.length - 1];
    const value = Number(price.substring(1));
    arrayPrices.push(value);
  }

  getTotalPrice = arrayPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  spanTotalPrice.innerHTML = ` Total $ ${getTotalPrice}`;
}

function cartItemClickListener(event) {
  event.target.remove();
  toLocalStorage();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemOnCLick() {
  fetch(`https://api.mercadolibre.com/items/${this.id}`)
  .then(response => response.json())
  .then((object) => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(createCartItemElement(object));
    toLocalStorage();
    totalPrice();
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', itemOnCLick);
  addButton.id = sku;
  section.appendChild(addButton);

  return section;
}

function removeItem() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  totalPrice();
}

function clearList() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', removeItem);
}

function renderProducts(arrayProducts) {
  arrayProducts.forEach((product) => {
    const eachItem = createProductItemElement(product);
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(eachItem);
  });
}

function fetchProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
  .then(response => response.json())
  .then((object) => {
    const results = object.results;
    renderProducts(results);
  });
}

window.onload = function onload() {
  fetchProducts();
  clearList();
  removeItem();
  const localStorageList = localStorage.getItem('cart_products');
  document.querySelector('.cart__items').innerHTML = localStorageList;
  totalPrice();
};
