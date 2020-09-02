const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

let sum = 0;

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

const localStorageShopCart = () => {
  const shopCart = document.querySelector('.cart__items').innerHTML;
  localStorage.shopCart = shopCart;

  const priceCart = document.querySelector('.total-price').innerHTML;
  localStorage.priceCart = priceCart;
  // console.log(shopCart);
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorageShopCart();
}

async function sumPriceItemShopCart(salePrice) {
  const sumPrice = document.querySelector('.total-price');
  // sum += Math.round(salePrice * 100) / 100;
  sum += salePrice;
  sumPrice.innerHTML = `${Math.round(sum * 100) / 100}`;
}

// async function decrementPriceItemShopCart() {
//   const sumPrice = document.querySelector('.total-price');
//   // sum -= Math.round(salePrice * 100) / 100;
//   sum -= salePrice;
//   sumPrice.innerHTML = `Total: R$ ${Math.round(sum * 100) / 100}`;
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', async function decrementPriceItemShopCart() {
    const sumPrice = document.querySelector('.total-price');
    // sum -= Math.round(salePrice * 100) / 100;
    sum -= salePrice;
    sumPrice.innerHTML = `${Math.round(sum * 100) / 100}`;
    localStorageShopCart();
    // console.log(sumPrice)
  });
  // console.log(salePrice)
  sumPriceItemShopCart(salePrice);

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
    })
    .then(() => localStorageShopCart());
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

const saveLocalStorage = () => {
  if (localStorage.shopCart && localStorage.priceCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.shopCart;
    document.querySelector('.total-price').innerHTML = localStorage.priceCart;
  }
};

const removeCartItemClickListener = () => {
  document.querySelectorAll('.cart__item')
    .forEach(item => item.addEventListener('click', cartItemClickListener));
};

const cleanItemsCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerHTML = `${0}`;
  localStorageShopCart();
};

const clickButtonToCleanCart = () => {
  document.querySelector('.empty-cart')
    .addEventListener('click', cleanItemsCart);
};

window.onload = function onload() {
  apiJSON();
  saveLocalStorage();
  removeCartItemClickListener();
  clickButtonToCleanCart();
};
