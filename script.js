const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=computador',
};

const url = apiInfo.api;

const storage = () => {
  localStorage.setItem('cart', document.querySelector('.cart__items'));
};

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
  event.target.remove();
  storage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const renderCartItem = (event) => {
  const id = event.target.parentNode.firstChild.innerHTML;

  const endpoint2 = `https://api.mercadolibre.com/items/${id}`;

  fetch(endpoint2)
    .then(response => response.json())
    .then((object) => {
      const cartItem = createCartItemElement(object);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(cartItem);
    });
  storage();
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', renderCartItem);
  section.appendChild(button);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const empty = () => {
  const emptyCart = document.querySelector('.empty-cart');

  emptyCart.addEventListener('click', function () {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
  storage();
};

const renderItem = (arrayOfProducts) => {
  arrayOfProducts.forEach((product) => {
    const items = document.querySelector('.items');
    const itemList = createProductItemElement(product);
    items.appendChild(itemList);
  });
};

const fetchProduct = () => {
  const endpoint = url;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const resultado = object.results;
      renderItem(resultado);
    });
};

window.onload = function onload() {
  fetchProduct();
  empty();
  document.querySelector('.cart__items') = localStorage.getItem('cart');
};
