window.onload = function onload() { };

function cartLocalStorage() {
  const cartStorage = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('Cart', cartStorage.innerHTML);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  cartLocalStorage();
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  document.querySelector('.loading').innerHTML = '';
  document.querySelector('.cart__items').appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const renderCart = (itemId) => {
  const url = 'https://api.mercadolibre.com/items/';
  const id = itemId.sku;
  const endpoint = `${url}${id}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((response) => {
    const itemToAddOnCart = {
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    createCartItemElement(itemToAddOnCart);
    cartLocalStorage();
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    renderCart({ sku });
  });
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    cartLocalStorage();
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function loading() {
  await document.querySelector('.cart').appendChild(createCustomElement('span', 'loading', 'loading'));
}

const apiSearch = () => {
  fetch('https:api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((response) => {
      const resultsOfResponse = response.results;
      resultsOfResponse.forEach((item) => {
        const arrayOfItems = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(arrayOfItems);
      });
    });
};
function readLocalStorage() {
  const cartGetItem = localStorage.getItem('Cart');
  document.querySelector('.cart__items').innerHTML = cartGetItem;
}

// function showImage(e) {
//   const getFile = e.target.files[0];
//   memeImg.src = URL.createObjectURL(getFile);
// }
// output.addEventListener('change', showImage);

function setupEventListener() {
  const eachItem = document.querySelectorAll('.cart__items');
  eachItem.forEach(item => item.addEventListener('click', cartItemClickListener));
}

window.onload = () => {
  loading();
  apiSearch();
  readLocalStorage();
  setupEventListener();
};
