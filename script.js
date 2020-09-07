

const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};

const urlInitial = `${apiInfo.api}${apiInfo.endpoint}`;
const listItems = document.querySelector('.cart__items');


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

function saveCart() {
  const listItems = document.querySelector('.cart__items');
  localStorage.setItem('cartList', listItems.innerHTML);
  const addList = document.querySelectorAll('li');
  addList.forEach((li) => {
    li.addEventListener('click', loadCart);
  });
}

function loadCart() {
  const listStorage = localStorage.getItem('cartList', listItems.innerHTML);
  listItems.innerHTML = listStorage;
}

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  list.removeChild(event.target);
  saveCart();
}

function clearCart() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
}
const btnClearCart = document.querySelector('.empty-cart');
// btnClearCart.addEventListener('click', clearCart);

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
  fetchCurrency();
  // if (localStorage.Item) {
  //   document.querySelector('.cart__items').innerHTML = localStorage.Item;
  // }
};
