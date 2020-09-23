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

function saveLocalStorage() {
  const cartStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('myStorage', cartStorage);
}

let totalPrice = 0;
let gambiarra = 0;
function sub(subPrice) {
  if (gambiarra === 0) {
    const subt = subPrice.split('$')[1];
    totalPrice -= subt;
    document.querySelector('.total-price').innerHTML = totalPrice;
    gambiarra = 1;
  } else { gambiarra = 0; }
}

function cartItemClickListener(event) {
  const deleteItem = event.target;
  deleteItem.remove();
  localStorage.clear();
  saveLocalStorage();
  sub(event.target.innerHTML);
}

function recoverStorage() {
  const recoverItemStorage = localStorage.getItem('myStorage');
  document.querySelector('.cart__items').innerHTML = recoverItemStorage;
  document.querySelector('.cart__items').addEventListener('click', cartItemClickListener);
}


function sum(priceItem) {
  totalPrice += priceItem;
  document.querySelector('.total-price').innerHTML = totalPrice;
}
// .parseFloat e .toFixed(2)

function deleteChild() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(cartItem => cartItem.remove());
  localStorage.clear();
}

function cartButtonClickListener() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', deleteChild);
}

function createCartItemElement(item) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${item.id} | NAME: ${item.title} | PRICE: $${item.price}`;
  const cartItems = document.querySelector('.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  sum(item.price);
  return cartItems;
}

const fetchMlApiAddCart = (id) => {
  const urlApiCart = `https://api.mercadolibre.com/items/${id}`;
  fetch(urlApiCart)
  .then(response => response.json())
  .then((response) => {
    createCartItemElement(response);
    saveLocalStorage();
  });
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createButton);
  createButton.addEventListener('click', () => {
    fetchMlApiAddCart(id);
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function killLoading() {
  const kill = document.querySelector('.loading');
  kill.remove();
}

function elementLoading() {
  const h1Load = document.createElement('h1');
  h1Load.className = 'loading';
  h1Load.innerText = 'loading...';
  document.body.appendChild(h1Load);
}
const fetchMlApi = () => {
  elementLoading();
  const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(urlApi)
  .then(response => response.json())
  .then((response) => {
    response.results.forEach((result) => {
      const product = createProductItemElement(result);
      document.querySelector('.items').appendChild(product);
    });
    killLoading();
  });
};

window.onload = function onload() {
  fetchMlApi();
  recoverStorage();
  cartButtonClickListener();
};
