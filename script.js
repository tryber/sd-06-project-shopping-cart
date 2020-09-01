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

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const urlSearch = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

// Requisito 2
const getItem = () => {
  const target = event.target;
  const parentTarget = target.parentElement;
  const firstChild = parentTarget.firstChild.innerText;
  const loading = document.querySelector('#loading');
  loading.innerHTML = 'loading...';
  loading.classList.add('loading');
  setTimeout(function () {
    fetch(`https://api.mercadolibre.com/items/${firstChild}`)
    .then(response => response.json())
    .then((item) => {
      const sku = item.id;
      const name = item.title;
      const salePrice = item.price;
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement({ sku, name, salePrice }));
      loading.innerHTML = '';
      loading.classList.remove('loading');
    });
  }, 1000);
};

// Requisito 1
const fetchUrl = () => {
  fetch(urlSearch)
    .then(response => response.json())
    .then((object) => {
      const objectResult = object.results;
      objectResult.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
        const items = document.querySelector('.items').lastChild;
        items.lastChild.addEventListener('click', getItem);
      });
    });
};

// Requisito 6
const emptyList = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cart = document.querySelector('.cart__items');
    while (cart.firstChild) {
      cart.removeChild(cart.firstChild);
    }
  });
};

// Requisito 5

window.onload = function onload() {
  fetchUrl();
  emptyList();
};
