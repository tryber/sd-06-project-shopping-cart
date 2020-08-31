const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=computador'
}

const url = apiInfo.api;

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
  return li;
}

function renderItem(arrayProducts) {
  arrayProducts.forEach(product => {
    const newItem = createProductItemElement(product)
    const section = document.querySelector('.items');
    section.appendChild(newItem);
  });
}

const getApi = () => {
  const endpoint = url;
  
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      console.log(object.results);
      const result = object.results;
      renderItem(result);
    });
}

window.onload = function onload() {
  getApi();
 };