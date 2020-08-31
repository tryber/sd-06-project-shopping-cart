function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const appendItem = (item) => {
  const createDisplay = document.querySelector('.items');
  createDisplay.appendChild(item);
};

const fetchDisplay = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const itemSearch = 'computador';
  fetch(`${url}${itemSearch}`)
  .then(resolve => resolve.json())
  .then(data => data.results.forEach((element) => {
    appendItem(createProductItemElement(element));
  }));
};

const createItem = (element) => {
  //inside
}

const fetchProducts = () => {
  fetch('https://api.mercadolibre.com/items/$ItemID')
  .then(resolve => resolve.json())
  .then(data => data.results.forEach((element) => {
    createItem(createProductItemElement(element));
  }));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  fetchDisplay();
};
