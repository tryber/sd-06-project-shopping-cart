const apiInfo = {
  url: 'https://api.mercadolibre.com/',
  products_endpoint: 'sites/MLB/search?q=',
  query: 'computador',
  item_endpoint: 'items/',
};

const urlOfProductsList = `${apiInfo.url}${apiInfo.products_endpoint}${apiInfo.query}`;
const urlOfProduct = `${apiInfo.url}${apiInfo.item_endpoint}`;

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

function handleProductClick(id) {
  fetch(urlOfProduct + id)
  .then(response => response.json())
  .then((object) => {
    // console.log(object);
    document.querySelector('.cart__items').appendChild(createCartItemElement(object));
  });
}

function handleProductList(list) {
  list.forEach((element) => {
    document.querySelector('.items').appendChild(createProductItemElement(element)).addEventListener('click', () => {
      handleProductClick(element.id);
    });
  });
}

function getProductList() {
  fetch(urlOfProductsList)
    .then(response => response.json())
    .then((object) => {
      handleProductList(object.results);
    });
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

window.onload = function onload() {
  getProductList();
};
