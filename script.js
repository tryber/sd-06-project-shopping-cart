const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemApiUrl = 'https://api.mercadolibre.com/items/';

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

function storeCart() {
  const cartStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.storedCart = cartStorage;
}

function cartItemClickListener(event) {
  const product = event.target;
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(product);
  storeCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemEventListener() {
  const product = this.parentElement;
  const productSku = getSkuFromProductItem(product);
  const cartList = document.querySelector('.cart__items');
  const url = `${itemApiUrl}${productSku}`;

  fetch(url)
    .then(response => response.json())
    .then((productData) => {
      const productInfo = createCartItemElement(productData);

      cartList.appendChild(productInfo);
      storeCart();
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';
  addButton.addEventListener('click', createItemEventListener);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addButton);

  return section;
}

const fetchApi = (() => {
  const url = `${apiUrl}`;

  fetch(url)
    .then(response => response.json())
    .then((data) => {
      const itemsArray = data.results;
      const itemsSection = document.querySelector('.items');

      itemsArray.forEach((item) => {
        const newItem = createProductItemElement(item);
        itemsSection.appendChild(newItem);
      });
    });
});

function loadLocalStorage() {
  if (localStorage.storedCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.storedCart;
    document.querySelectorAll('li').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  };
}

window.onload = function onload() {
  fetchApi();
  loadLocalStorage();
};
