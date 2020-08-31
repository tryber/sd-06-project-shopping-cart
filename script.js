const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function includeItemcart(item) {
  const list = document.querySelector('.cart__items');
  list.appendChild(item);
}

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function ItemclickListener(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const item = createCartItemElement(object);
      includeItemcart(item);
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ItemclickListener);
  section.appendChild(button);

  return section;
}

function renderProducts(arrayProducts) {
  arrayProducts.forEach((product) => {
    const section = document.querySelector('.items');
    const itemProduct = createProductItemElement(product);
    section.appendChild(itemProduct);
  });
}

function fetchComputer() {
  const endpoint = url;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const products = object.results;
      renderProducts(products);
    });
}

window.onload = function onload() {
  fetchComputer();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
