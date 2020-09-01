const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';


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

function createProductItemElement(item) {
  const section = document.createElement('section');
  const sectionItem = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', item.id));
  section.appendChild(createCustomElement('span', 'item__title', item.title));
  section.appendChild(createProductImageElement(item.thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sectionItem.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.addEventListener('click', () => event.remove());
}

function createCartItemElement(item) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${item.id} | NAME: ${item.title} | PRICE: $${item.price}`;
  const cartItems = document.querySelector('.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener(cartItems));
  return cartItems;
}

function fetchItems() {
  const query = url;
  fetch(query)
  .then(response => response.json())
  .then(response => response.results.forEach(object => createProductItemElement(object)));
}

function fetchCar(id) {
  const urlId = `https://api.mercadolibre.com/items/${id}`;
  fetch(urlId)
  .then(response => response.json())
  .then(response => createCartItemElement(response));
}

const addCar = () => {
  const itemAdd = document.querySelector('.items');
  itemAdd.addEventListener('click', (e) => {
    if (e.target.type === 'submit') {
      const item = e.target.parentNode;
      const id = item.querySelector('.item__sku').innerHTML;
      fetchCar(id);
    } else {
      console.log('erro');
    }
  });
};

const emptyCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const itemsCart = document.querySelectorAll('.cart__item');
    itemsCart.forEach(element => element.remove());
  });
};

window.onload = function onload() {
  fetchItems();
  addCar();
  emptyCart();
};
