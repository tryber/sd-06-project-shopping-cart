function cartItemClickListener(event) {
  const itemsList = document.querySelector('.cart__items');
  itemsList.removeChild(event.target);
}

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
  const thisButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  thisButton.addEventListener('click', function () {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(r => r.json())
    .then((product) => {
      const item = createCartItemElement(product);
      const shoppingCart = document.querySelector('.cart__items');
      shoppingCart.appendChild(item);
    });
  });
  section.appendChild(thisButton);

  return section;
}

function appendItem(container, item) {
  container.appendChild(item);
}

const renderProduct = (arrayOfProducts) => {
  arrayOfProducts.forEach((product) => {
    appendItem(document.querySelector('.items'), createProductItemElement(product));
  });
};

const fetchAPI = (endpoint) => {
  fetch(`${'https://api.mercadolibre.com/sites/MLB/search?q='}${endpoint}`)
  .then(response => response.json())
  .then(data => data.results)
  .then((products) => {
    renderProduct(products);
  });
};

window.onload = function onload() {
  fetchAPI('computador');
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
