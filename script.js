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


function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchSingleItem(itemID) {
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(single => single.json())
    .then((single) => {
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement(single));
    });
}

function addItemToCart(event, sku) {
  if (event.target.className === 'item__add') {
    fetchSingleItem(sku);
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', event => addItemToCart(event, sku));
  return section;
}

function loading() {
  const items = document.querySelector('.items');
  const title = document.createElement('h1');
  title.className = 'loading';
  title.innerText = 'loading...';
  items.appendChild(title);
}

function fetchList() {
  const items = document.querySelector('.items');
  const loadingMessage = document.querySelector('.loading');
  const URL_TO_FETCH = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL_TO_FETCH)
    .then(response => response.json())
    .then((result) => {
      const item = document.querySelector('section.items');
      result.results.forEach(element =>
        item.appendChild(createProductItemElement(element)));
    })
    .catch((err) => {
      console.error('Falha na obtenção dos dados', err);
    })
    .finally(() => items.removeChild(loadingMessage));
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function removeCartItems() {
  const cleanAll = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  cleanAll.addEventListener('click', () => {
    while (cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }
    localStorage.clear();
  });
}

window.onload = function onload() {
  loading();
  fetchList();
  removeCartItems();
};
