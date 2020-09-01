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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {

// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const handleCreatListCart = (objectToShopCart) => {
  const arrayProducts = document.querySelector('.cart__items');
  arrayProducts.appendChild(createCartItemElement(objectToShopCart));
};

function idProductSelected() {
  const eventClick = event.target.parentElement;
  const idProduct = getSkuFromProductItem(eventClick);
  const endpoint = `https://api.mercadolibre.com/items/${idProduct}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      handleCreatListCart(object);
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', idProductSelected);

  return section;
}

const filterItemsProducts = (arrayItems) => {
  arrayItems.forEach((product) => {
    const itemSection = document.querySelector('.items');
    itemSection.appendChild(createProductItemElement(product));
  });
};

const apiJSON = () => {
  fetch(url)
    .then(response => response.json())
    .then(object => filterItemsProducts(object.results));
};

window.onload = function onload() {
  apiJSON();
};
