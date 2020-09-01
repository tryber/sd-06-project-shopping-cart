/* eslint-disable arrow-parens */
let totalValue = 0;

if (localStorage.getItem('totalValue')) {
  totalValue = parseFloat(localStorage.getItem('totalValue'));
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const totalValueUpdate = async (value) => {
  const totalPrice = document.querySelector('.total-price');
  totalValue += value;
  const totalValueFormated = Math.round(totalValue * 100) / 100;
  totalPrice.innerText = totalValueFormated;
  localStorage.setItem('totalValue', totalValueFormated);
};

const clearCart = () => {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
  totalValue = 0;
  totalValueUpdate(0);
  localStorage.setItem('cartList', cartList.innerHTML);
};

function cartItemClickListener(event) {
  const itemText = event.target.innerText;
  const price = parseFloat(itemText.split('PRICE: $')[1]);
  totalValueUpdate(-price);
  event.target.parentElement.removeChild(event.target);
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartList', cartItems.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addItemToCart = (event) => {
  const apiUrl = 'https://api.mercadolibre.com/items/';
  const endpoint = getSkuFromProductItem(event.target.parentElement);
  const url = `${apiUrl}${endpoint}`;
  fetch(url)
    .then(response => response.json())
    .then(object => {
      const productObject = { sku: object.id, name: object.title, salePrice: object.price };
      const productItem = createCartItemElement(productObject);
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(productItem);
      totalValueUpdate(object.price);
      localStorage.setItem('cartList', cartItems.innerHTML);
    });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addItemToCart);
  }
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

const getProducts = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
    .then(response => response.json())
    .then(data => data.results)
    .then(results => results.forEach((result) => {
      const resultObj = { sku: result.id, name: result.title, image: result.thumbnail };
      const itemSection = document.querySelector('.items');
      itemSection.appendChild(createProductItemElement(resultObj));
    }));
};

window.onload = function onload() {
  getProducts();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cartList');
  for (let index = 0; index < cartList.children.length; index += 1) {
    cartList.children[index].addEventListener('click', cartItemClickListener);
  }
  totalValueUpdate(0);
};
