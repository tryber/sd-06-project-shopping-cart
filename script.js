const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

function addLocalItem() {
  const buyToLocal = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('computerLocalStorage', buyToLocal);
}

// function removeLocalItem() {
//   const removeFromLocal = document.querySelector('.cart__item').innerHTML;
//   // localStorage.removeItem('computerLocalStorage', removeFromLocal);
// }

function loadStorageList() {
  if (localStorage.computerLocalStorage) {
    const loadOl = document.querySelector('.cart__items');
    loadOl.innerHTML = localStorage.getItem('computerLocalStorage');
    document.querySelectorAll('li').forEach(element => element.addEventListener('click', cartItemClickListener));
  }
}

// async function fetchComputer (endpoint) {
//   const response = await fetch(endpoint);
//   const object = await response.json();

//   const data = {
//     sku: object.result.id,

//   }

//   createProductItemElement(object.result);
// }

// addLocalItem(JSON.stringify({
//   sku: object.id,
//   name: object.title,
//   salePrice: object.price,

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const removeItem = document.querySelector('.cart__items');
  removeItem.removeChild(event.target);
  addLocalItem();
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// function clearCart() {
//   const removeAllItems = document.querySelector('.empty-cart');
//   const fatherElementToRemove = document.querySelector('.cart__items');
//   removeAllItems.addEventListener('click', fatherElementToRemove.removeChild());
// }

function emptyCartButton() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    addLocalItem();
  });
}

function fetchBuyedComputer(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((object) => {
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement({
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      }));
      addLocalItem();
    });
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonId = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonId.addEventListener('click', () => fetchBuyedComputer(sku));
  section.appendChild(buttonId);
  return section;
}

// JSON.parse()  ---> to json


// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// let a = (JSON.parse(localStorage[0]));
// console.log(a.sku);

function loadingQuery() {
  const newElement = document.createElement('div');
  newElement.className = 'loading';
  newElement.innerText = 'loading...';
  const fatherLoad = document.querySelector('.items');
  fatherLoad.appendChild(newElement);
}

// loadingQuery();

function fetchComputer() {
  loadingQuery();
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      document.querySelector('.items').innerHTML = '';
      object.results.forEach((computer) => {
        const fatherElement = document.querySelector('.items');
        fatherElement.appendChild(createProductItemElement(computer));
      });
    });
}

window.onload = function onload() {
  fetchComputer();
  loadStorageList();

  emptyCartButton();
};
