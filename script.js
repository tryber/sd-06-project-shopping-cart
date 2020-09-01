const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=$',
  query: 'computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}${apiInfo.query}`;

//  Using .match and regex to filter numbers given interval
//  /[0-9.0-9]+$/ => All numbers after 'whatever' character
//  Number must be at the end of sentence (no spaces allowed)
//  Ref: https://www.regular-expressions.info/anchors.html
//  Tests: https://regex101.com/     

const sumOfPrices = async () => {
  const cartItems = await document.querySelectorAll('.cart__item');
  const getPrice = [...cartItems]
    .map(value => value.innerText.match(/[0-9.0-9]+$/))
    .reduce((accumulator, value) => accumulator + parseFloat(value), 0);
  document.querySelector('.total-price').innerHTML = getPrice;
}

const localStorageSave = () => {
  const cartItem = document.querySelector('.cart__items');
  localStorage.setItem('items', cartItem.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.clear();
  localStorageSave();
  sumOfPrices();
}

const emptyCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  const cartItems = document.getElementsByTagName('li');
  btnClear.addEventListener('click', () => {
    while (cartItems.length) {
      cartItems[0].remove();
    }
    document.querySelector('.total-price').innerText = '0';
    localStorage.clear();
  });
};

const handleError = (errorMessage) => {
  window.alert(errorMessage);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const localStorageLoad = () => {
  const getCartItem = document.querySelector('.cart__items');
  const getCart = localStorage.getItem('items');
  getCartItem.innerHTML = getCart;
  getCartItem.addEventListener('click', cartItemClickListener);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((element) => {
      const item = createCartItemElement({
        sku: element.id,
        name: element.title,
        salePrice: element.price,
      });
      document.querySelector('.cart__items').appendChild(item);
      sumOfPrices();
      localStorageSave();
    })
    .catch(error => handleError(error));
  });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchComputer = () => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const item = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(item);
      });
    })
    .then(() => localStorageLoad())
    .then(() => sumOfPrices())
    .then(() => setTimeout(() => document.querySelector('.loading').remove(), 2000))
    .catch(error => handleError(error));
};

function loadingPage() {
  const loading = document.getElementById('load');
  loading.className = 'loading';
  loading.innerText = 'loading...';
}

window.onload = () => {
  loadingPage();
  fetchComputer();
  emptyCart();
};
