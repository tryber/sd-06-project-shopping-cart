const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';


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

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const item = event.target;
  ol.removeChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const getId = sku;
    fetch(`https://api.mercadolibre.com/items/${getId}`)
    .then(response => response.json())
    .then((result) => {
      const createItem = createCartItemElement(result);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createItem);
    });
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchFunction = () => {
  const functionHTML = document.querySelector('.items');
  fetch(url)
  .then(response => response.json())
  .then(object => object.results)
  .then((result) => {
    result.forEach((item) => {
      const section = createProductItemElement(item);
      functionHTML.appendChild(section);
    });
  });
};

const clearButton = (createCartItemElement) => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    const item = document.querySelector('.cart__item')
    ol.innerHTML = '';
  });
};

window.onload = function onload() {
  fetchFunction();
  clearButton();
};
