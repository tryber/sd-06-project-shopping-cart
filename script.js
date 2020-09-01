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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = sku;
  return li;
}

const appendItem = (item) => {
  const createDisplay = document.querySelector('.items');
  createDisplay.appendChild(item);
  item.addEventListener('click', (event) => {
    const getSku = event.currentTarget.firstChild.innerText
    fetchToChart(getSku);
  });
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

const appendItemToChart = (element) => {
  const toChart = document.querySelector('.cart__items');
  toChart.appendChild(element);
};

const fetchToChart = (skuName) => {
  const url = 'https://api.mercadolibre.com/items/';
  fetch(`${url}${skuName}`)
  .then(resolve => resolve.json())
  .then((data) => {
    appendItemToChart(createCartItemElement(data));
  });
};

window.onload = function onload() {
  fetchDisplay();
};
