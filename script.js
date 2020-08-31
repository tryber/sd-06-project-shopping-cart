const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: '$computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;
const container = document.querySelector('.container');
const cartList = document.querySelector('.cart__items');
const clearButton = document.querySelector('.empty-cart');
const cartSection = document.querySelector('.cart');
let totalPrice = 0;

if (localStorage.list !== undefined) {
  cartList.innerHTML = localStorage.list;
}

function saveToStorage() {
  localStorage.setItem('list', cartList.innerHTML);
}

async function updateTotalPrice(price = 0) {
  const total = document.querySelector('.total');
  total.innerHTML = price;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const loading = document.createElement('div');
  loading.classList.add('loading');
  loading.innerHTML = 'loading...';
  container.appendChild(loading);

  fetch(url)
    .then(response => response.json())
    .then(object => object.results)
    .then((array) => {
      const sectionItems = document.querySelector('.items');

      array.forEach(({ id, title, thumbnail }) => (
        sectionItems
          .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }))
      ));
    })
    .finally(() => container.removeChild(loading));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function findItemById(elementId) {
  fetch(url)
    .then(response => response.json())
    .then(object => object.results.find(item => item.id.includes(elementId)))
    .then(({ id, title, price }) => {
      cartList.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
      totalPrice += price;
      await updateTotalPrice(totalPrice);
    })
    .finally(() => {
      saveToStorage();
    });
}

container.addEventListener('click', (e) => {
  if (e.target.classList.contains('item__add')) {
    const idElement = e.target.parentNode.firstChild.innerHTML;
    findItemById(idElement);
  }
});

cartList.addEventListener('click', (e) => {
  const element = e.target;
  if (element.tagName === 'LI') {
    cartList.removeChild(element);
  }
});

clearButton.onclick = () => {
  document.querySelectorAll('li').forEach(item => cartList.removeChild(item));
  totalPrice = 0;
  updateTotalPrice(totalPrice);
  saveToStorage();
};

function totalPriceHandle() {
  const total = document.createElement('span');
  total.classList.add('total');
  total.innerHTML = 0;
  document.querySelector('.total').appendChild(total);
}

window.onload = function onload() {
  cartItemClickListener();
  totalPriceHandle();
};
