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
// essa função cria a estrutura de hmtl dos produtos: img,title...

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function setLocalStorage() {
  const listSalve = document.querySelector('.cart__items');
  localStorage.setItem('listSalve', listSalve.innerHTML);
  console.log(listSalve.innerHTML);
}

function getLocalStorage() {
  const listSalve = document.querySelector('.cart__items');
  listSalve.innerHTML = localStorage.getItem('listSalve');
}

function cartItemClickListener(event) {
  event.addEventListener('click', () => {
    const list = document.querySelector('.cart__items');
    list.removeChild(event);
    setLocalStorage();
  });
}

function emptyCart() {
  const buttonClearList = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  buttonClearList.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener(li));
  return li;
}
function clickButton(event) {
  const itemId = event.path[1].childNodes[0].innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const cartItem = createCartItemElement(object);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(cartItem);
      setLocalStorage();
    });
}
function functionRenderItem(arrayProducts) {
  arrayProducts.forEach((element) => {
    const newItem = createProductItemElement(element);
    const section = document.querySelector('.items');
    section.appendChild(newItem).addEventListener('click', clickButton);
  });
}
function addCartCachedItemsAListener() {
  const cachedList = document.querySelectorAll('.cart__item');
  cachedList.forEach((element) => {
    cartItemClickListener(element);
  });
}
const query = 'computador';
const apiInfo = {
  api: 'https://api.mercadolibre.com/',
  endpoint: 'sites/MLB/search?q=',
};

const url = `${apiInfo.api}${apiInfo.endpoint}${query}`;

function loadingFetch() {
  const element = document.createElement('p');
  element.classList.add('loading');
  element.innerHTML = 'Loading...';
  document.querySelector('.container').appendChild(element);
}

const fecthItems = () => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      const resultsArray = object.results;
      functionRenderItem(resultsArray);
    })
    .then(() => {
      const element = document.querySelector('.loading');
      document.querySelector('.container').removeChild(element);
    });
};
window.onload = function onload() {
  loadingFetch();
  fecthItems(url);
  emptyCart();
  getLocalStorage();
  addCartCachedItemsAListener();
};
