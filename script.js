const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=',
  query: '$computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}${apiInfo.query}`;

async function sumOfPrices() {
  const itensOnCart = await document.querySelectorAll('.cart__item');
  const numberOnPrice = [...itensOnCart]
    .map(number => number.innerText.match(/[0-9.0-9]+$/))// Referência: https://www.regular-expressions.info/anchors.html
    .reduce((acc, val) => acc + parseFloat(val), 0);
  document.querySelector('.total-price').innerHTML = numberOnPrice;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumOfPrices();
}

const emptyCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  const cartItems = document.getElementsByTagName('li');
  btnClear.addEventListener('click', () => {
    while (cartItems.length > 0) {
      document.getElementsByTagName('li')[0].remove();
    }
    document.querySelector('.total-price').innerText = '0';
  });
  localStorage.clear();
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

const localStorageSave = () => {
  const itemsOnCart = document.querySelector('.cart__items');
  localStorage.setItem('items', itemsOnCart.innerHTML);
};

const localStorageLoad = () => {
  const getCartItens = document.querySelector('.cart__items');
  const getCart = localStorage.getItem('items');
  getCartItens.innerHTML = getCart;
  getCartItens.addEventListener('dblclick', cartItemClickListener);
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
      const itemList = document.querySelector('.cart__items');
      itemList.appendChild(item);
      sumOfPrices();
      localStorageSave();
    });
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
