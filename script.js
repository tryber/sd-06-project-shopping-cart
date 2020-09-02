let sum = 0;

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';


async function sumPrices(salePrice) {
  sum += salePrice;
  document.querySelector('.total-price').innerText = `${sum}`;
  console.log(sum);
}

const localStorageShopCart = () => {
  const shopCart = document.querySelector('.cart__items').innerHTML;
  // console.log(shopCart);
  localStorage.shopCart = shopCart;

  const priceCart = document.querySelector('.total-price').innerHTML;
  // console.log(priceCart);
  localStorage.priceCart = priceCart;
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorageShopCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  li.addEventListener('click', async function decrementPriceItemShopCart() {
    const sumPrice = document.querySelector('.total-price');
    sum -= salePrice;
    sumPrice.innerHTML = `${Math.round(sum * 100) / 100}`;
    localStorageShopCart();
    console.log(sumPrice);
  });

  sumPrices(salePrice);
  return li;
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const handleCreatListCart = (objectForCart) => {
  const arrayProducts = document.querySelector('.cart__items');
  arrayProducts.appendChild(createCartItemElement(objectForCart));
};

function findId() {
  const click = event.target.parentElement;
  console.log(click);

  const idProduct = getSkuFromProductItem(click);
  console.log(idProduct);

  const endpoint = `https://api.mercadolibre.com/items/${idProduct}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      console.log(object);
      handleCreatListCart(object);
    })
    .then(() => localStorageShopCart());
}

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', findId);

  return section;
}

const filterElementsObjectApi = (elementsArray) => {
  elementsArray.forEach((element) => {
    const arrayProducts = document.querySelector('.items');
    arrayProducts.appendChild(createProductItemElement(element));
  });
};

const handleAPI = () => {
  fetch(url)
  .then(response => response.json())
  .then((object) => {
    console.log(object);
    const objectNew = object.results;
    console.log(object.results);
    filterElementsObjectApi(objectNew);
  });
};

const saveLocalStorage = () => {
  if (localStorage.shopCart && localStorage.priceCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.shopCart;
    document.querySelector('.total-price').innerHTML = localStorage.shopCart;
  }
};

const removeCartItemClickListener = () => {
  document.querySelectorAll('.cart__item')
    .forEach(element => element.addEventListener('click', cartItemClickListener));
  localStorageShopCart();
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
  handleAPI();
  saveLocalStorage();
  removeCartItemClickListener();
  clickButtonToCleanCart();
};
