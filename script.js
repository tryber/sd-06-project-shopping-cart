const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};

const urlInitial = `${apiInfo.api}${apiInfo.endpoint}`;

setTimeout(() => {
  document.querySelector('.loading').remove();
}, 3000);

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

function loadCart() {
  const listStorage = document.querySelector('.cart__items');
  localStorage.setItem('cartList', listStorage.innerHTML);
}

function saveCart() {
  const listItems = document.querySelector('.cart__items');
  localStorage.setItem('cartList', listItems.innerHTML);
  const addList = document.querySelectorAll('li');
  addList
  .forEach((li) => {
    li.addEventListener('click', loadCart);
  });
}

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  list.removeChild(event.target);
  saveCart();
}

function clearCart() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
  localStorage.clear();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
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
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(object => object.json())
    .then((object) => {
      const item = createCartItemElement({
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      });
      const cart = document.querySelector('.cart__items');
      cart.appendChild(item);
      saveCart();
    });
  });

  return section;
}

const fetchCurrency = () => {
  const endpoint = urlInitial;

  fetch(endpoint)
  .then(response => response.json())
  .then((object) => {
    object.results.forEach((item) => {
      const productList = document.querySelector('.items');
      const productArray = createProductItemElement(item);
      productList.appendChild(productArray);
    });
  });
};

window.onload = function onload() {
  document.querySelector('.items').appendChild(createCustomElement('span', 'loading', 'loading...'));
  fetchCurrency();
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', clearCart);
  if (localStorage.getItem('cartList')) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartList');
    document.querySelectorAll('cart__item')
    .forEach(item =>
      item.addEventListener('click', cartItemClickListener));
  }
};
